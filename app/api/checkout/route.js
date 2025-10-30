// app/api/checkout/route.js
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

function toHttpsAbsolute(url) {
  if (!url || typeof url !== "string") return undefined;
  if (url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    const base = process.env.TUNNEL_BASE_URL;
    return base && base.startsWith("https://") ? `${base}${url}` : undefined;
  }
  return undefined;
}

// Handler para crear sesión de checkout
export async function POST(req) {
  try {
    const { cart, bookingDetails } = await req.json();
    
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    // Validar que bookingDetails tenga fecha y hora
    if (!bookingDetails || !bookingDetails.date || !bookingDetails.time) {
      return NextResponse.json({ 
        error: "Debe seleccionar fecha y hora para la mentoría." 
      }, { status: 400 });
    }

    const currency = process.env.STRIPE_CURRENCY || "usd";

    const line_items = cart.map((item) => {
      const unitAmount = Math.round(Number(item.price) * 100);
      const image = toHttpsAbsolute(item.imageUrl);
      return {
        price_data: {
          currency,
          product_data: {
            name: item.title,
            description: item.description?.slice(0, 200),
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

    // Preparar metadata con información de reserva
    const metadata = {
      cart_count: String(cart.length),
      item_ids: cart.map((i) => i.id).join(","),
      cart_json: JSON.stringify(cart), // Para recuperar detalles completos
      booking_date: bookingDetails.date, // YYYY-MM-DD
      booking_time: bookingDetails.time, // HH:MM
      booking_datetime: `${bookingDetails.date} ${bookingDetails.time}`, // Formato legible
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url,
      cancel_url,
      metadata,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Error creando sesión de checkout:", err);
    return NextResponse.json({ error: "No se pudo crear la sesión" }, { status: 500 });
  }
}

// Handler para verificar sesión (si lo necesitas)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID requerido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      booking_date: session.metadata?.booking_date,
      booking_time: session.metadata?.booking_time,
    });
  } catch (err) {
    console.error("Error recuperando sesión:", err);
    return NextResponse.json({ error: "Error al recuperar sesión" }, { status: 500 });
  }
}