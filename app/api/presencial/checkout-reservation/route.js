// app/api/presencial/checkout-reservation/route.js
// Endpoint para pagar solo el 30% de reserva en clases grupales presenciales

import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
    try {
        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: "Curso no especificado" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Error de configuración de servidor" }, { status: 500 });
        }

        // 1. Verificar disponibilidad en Firestore
        const courseRef = adminDb.collection("presencial_courses").doc(courseId);
        const courseDoc = await courseRef.get();

        if (!courseDoc.exists) {
            return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
        }

        const courseData = courseDoc.data();
        let { title, price: originalPrice, capacity, enrolled } = courseData;

        // Override for Manicura Rusa High Level
        if (courseId.includes('manicura')) {
            courseData.startDate = '2026-03-14';
            courseData.dates = '14-15 Marzo';
        }

        // Lógica de Preventa: Si es antes del 17 de Enero 2026 y el precio es $800, bajar a $750 base
        const now = new Date();
        const cutoffDate = new Date('2026-01-17T00:00:00-05:00');

        let price = originalPrice;
        if (originalPrice === 80000 && now < cutoffDate) {
            price = 75000;
        }

        if (enrolled >= capacity) {
            return NextResponse.json({ error: "Lo sentimos, el cupo para este curso está lleno." }, { status: 409 });
        }

        const currency = process.env.STRIPE_CURRENCY || "usd";
        const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const success_url = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancel_url = `${origin}/presencial`;

        // Calcular el 30% de reserva
        const RESERVATION_PERCENT = 0.30;
        const reservationAmount = Math.round(price * RESERVATION_PERCENT); // price ya está en centavos
        const remainingAmount = price - reservationAmount;
        const fullPriceUSD = price / 100;
        const reservationUSD = reservationAmount / 100;
        const remainingUSD = remainingAmount / 100;

        // 2. Crear sesión de Stripe con el 30%
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: [
                "card",
                "cashapp",
                "affirm",
                "afterpay_clearpay",
                "klarna",
            ],
            payment_method_options: {
                afterpay_clearpay: { setup_future_usage: "none" },
                affirm: {},
                cashapp: {},
            },
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: `Reserva 30%: ${title} ${originalPrice !== price ? '(PREVENTA)' : ''}`,
                            description: `Pago de reserva ($${reservationUSD.toFixed(2)}). Saldo restante: $${remainingUSD.toFixed(2)} USD (pago 3 días antes de la clase).`,
                            metadata: {
                                courseId: courseId,
                                type: "presencial_class_reservation",
                                full_price: String(fullPriceUSD),
                            }
                        },
                        unit_amount: reservationAmount,
                    },
                    quantity: 1,
                },
            ],
            success_url,
            cancel_url,
            metadata: {
                type: "presencial_class",
                payment_type: "reservation",
                reservation_percent: "30",
                courseId: courseId.slice(0, 500),
                courseTitle: title.slice(0, 500),
                full_price: String(fullPriceUSD),
                reservation_amount: String(reservationUSD),
                remaining_balance: String(remainingUSD),
                bookingDate: (courseData.startDate || new Date().toISOString().split('T')[0]).slice(0, 500),
                dateText: (courseData.dates || '').slice(0, 500)
            },
            phone_number_collection: {
                enabled: true,
            },
            custom_fields: [
                {
                    key: 'customer_name',
                    label: {
                        type: 'custom',
                        custom: 'Nombre completo de la participante',
                    },
                    type: 'text',
                },
            ],
        });

        return NextResponse.json({
            url: session.url,
            reservationAmount: reservationUSD,
            remainingBalance: remainingUSD,
            fullPrice: fullPriceUSD
        });

    } catch (error) {
        console.error("Error creating presencial reservation checkout session:", error);
        return NextResponse.json({ error: "Error al iniciar el pago de reserva" }, { status: 500 });
    }
}
