// app/api/checkout/route.js

import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

// Helper para convertir imágenes locales a URLs absolutas (si es necesario)
function toHttpsAbsolute(url) {
  if (!url || typeof url !== "string") return undefined;
  if (url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    // Reemplaza esto con tu URL de producción o una URL de ngrok/tunnel para pruebas
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 
    return `${base}${url}`;
  }
  return undefined;
}

// Handler para crear sesión de checkout
export async function POST(req) {
  try {
    const { cart, bookingDates, packageInfo } = await req.json(); // <-- MODIFICADO
    
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    // --- VALIDACIÓN MODIFICADA ---
    // Revisa que bookingDates sea un objeto y que cada item del carrito tenga una fecha
    if (!bookingDates || typeof bookingDates !== 'object' || cart.some(item => !bookingDates[item.id])) {
      return NextResponse.json({ 
        error: "Debe seleccionar una fecha para CADA mentoría." 
      }, { status: 400 });
    }
    // --- FIN VALIDACIÓN ---

    const currency = process.env.STRIPE_CURRENCY || "usd";

    const line_items = cart.map((item) => {
      // El precio ya viene en 0 si es la oferta 2+1
      const unitAmount = Math.round(Number(item.price) * 100); 
      const image = toHttpsAbsolute(item.imageUrl);
      
      return {
        price_data: {
          currency,
          product_data: {
            name: item.title,
            description: item.description?.slice(0, 200) || "Mentoría VIP",
            images: image ? [image] : undefined,
            metadata: {
              id: String(item.id),
              format: item.format || "",
            },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const success_url = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/checkout/cancel`;

     // Optimizar metadata para cumplir con límite de 500 caracteres por campo
    // Stripe permite hasta 50 campos de metadata, cada uno con máximo 500 caracteres
    
    const metadata = {
      payment_type: "full",
      total_items: String(cart.length),
    };

    // Guardar IDs de cursos (compacto)
    metadata.course_ids = cart.map(item => item.id).join(',');
    
    // Guardar precios (compacto)
    metadata.prices = cart.map(item => item.price).join(',');
    
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

    // Guardar info del paquete si existe (muy compacto: "GOLD|15|presencial")
    if (packageInfo) {
      metadata.package = `${packageInfo.type}|${packageInfo.discount}|${packageInfo.marketingFormat || 'none'}`;
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
      custom_fields: [
        {
          key: 'customer_name',
          label: {
            type: 'custom',
            custom: 'Nombre completo del cliente',
          },
          type: 'text',
        },
      ],
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
    console.error("Error creando sesión de checkout:", err);
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
    const paymentType = session.metadata?.payment_type || "full";
    
    // Reconstruir fechas de reserva
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
    
    // Reconstruir resumen del carrito
    let cartSummary = null;
    if (session.metadata?.course_ids) {
      const ids = session.metadata.course_ids.split(',');
      const titles = session.metadata.course_titles?.split('|') || [];
      
      // Detectar si es reserva o pago completo
      if (paymentType === 'reservation') {
        const fullPrices = session.metadata.full_prices?.split(',') || [];
        const remaining = session.metadata.remaining?.split(',') || [];
        const reservationAmount = parseFloat(session.metadata?.reservation_amount || 250);
        
        cartSummary = ids.map((id, index) => ({
          id,
          full_price: parseFloat(fullPrices[index] || 0),
          reservation_paid: reservationAmount,
          remaining_balance: parseFloat(remaining[index] || 0),
          title: titles[index] || 'Mentoría',
          qty: 1
        }));
      } else {
        const prices = session.metadata.prices?.split(',') || [];
        
        cartSummary = ids.map((id, index) => ({
          id,
          price: parseFloat(prices[index] || 0),
          title: titles[index] || 'Mentoría',
          qty: 1
        }));
      }
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