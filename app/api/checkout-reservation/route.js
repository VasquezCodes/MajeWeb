// app/api/checkout-reservation/route.js

import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

// Helper para convertir imágenes locales a URLs absolutas
function toHttpsAbsolute(url) {
  if (!url || typeof url !== "string") return undefined;
  if (url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 
    return `${base}${url}`;
  }
  return undefined;
}

// Handler para crear sesión de checkout con pago de reserva
export async function POST(req) {
  try {
    const { cart, bookingDates } = await req.json();
    
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    // Validación de fechas
    if (!bookingDates || typeof bookingDates !== 'object' || cart.some(item => !bookingDates[item.id])) {
      return NextResponse.json({ 
        error: "Debe seleccionar una fecha para CADA mentoría." 
      }, { status: 400 });
    }

    const currency = process.env.STRIPE_CURRENCY || "usd";
    const RESERVATION_AMOUNT = 250; // Monto de reserva fijo

    // Crear line items con el monto de reserva
    const line_items = cart.map((item) => {
      const image = toHttpsAbsolute(item.imageUrl);
      
      return {
        price_data: {
          currency,
          product_data: {
            name: `Reserva: ${item.title}`,
            description: `Pago de reserva de $${RESERVATION_AMOUNT}. El saldo restante se paga el día de la clase.`,
            images: image ? [image] : undefined,
            metadata: {
              id: String(item.id),
              format: item.format || "",
              payment_type: "reservation",
              full_price: String(item.price),
            },
          },
          unit_amount: RESERVATION_AMOUNT * 100, // $250 en centavos
        },
        quantity: item.quantity || 1,
      };
    });

    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const success_url = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/checkout/cancel`;

    // Optimizar metadata para cumplir con límite de 500 caracteres por campo
    const metadata = {
      payment_type: "reservation",
      reservation_amount: String(RESERVATION_AMOUNT),
      total_items: String(cart.length),
    };

    // Guardar IDs de cursos (compacto)
    metadata.course_ids = cart.map(item => item.id).join(',');
    
    // Guardar precios completos y saldos restantes
    metadata.full_prices = cart.map(item => item.price).join(',');
    metadata.remaining = cart.map(item => item.price - RESERVATION_AMOUNT).join(',');
    
    // Guardar fechas de reserva de forma compacta
    const datesCompact = Object.entries(bookingDates)
      .map(([id, date]) => `${id}:${date}`)
      .join('|');
    
    // Si las fechas son muy largas, dividirlas en múltiples campos
    if (datesCompact.length > 500) {
      const chunks = datesCompact.match(/.{1,450}/g) || [];
      chunks.forEach((chunk, index) => {
        metadata[`dates_${index}`] = chunk;
      });
    } else {
      metadata.booking_dates = datesCompact;
    }
    
    // Guardar títulos de forma compacta (solo si cabe)
    const titlesCompact = cart.map(item => item.title.substring(0, 30)).join('|');
    if (titlesCompact.length <= 500) {
      metadata.course_titles = titlesCompact;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url,
      cancel_url,
      metadata,
      payment_method_types: [
        'card',              // tarjetas + Apple Pay / Google Pay en Checkout
        'cashapp',           // Cash App Pay (USD, cuenta elegible US)
        'affirm',            // BNPL US/CA
        'afterpay_clearpay', // BNPL AU/NZ/CA/US/UK (moneda doméstica)
        'klarna'             // BNPL Europa/US (según elegibilidad)
      ],
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      locale: 'auto',
      payment_method_options: {
        afterpay_clearpay: { setup_future_usage: 'none' },
        affirm: {},
        cashapp: {}
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Error creando sesión de checkout de reserva:", err);
    return NextResponse.json({ 
      error: "No se pudo crear la sesión",
      details: err.message 
    }, { status: 500 });
  }
}

// Handler para verificar sesión (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID requerido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Reconstruir datos desde metadata optimizada
    const paymentType = session.metadata?.payment_type || "reservation";
    const reservationAmount = parseFloat(session.metadata?.reservation_amount || 250);
    
    // Reconstruir fechas de reserva
    let bookingDates = null;
    if (session.metadata?.booking_dates) {
      const entries = session.metadata.booking_dates.split('|');
      bookingDates = {};
      entries.forEach(entry => {
        const [id, date] = entry.split(':');
        if (id && date) bookingDates[id] = date;
      });
    } else {
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
    
    // Reconstruir resumen del carrito
    let cartSummary = null;
    if (session.metadata?.course_ids) {
      const ids = session.metadata.course_ids.split(',');
      const fullPrices = session.metadata.full_prices?.split(',') || [];
      const remaining = session.metadata.remaining?.split(',') || [];
      const titles = session.metadata.course_titles?.split('|') || [];
      
      cartSummary = ids.map((id, index) => ({
        id,
        full_price: parseFloat(fullPrices[index] || 0),
        reservation_paid: reservationAmount,
        remaining_balance: parseFloat(remaining[index] || 0),
        title: titles[index] || 'Mentoría',
        qty: 1
      }));
    }

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      payment_type: paymentType,
      booking_dates: bookingDates,
      cart_summary: cartSummary,
    });
  } catch (err) {
    console.error("Error recuperando sesión:", err);
    return NextResponse.json({ error: "Error al recuperar sesión" }, { status: 500 });
  }
}
