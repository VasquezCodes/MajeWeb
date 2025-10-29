// --- app/api/stripe/webhook/route.js ---
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

// ===== Configuración Resend =====
const EMAIL_FROM = process.env.EMAIL_FROM || 'Maje Nail Spa <onboarding@resend.dev>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || '';
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend inicializado.');
} else {
  console.warn('⚠️ RESEND_API_KEY no configurado. No se enviarán correos.');
}

// ====== Helper emails (comprador + dueña) ======
async function enviarEmails({ comprador, items, totalCents, currency, orderId }) {
  if (!resend) {
    console.warn('⚠️ Resend no inicializado; se omiten emails.');
    return;
  }

  // 1) Email al comprador (si tenemos email)
  if (comprador?.email) {
    try {
      const resp = await resend.emails.send({
        from: EMAIL_FROM,
        to: comprador.email,
        subject: 'Confirmación de compra - Mentorías Maje Nail Spa',
        html: htmlComprador({ comprador, items, totalCents, currency }),
      });
      console.log('📤 Email COMPRADOR enviado:', comprador.email, resp?.id || '');
    } catch (e) {
      console.error('❌ Error email COMPRADOR:', e);
    }
  } else {
    console.warn('⚠️ Sin email de comprador; no se envía confirmación al cliente.');
  }

  // 2) Email a la dueña (si está configurado)
  if (OWNER_EMAIL) {
    try {
      const resp = await resend.emails.send({
        from: EMAIL_FROM,
        to: OWNER_EMAIL,
        subject: '💅 Nueva venta confirmada',
        html: htmlDueno({ comprador, items, totalCents, currency, orderId }),
      });
      console.log('📤 Email OWNER enviado a:', OWNER_EMAIL, resp?.id || '');
    } catch (e) {
      console.error('❌ Error email OWNER:', e);
    }
  } else {
    console.warn('⚠️ OWNER_EMAIL no configurado; no se envía correo a la dueña.');
  }
}

// ====== Webhook principal ======
export async function POST(req) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('❌ Falta STRIPE_WEBHOOK_SECRET');
    return new NextResponse('Falta STRIPE_WEBHOOK_SECRET', { status: 500 });
  }

  let event;
  try {
    const raw = await req.text(); // necesario para verificar firma
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error('⚠️ Verificación de firma falló:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    console.log(`📩 Evento recibido: ${event.type}`);

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'payment_intent.succeeded'
    ) {
      const data = event.data.object;

      // ID estable para evitar duplicados
      const orderId =
        data.id ||
        data.payment_intent ||
        data.client_secret ||
        `evt_${event.id}`;

      const refOrden = doc(db, 'orders', orderId);
      const ya = await getDoc(refOrden);
      if (ya.exists()) {
        console.log('↩️ Orden ya registrada, se ignora:', orderId);
        return NextResponse.json({ ok: true, duplicated: true });
      }

      const isSession = event.type === 'checkout.session.completed';
      let comprador = {};
      let items = [];
      let total = 0;
      let currency = 'usd';
      let carrito = null;

      if (isSession) {
        // ----- checkout.session.completed -----
        const session = data;
        total = session.amount_total || 0;
        currency = session.currency || 'usd';

        comprador = {
          email: session.customer_details?.email || session.customer_email || '',
          name: session.customer_details?.name || '',
        };

        carrito = parseSeguro(session.metadata?.cart_json);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
        items = lineItems.data.map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amount_total: li.amount_total,
          currency,
        }));
      } else {
        // ----- payment_intent.succeeded -----
        const pi = data;
        total = pi.amount || pi.amount_received || 0;
        currency = pi.currency || 'usd';

        // Intentar enriquecer con cargo
        let charge = null;
        try {
          const charges = await stripe.charges.list({ payment_intent: pi.id, limit: 1 });
          charge = charges.data[0] || null;
        } catch (e) {
          console.warn('⚠️ No se pudo obtener charge:', e.message);
        }

        comprador = {
          email: charge?.billing_details?.email || pi.receipt_email || '',
          name: charge?.billing_details?.name || '',
        };

        items = [
          {
            name: charge?.description || pi.description || 'Pago individual',
            quantity: 1,
            amount_total: total,
            currency,
          },
        ];
      }

      // Guardar orden en Firestore
      await setDoc(refOrden, {
        stripe_id: orderId,
        type: event.type,
        amount_total: total,
        currency,
        buyer: comprador,
        items,
        raw_cart: carrito,
        status: 'paid',
        createdAt: serverTimestamp(),
        source: 'stripe-webhook',
      });
      console.log('✅ Orden registrada en Firestore:', orderId);

      // Envío de emails (comprador + dueña)
      await enviarEmails({
        comprador,
        items,
        totalCents: total,
        currency,
        orderId,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('💥 Error procesando webhook:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

// ===== Helpers =====
function parseSeguro(s) {
  try {
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function money(cents, currency) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `${value} ${String(currency || 'usd').toUpperCase()}`;
}

function htmlComprador({ comprador, items, totalCents, currency }) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>¡Gracias por tu compra${comprador?.name ? ', ' + comprador.name : ''}!</h2>
      <p>Tu inscripción a las mentorías fue confirmada.</p>
      <p>Resumen:</p>
      <ul>
        ${items.map(i => `<li>${i.name} × ${i.quantity} — ${money(i.amount_total, currency)}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> ${money(totalCents, currency)}</p>
      <p>Nos pondremos en contacto para coordinar tu cita 💅</p>
      <br/>
      <p>— Maje Nail Spa</p>
    </div>
  `;
}

function htmlDueno({ comprador, items, totalCents, currency, orderId }) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>💅 Nueva venta confirmada</h2>
      <p><strong>Orden:</strong> ${orderId}</p>
      <p><strong>Cliente:</strong> ${comprador?.name || '-'} (${comprador?.email || '-'})</p>
      <ul>
        ${items.map(i => `<li>${i.name} × ${i.quantity} — ${money(i.amount_total, currency)}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> ${money(totalCents, currency)}</p>
      <p>🕓 Revisá Firestore o Stripe Dashboard para más detalles.</p>
    </div>
  `;
}
