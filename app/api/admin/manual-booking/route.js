
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// ===== Configuración Resend =====
const EMAIL_FROM = process.env.EMAIL_FROM || 'Maje Nail Spa <onboarding@resend.dev>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || '';

let resend = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

// ========== Helpers Email (Duplicados de Webhook para aislamiento) ==========
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

function htmlComprador({ comprador, items, totalCents, currency, cartSummary = [], bookingDates = {}, packageInfo = null, paymentType = 'full' }) {
    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#E91E63">¡Gracias por tu compra${comprador?.name ? ', ' + comprador.name : ''}!</h2>
      <p>Tu inscripción manual fue confirmada tras verificar tu transferencia.</p>
      ${comprador?.phone ? `<p style="margin:8px 0"><strong>Teléfono de contacto:</strong> ${comprador.phone}</p>` : ''}
  
      ${packageInfo ? `
      <div style="background:linear-gradient(135deg, #FFC107 0%, #FF9800 100%);padding:12px;border-radius:10px;margin:12px 0">
        <p style="margin:0;color:#fff;font-weight:bold;text-align:center">
          ✨ Paquete ${packageInfo.type}
        </p>
      </div>
      ` : ''}
  
      <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin:12px 0">
        <h3 style="margin:0 0 8px;color:#E91E63">📅 Tus Fechas</h3>
        ${cartSummary.map(item => {
        const fecha = bookingDates?.[item.id] ? formatearFecha(bookingDates[item.id]) : 'Fecha pendiente';
        return `<p style="margin:4px 0"><strong>${item.title}:</strong> ${fecha}</p>`;
    }).join('')}
        <p style="margin:12px 0 4px; font-size:12px; color:#555">Horario a confirmar. (Todas las clases inician aprox. 9:00 AM EST)</p>
      </div>
  
      <h3>Resumen</h3>
      <ul style="list-style:none;padding:0;margin:0">
        ${items.map(i => `<li style="padding:8px 0;border-bottom:1px solid #eee"><strong>${i.name}</strong> × ${i.quantity} — ${money(i.amount_total, currency)}</li>`).join('')}
      </ul>
      <p style="font-size:18px;margin-top:12px"><strong>${paymentType === 'reservation' ? 'Reserva Pagada (Manual):' : 'Total Pagado (Manual):'}</strong> ${money(totalCents, currency)}</p>
      ${paymentType === 'reservation' && cartSummary.length > 0 ? `<p style="font-size:14px;color:#666;margin:8px 0">El saldo restante se debe abonar 3 días antes de la clase.</p>` : ''}
      <p style="margin-top:18px">En breve te contactaremos para coordinar detalles. 💅</p>
    </div>`;
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            clientName,
            clientEmail,
            clientPhone,
            serviceId,
            serviceName,
            amountPaid, // In cents
            totalPrice, // In cents
            paymentType, // 'full' | 'reservation'
            currency = 'usd',
            bookingDate, // 'YYYY-MM-DD'
            notes,
            isPresencial, // boolean
            source = 'manual-admin'
        } = body;

        if (!adminDb) {
            return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
        }

        // Basic Validation
        if (!clientName || !clientEmail || !serviceId || !amountPaid) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const orderId = `manual_${Date.now()}`;
        const comprador = { name: clientName, email: clientEmail, phone: clientPhone };

        const items = [{
            name: serviceName,
            quantity: 1,
            amount_total: amountPaid,
            currency
        }];

        // Construct cartSummary for email and references
        const cartSummary = [{
            id: serviceId,
            title: serviceName,
            price: totalPrice / 100,
            bookingDate: bookingDate,
            dateText: bookingDate
        }];

        const bookingDates = bookingDate ? { [serviceId]: bookingDate } : {};

        // 1. Create Order
        await adminDb.collection('orders').doc(orderId).set({
            stripe_id: 'manual', // Placeholder or custom ID
            type: 'manual_entry',
            amount_total: amountPaid,
            currency,
            buyer: comprador,
            items,
            cart_summary: cartSummary,
            booking_dates: bookingDates,
            payment_type: paymentType,
            status: 'paid', // Or 'verified'
            notes: notes || '',
            createdAt: new Date(),
            source
        });

        // 2. Create Booking
        const bookingData = {
            orderId,
            userId: clientEmail,
            clientName,
            clientEmail,
            clientPhone,
            serviceId,
            serviceName,
            bookingDate: bookingDate || null, // Might be null for some services?
            status: paymentType === 'reservation' ? 'reserved' : 'paid',
            paymentType,
            amount: totalPrice, // Full price
            price: totalPrice,
            pricePaid: amountPaid,
            currency,
            source,
            createdAt: FieldValue.serverTimestamp(),
            notes: notes || ''
        };

        if (isPresencial) {
            // Logic for Presencial Courses: Increment Enrolled
            if (serviceId && serviceId !== 'manual_id') {
                try {
                    await adminDb.collection('presencial_courses').doc(serviceId).update({
                        enrolled: FieldValue.increment(1)
                    });
                } catch (err) {
                    console.error("Error updating enrollment count:", err);
                    // Continue even if update fails, to at least record the booking
                }
            }
            // Add booking
            await adminDb.collection('bookings').add(bookingData);

        } else {
            // Logic for Mentorias / Custom: Block Date if provided
            if (bookingDate) {
                await adminDb.runTransaction(async (t) => {
                    const publicDayRef = adminDb.collection('publicBookedDays').doc(bookingDate);
                    // We don't necessarily need to read it if we are just overwriting/merging
                    // But if we want to check conflicts, we could. 
                    // For Admin Manual Override, we assume we want to proceed.

                    t.set(publicDayRef, {
                        orderId,
                        bookedAt: new Date(),
                        manuallyBlocked: true
                    }, { merge: true });

                    const newBookingRef = adminDb.collection('bookings').doc();
                    t.set(newBookingRef, bookingData);
                });
            } else {
                // No date attached (just paying?)
                await adminDb.collection('bookings').add(bookingData);
            }
        }

        // 3. Send Email
        if (resend) {
            try {
                await resend.emails.send({
                    from: EMAIL_FROM,
                    to: clientEmail,
                    subject: 'Confirmación de Reserva Manual - Maje Nail Spa',
                    html: htmlComprador({
                        comprador,
                        items,
                        totalCents: amountPaid,
                        currency,
                        cartSummary,
                        bookingDates,
                        paymentType
                    }),
                });
                // Notify Owner
                if (OWNER_EMAIL) {
                    await resend.emails.send({
                        from: EMAIL_FROM,
                        to: OWNER_EMAIL,
                        subject: '📝 Nueva Reserva MANUAL Registrada',
                        html: `<p>Se ha registrado manualmente una reserva para <strong>${clientName}</strong>.</p>
                           <p>Servicio: ${serviceName}</p>
                           <p>Monto: ${money(amountPaid, currency)}</p>
                           <p>Notas: ${notes}</p>`
                    });
                }
            } catch (e) {
                console.error('Email error:', e);
                // Don't fail the request, just log
            }
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('Manual booking error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
