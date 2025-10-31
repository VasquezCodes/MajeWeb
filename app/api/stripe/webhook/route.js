// app/api/stripe/webhook/route.js
export const runtime = 'nodejs'; // Stripe webhooks requieren node runtime

import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
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

// ========== Helpers ==========
function parseSeguro(s) {
  try { return s ? JSON.parse(s) : null; } catch { return null; }
}
function money(cents, currency) {
  const value = (Number(cents || 0) / 100).toFixed(2);
  return `${value} ${String(currency || 'usd').toUpperCase()}`;
}
function formatearFecha(dateStr) {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    const f = new Date(y, m - 1, d);
    return f.toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  } catch { return dateStr; }
}

async function enviarEmails({ comprador, items, totalCents, currency, orderId, cartSummary, bookingDates }) {
  if (!resend) return;

  // Cliente
  if (comprador?.email) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: comprador.email,
        subject: 'Confirmación de compra - Mentorías Maje Nail Spa',
        html: htmlComprador({ comprador, items, totalCents, currency, cartSummary, bookingDates }),
      });
      console.log('📤 Email cliente:', comprador.email);
    } catch (e) {
      console.error('❌ Email cliente:', e);
    }
  }

  // Dueña
  if ( OWNER_EMAIL ) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: OWNER_EMAIL,
        subject: '💅 Nueva venta confirmada',
        html: htmlDueno({ comprador, items, totalCents, currency, orderId, cartSummary, bookingDates }),
      });
      console.log('📤 Email owner:', OWNER_EMAIL);
    } catch (e) {
      console.error('❌ Email owner:', e);
    }
  }
}

function htmlComprador({ comprador, items, totalCents, currency, cartSummary = [], bookingDates = {} }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#E91E63">¡Gracias por tu compra${comprador?.name ? ', ' + comprador.name : ''}!</h2>
    <p>Tu inscripción para las siguientes mentorías fue confirmada:</p>
    ${comprador?.phone ? `<p style="margin:8px 0"><strong>Teléfono de contacto:</strong> ${comprador.phone}</p>` : ''}
    
    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin:12px 0">
      <h3 style="margin:0 0 8px;color:#E91E63">📅 Tus Fechas</h3>
      ${cartSummary.map(item => {
        const fecha = bookingDates?.[item.id] ? formatearFecha(bookingDates[item.id]) : 'Fecha pendiente';
        const precio = item.price === 0 ? ' (GRATIS)' : '';
        return `<p style="margin:4px 0"><strong>${item.title}${precio}:</strong> ${fecha}</p>`;
      }).join('')}
      <p style="margin:12px 0 4px; font-size:12px; color:#555">Horario a confirmar. (Todas las clases inician aprox. 9:00 AM EST)</p>
    </div>
    
    <h3>Resumen</h3>
    <ul style="list-style:none;padding:0;margin:0">
      ${items.map(i => `<li style="padding:8px 0;border-bottom:1px solid #eee"><strong>${i.name}</strong> × ${i.quantity} — ${money(i.amount_total, currency)}</li>`).join('')}
    </ul>
    <p style="font-size:18px;margin-top:12px"><strong>Total Pagado:</strong> ${money(totalCents, currency)}</p>
    <p style="margin-top:18px">En breve te contactaremos para coordinar detalles. 💅</p>
  </div>`;
}

function htmlDueno({ comprador, items, totalCents, currency, orderId, cartSummary = [], bookingDates = {} }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#E91E63">💅 Nueva venta confirmada</h2>
    <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin:10px 0">
      <p style="margin:4px 0"><strong>Orden:</strong> ${orderId}</p>
      <p style="margin:4px 0"><strong>Cliente:</strong> ${comprador?.name || '-'}</p>
      <p style="margin:4px 0"><strong>Email:</strong> ${comprador?.email || '-'}</p>
      <p style="margin:4px 0"><strong>Teléfono:</strong> ${comprador?.phone || '-'}</p>
    </div>
    <div style="background:#fff3e0;padding:12px;border-radius:8px;margin:10px 0">
      <h3 style="margin:0 0 8px;color:#E91E63">Calendario</h3>
      ${cartSummary.map(item => {
        const fecha = bookingDates?.[item.id] ? formatearFecha(bookingDates[item.id]) : 'Fecha pendiente';
        const precio = item.price === 0 ? ' (GRATIS)' : '';
        return `<p style="margin:4px 0"><strong>${item.title}${precio}:</strong> ${fecha}</p>`;
      }).join('')}
    </div>
    <h3>Items</h3>
    <ul style="list-style:none;padding:0;margin:0">
      ${items.map(i => `<li style="padding:8px 0;border-bottom:1px solid #eee"><strong>${i.name}</strong> × ${i.quantity} — ${money(i.amount_total, currency)}</li>`).join('')}
    </ul>
    <p style="font-size:18px;margin-top:12px"><strong>Total:</strong> ${money(totalCents, currency)}</p>
    <p style="margin-top:16px;color:#666">Revisá Firestore o Stripe para más info.</p>
  </div>`;
}

