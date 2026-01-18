// app/api/stripe/webhook/route.js
export const runtime = 'nodejs'; // Stripe webhooks requieren node runtime

import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// ===== Configuración Resend =====
const EMAIL_FROM = process.env.EMAIL_FROM || 'Maje Nail Spa <onboarding@resend.dev>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || '';
const OWNER_PHONE = '+1 (321) 314-5268'; // Teléfono de contacto de la dueña

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
    return f.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

async function enviarEmails({ comprador, items, totalCents, currency, orderId, cartSummary, bookingDates, packageInfo, paymentType, isPresencialClass, whatsappGroupUrl }) {
  if (!resend) return;

  // Cliente
  if (comprador?.email) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: comprador.email,
        subject: 'Confirmación de compra - Mentorías Maje Nail Spa',
        html: htmlComprador({ comprador, items, totalCents, currency, cartSummary, bookingDates, packageInfo, paymentType, isPresencialClass, whatsappGroupUrl }),
      });
      console.log('📤 Email cliente:', comprador.email);
    } catch (e) {
      console.error('❌ Email cliente:', e);
    }
  }

  // Dueña
  if (OWNER_EMAIL) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: OWNER_EMAIL,
        subject: '💅 Nueva venta confirmada',
        html: htmlDueno({ comprador, items, totalCents, currency, orderId, cartSummary, bookingDates, packageInfo, paymentType }),
      });
      console.log('📤 Email owner:', OWNER_EMAIL);
    } catch (e) {
      console.error('❌ Email owner:', e);
    }
  }
}

