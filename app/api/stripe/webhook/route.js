// --- app/api/stripe/webhook/route.js ---
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

// --- Configuración de Resend ---
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend inicializado correctamente.');
} else {
  console.warn('⚠️ RESEND_API_KEY no configurado. No se enviarán correos.');
}

const OWNER_EMAIL = process.env.OWNER_EMAIL; // correo de tu hermana
const EMAIL_FROM = process.env.EMAIL_FROM || 'Maje Nail Spa <onboarding@resend.dev>';

// --- Webhook principal ---
export async function POST(req) {
  const firma = req.headers.get('stripe-signature');
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secreto) {
    console.error('❌ Falta STRIPE_WEBHOOK_SECRET');
    return new NextResponse('Falta STRIPE_WEBHOOK_SECRET', { status: 500 });
  }

  let evento;
  try {
    const cuerpoCrudo = await req.text(); // obligatorio para verificar firma
    evento = stripe.webhooks.constructEvent(cuerpoCrudo, firma, secreto);
  } catch (err) {
    console.error('⚠️ Fallo verificación de firma Stripe:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    console.log(`📩 Evento recibido: ${evento.type}`);

    // --- Solo procesamos los eventos relevantes ---
    if (
      evento.type === 'checkout.session.completed' ||
      evento.type === 'payment_intent.succeeded'
    ) {
      const data = evento.data.object;

      // --- ID del documento (session o payment_intent) ---
      const orderId = data.id || data.payment_intent || data.client_secret;
      const refOrden = doc(db, 'orders', orderId);
      const yaExiste = await getDoc(refOrden);

      if (yaExiste.exists()) {
        console.log('⚠️ Orden duplicada, se ignora:', orderId);
        return NextResponse.json({ ok: true, duplicated: true });
      }

      const isSession = evento.type === 'checkout.session.completed';
      let comprador = {};
      let items = [];
      let total = 0;
      let currency = 'usd';
      let carrito = null;

      // --- Si viene de checkout.session.completed ---
      if (isSession) {
        const session = data;
        currency = session.currency;
        total = session.amount_total;

        comprador = {
          email: session.customer_details?.email || session.customer_email || '',
          name: session.customer_details?.name || '',
        };

        carrito = parseSeguro(session.metadata?.cart_json);

        // --- Obtener line items ---
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
        items = lineItems.data.map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amount_total: li.amount_total,
          currency: session.currency,
        }));
      } else {
        // --- Si viene de payment_intent.succeeded ---
        const pi = data;
        total = pi.amount || pi.amount_received || 0;
        currency = pi.currency || 'usd';

        // Intentamos obtener datos del cargo asociado
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

      // --- Guardar en Firestore ---
      await setDoc(refOrden, {
        stripe_id: orderId,
        type: evento.type,
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

      // --- Enviar correos (comprador + dueña) ---
      if (resend) {
        try {
          if (comprador.email) {
            await resend.emails.send({
              from: EMAIL_FROM,
              to: comprador.email,
              subject: 'Confirmación de compra - Mentorías Maje Nail Spa',
              html: htmlComprador({
                comprador,
                items,
                totalCents: total,
                currency,
              }),
            });
            console.log('📤 Email enviado al comprador:', comprador.email);
          }

          if (OWNER_EMAIL) {
            await resend.emails.send({
              from: EMAIL_FROM,
              to: OWNER_EMAIL,
              subject: '💅 Nueva venta confirmada',
              html: htmlDueno({
                comprador,
                items,
                totalCents: total,
                currency,
                orderId,
              }),
            });
            console.log('📤 Email enviado a la dueña:', OWNER_EMAIL);
          }
        } catch (err) {
          console.error('⚠️ Error enviando email:', err);
        }
      } else {
        console.warn('⚠️ Resend no inicializado, no se enviaron correos.');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('💥 Error procesando webhook:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

// --- Helpers ---
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