// ========== Webhook ==========
export async function POST(req) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('❌ Falta STRIPE_WEBHOOK_SECRET');
    return new NextResponse('Falta STRIPE_WEBHOOK_SECRET', { status: 500 });
  }

  if (!adminDb) {
    console.error('❌ Firebase Admin no está configurado');
    return new NextResponse('Firebase Admin no configurado', { status: 500 });
  }

  let event;
  try {
    const raw = await req.text(); // necesario para verificar firma
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error('⚠️ Firma inválida:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    console.log(`📩 Evento: ${event.type}`);

    if (event.type !== 'checkout.session.completed') {
      // Nos enfocamos en session.completed para tener metadata completa
      return NextResponse.json({ ok: true, ignored: true });
    }

    const session = event.data.object;

    // ID estable
    const orderId = session.id || session.payment_intent || session.client_secret || `evt_${event.id}`;

    // Evitar duplicados
    const orderRef = adminDb.collection('orders').doc(orderId);
    const exists = await orderRef.get();
    if (exists.exists) {
      console.log('↩️ Orden ya registrada:', orderId);
      return NextResponse.json({ ok: true, duplicated: true });
    }

    // Datos base
    const total = session.amount_total || 0;
    const currency = session.currency || 'usd';
    const comprador = {
      email: session.customer_details?.email || session.customer_email || '',
      name: session.customer_details?.name || '',
      phone: session.customer_details?.phone || '',
    };

    // Items (line items)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const items = lineItems.data.map(li => ({
      name: li.description,
      quantity: li.quantity,
      amount_total: li.amount_total,
      currency,
    }));

    const bookingDates = parseSeguro(session.metadata?.booking_dates);
    const cartSummary = parseSeguro(session.metadata?.cart_summary);

    // ======= Guardar ORDEN
    await orderRef.set({
      stripe_id: orderId,
      type: event.type,
      amount_total: total,
      currency,
      buyer: comprador,
      items,
      cart_summary: cartSummary,
      booking_dates: bookingDates,
      status: 'paid',
      createdAt: new Date(), // admin SDK server timestamp alternativo
      source: 'stripe-webhook',
    });

    if (bookingDates && cartSummary) {
      console.log('Iniciando transacción de reserva para', orderId);

      await adminDb.runTransaction(async (transaction) => {
        const bookingsCol = adminDb.collection('bookings');
        const publicBookingsCol = adminDb.collection('publicBookedDays');
        const datesToBook = Object.values(bookingDates);

        if (datesToBook.length > 0) {
          const conflictRefs = datesToBook.map(date => publicBookingsCol.doc(date));
          const conflictSnapshot = await transaction.getAll(...conflictRefs);
          const conflictedDocs = conflictSnapshot.filter(doc => doc.exists);

          if (conflictedDocs.length > 0) {
            const conflictedDates = conflictedDocs.map(d => d.id).join(', ');
            console.error(`FALLO Transacción: Conflicto en fechas ${conflictedDates}`);
            throw new Error(`Conflicto de reserva: Las fechas ${conflictedDates} ya están ocupadas.`);
          }
        }

        for (const item of cartSummary) {
          const courseId = item.id;
          const bookingDate = bookingDates[courseId];

          if (!bookingDate) continue;

          const newBookingRef = bookingsCol.doc();

          transaction.set(newBookingRef, {
            orderId,
            serviceId: courseId,
            serviceName: item.title,
            bookingDate,
            pricePaid: (item.price || 0) * 100,
            currency,
            isPartOfOffer: item.price === 0 && item.isMarketingCourse,
            buyer: comprador,
            status: 'paid',
            createdAt: new Date(),
          });

          const publicDocRef = publicBookingsCol.doc(bookingDate);
          transaction.set(publicDocRef, {
            orderId,
            bookedAt: new Date(),
          });
        }
      });

      console.log('✅ Transacción completada. Creados', cartSummary.length, 'bookings para order', orderId);
    } else {
      console.warn('⚠️ Orden sin bookingDates, solo se guardó la orden.');
    }

    console.log('✅ Guardado en Firestore (orders & bookings):', orderId);

    await enviarEmails({ comprador, items, totalCents: total, currency, orderId, cartSummary, bookingDates });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('💥 Error webhook:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