function htmlComprador({ comprador, items, totalCents, currency, cartSummary = [], bookingDates = {}, packageInfo = null, paymentType = 'full', isPresencialClass = false, whatsappGroupUrl = null }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#E91E63">¡Gracias por tu compra${comprador?.name ? ', ' + comprador.name : ''}!</h2>
    <p>Tu inscripción para las siguientes ${isPresencialClass ? 'clases' : 'mentorías'} fue confirmada:</p>
    <p style="margin:8px 0"><strong>Teléfono de contacto:</strong> ${OWNER_PHONE}</p>

    ${packageInfo ? `
    <div style="background:linear-gradient(135deg, #FFC107 0%, #FF9800 100%);padding:12px;border-radius:10px;margin:12px 0">
      <p style="margin:0;color:#fff;font-weight:bold;text-align:center">
        ✨ Paquete ${packageInfo.type} - ${packageInfo.discount}% de descuento aplicado
      </p>
      ${packageInfo.marketingFormat ? `<p style="margin:4px 0 0;color:#fff;font-size:13px;text-align:center">
        Incluye curso de Marketing ${packageInfo.marketingFormat === 'presencial' ? 'Presencial (3er día)' : 'Online (vía Zoom)'}
      </p>` : ''}
    </div>
    ` : ''}

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
    <p style="font-size:18px;margin-top:12px"><strong>${paymentType === 'reservation' ? 'Reserva Pagada (30%):' : 'Total Pagado:'}</strong> ${money(totalCents, currency)}</p>
    ${paymentType === 'reservation' && cartSummary.length > 0 ? `<p style="font-size:14px;color:#666;margin:8px 0">El saldo restante se debe abonar 3 días antes de la clase. Se te comunicará por interno.</p>` : ''}
    
    ${isPresencialClass && whatsappGroupUrl ? `
    <div style="background:#25D366;padding:16px;border-radius:10px;margin:16px 0;text-align:center">
      <p style="margin:0 0 12px;color:#fff;font-weight:bold;font-size:16px">📱 ¡Únete al grupo de la clase!</p>
      <a href="${whatsappGroupUrl}" target="_blank" style="display:inline-block;background:#fff;color:#25D366;padding:12px 24px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px">Unirme al Grupo de WhatsApp</a>
    </div>
    ` : ''}
    
    <p style="margin-top:18px">En breve te contactaremos para coordinar detalles. 💅</p>
  </div>`;
}

function htmlDueno({ comprador, items, totalCents, currency, orderId, cartSummary = [], bookingDates = {}, packageInfo = null, paymentType = 'full' }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#E91E63">💅 Nueva venta confirmada</h2>
    <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin:10px 0">
      <p style="margin:4px 0"><strong>Orden:</strong> ${orderId}</p>
      <p style="margin:4px 0"><strong>Cliente:</strong> ${comprador?.name || '-'}</p>
      <p style="margin:4px 0"><strong>Email:</strong> ${comprador?.email || '-'}</p>
      <p style="margin:4px 0"><strong>Teléfono:</strong> ${comprador?.phone || '-'}</p>
      ${packageInfo ? `<p style="margin:4px 0"><strong>Paquete:</strong> ${packageInfo.type} (${packageInfo.discount}% OFF)${packageInfo.marketingFormat ? ` + Marketing ${packageInfo.marketingFormat}` : ''}</p>` : ''}
      ${paymentType === 'reservation' ? `<p style="margin:4px 0;color:#ff6600"><strong>Tipo de pago:</strong> RESERVA 30% - Saldo pendiente 3 días antes</p>` : ''}
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
    <p style="font-size:18px;margin-top:12px"><strong>${paymentType === 'reservation' ? 'Reserva (30%):' : 'Total:'}</strong> ${money(totalCents, currency)}</p>
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

    // Obtener nombre del custom field si existe, sino usar el del titular de tarjeta
    let customerName = session.customer_details?.name || '';
    if (session.custom_fields && session.custom_fields.length > 0) {
      const nameField = session.custom_fields.find(field => field.key === 'customer_name');
      if (nameField && nameField.text && nameField.text.value) {
        customerName = nameField.text.value;
      }
    }

    const comprador = {
      email: session.customer_details?.email || session.customer_email || '',
      name: customerName,
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

    // Reconstruir booking dates desde formato compacto
    let bookingDates = null;
    if (session.metadata?.booking_dates) {
      // Formato compacto: "id1:date1|id2:date2"
      const entries = session.metadata.booking_dates.split('|');
      bookingDates = {};
      entries.forEach(entry => {
        const [id, date] = entry.split(':');
        if (id && date) bookingDates[id] = date;
      });
    } else {
      // Reconstruir desde múltiples campos si fue dividido
      let datesStr = '';
      let i = 0;
      while (session.metadata?.[`dates_${i}`]) {
        datesStr += session.metadata[`dates_${i}`];
        i++;
      }
      if (datesStr) {
        const entries = datesStr.split('|');
        bookingDates = {};
        entries.forEach(entry => {
          const [id, date] = entry.split(':');
          if (id && date) bookingDates[id] = date;
        });
      }
    }

    // Reconstruir cart summary desde formato compacto
    let cartSummary = null;
    const paymentType = session.metadata?.payment_type || 'full';
    const isPresencialClass = session.metadata?.type === 'presencial_class';

    if (isPresencialClass) {
      cartSummary = [{
        id: session.metadata.courseId,
        title: session.metadata.courseTitle,
        price: session.amount_total / 100,
        full_price: session.metadata.full_price ? parseFloat(session.metadata.full_price) : undefined,
        quantity: 1,
        // These fields help with email consistency
        dateText: session.metadata.dateText,
        bookingDate: session.metadata.bookingDate
      }];
      bookingDates = {
        [session.metadata.courseId]: session.metadata.bookingDate
      };
    } else if (session.metadata?.course_ids) {
      const ids = session.metadata.course_ids.split(',');
      const titles = session.metadata.course_titles?.split('|') || [];

      if (paymentType === 'reservation') {
        const fullPrices = session.metadata.full_prices?.split(',') || [];
        const reservationAmounts = session.metadata.reservation_amounts?.split(',') || [];
        const remaining = session.metadata.remaining?.split(',') || [];

        cartSummary = ids.map((id, index) => ({
          id,
          title: titles[index] || 'Mentoría',
          price: parseFloat(fullPrices[index] || 0),
          reservation_paid: parseFloat(reservationAmounts[index] || 0),
          remaining_balance: parseFloat(remaining[index] || 0),
          isMarketingCourse: id === 'marketing',
        }));
      } else {
        const prices = session.metadata.prices?.split(',') || [];

        cartSummary = ids.map((id, index) => ({
          id,
          title: titles[index] || 'Mentoría',
          price: parseFloat(prices[index] || 0),
          isMarketingCourse: id === 'marketing',
        }));
      }
    }

    // Parsear info del paquete si existe (formato: "GOLD|15|presencial")
    let packageInfo = null;
    if (session.metadata?.package) {
      const [type, discount, marketingFormat] = session.metadata.package.split('|');
      packageInfo = {
        type,
        discount: parseInt(discount) || 0,
        marketingFormat: marketingFormat !== 'none' ? marketingFormat : null,
      };
    }

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
      package_info: packageInfo,
      payment_type: paymentType,
      status: 'paid',
      createdAt: new Date(), // admin SDK server timestamp alternativo
      source: 'stripe-webhook',
    });

    // Variable para guardar la URL del grupo de WhatsApp
    let whatsappGroupUrl = null;

    if (isPresencialClass && cartSummary) {
      console.log('Procesando reserva Presencial para', orderId);
      for (const item of cartSummary) {
        // Increment enrolled y obtener la URL del grupo de WhatsApp
        const courseRef = adminDb.collection('presencial_courses').doc(item.id);
        const courseDoc = await courseRef.get();
        if (courseDoc.exists) {
          const courseData = courseDoc.data();
          // Guardar la URL del grupo de WhatsApp si existe
          if (courseData.whatsappGroupUrl) {
            whatsappGroupUrl = courseData.whatsappGroupUrl;
          }
        }
        await courseRef.update({
          enrolled: FieldValue.increment(1)
        });

        // Add booking
        await adminDb.collection('bookings').add({
          orderId,
          userId: comprador.email || 'guest',
          clientName: comprador.name,
          clientEmail: comprador.email,
          clientPhone: comprador.phone,
          serviceId: item.id,
          serviceName: `Clase Grupal: ${item.title}`,
          bookingDate: item.bookingDate,
          dateText: item.dateText,
          status: 'paid',
          createdAt: FieldValue.serverTimestamp(),
          amount: (item.price || 0) * 100,
          price: (item.full_price || item.price || 0) * 100,
          pricePaid: (item.price || 0) * 100,
          paymentType: paymentType || 'full',
          currency,
          source: 'stripe-webhook'
        });
      }
    }

    if (!isPresencialClass && bookingDates && cartSummary) {
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

          // Determinar precio total y monto pagado según tipo de pago
          let fullPrice = 0;
          let amountPaid = 0;

          if (paymentType === 'reservation') {
            // Reserva: guardamos precio total y lo que pagaron (30%)
            fullPrice = (item.price || 0) * 100; // Precio completo del servicio
            amountPaid = (item.reservation_paid || 0) * 100; // 30% que pagaron
          } else {
            // Pago completo
            fullPrice = (item.price || 0) * 100;
            amountPaid = (item.price || 0) * 100;
          }

          transaction.set(newBookingRef, {
            orderId,
            serviceId: courseId,
            serviceName: item.title,
            bookingDate,
            price: fullPrice, // Precio total del servicio
            pricePaid: amountPaid, // Monto realmente pagado
            paymentType, // 'full' o 'reservation'
            currency,
            isPartOfOffer: item.price === 0 && item.isMarketingCourse,
            buyer: comprador,
            status: paymentType === 'reservation' ? 'reserved' : 'paid',
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

    await enviarEmails({ comprador, items, totalCents: total, currency, orderId, cartSummary, bookingDates, packageInfo, paymentType, isPresencialClass, whatsappGroupUrl });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('💥 Error webhook:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
