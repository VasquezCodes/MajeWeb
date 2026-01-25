
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { adminDb } from "@/lib/firebaseAdmin"; // We need admin to check availability safely? Or use client db? Better Admin for consistency.

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

        // Lógica de Preventa: Si es antes del 17 de Enero 2026 y el precio es $800, cobrar $750
        const now = new Date();
        const cutoffDate = new Date('2026-01-17T00:00:00-05:00'); // Assuming EST or consistent timezone, or just use generic ISO
        // Let's use generic local check or UTC. Given the context, likely local.
        // Safer to use a specific string comparison or simple timestamp.
        // User said "antes del 17 de enero".

        let price = originalPrice;
        if (originalPrice === 80000 && now < cutoffDate) {
            price = 75000;
        }

        if (enrolled >= capacity) {
            return NextResponse.json({ error: "Lo sentimos, el cupo para este curso está lleno." }, { status: 409 });
        }

        const currency = process.env.STRIPE_CURRENCY || "usd";
        const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const success_url = `${origin}/academia/success?session_id={CHECKOUT_SESSION_ID}`; // Reusing success page for now or generic
        const cancel_url = `${origin}/presencial`;

        // 2. Crear sesión de Stripe
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
                            name: `Reserva: ${title} ${originalPrice !== price ? '(PREVENTA)' : ''}`,
                            description: "Formación Presencial 2026 - Maje Nail Spa",
                            metadata: {
                                courseId: courseId,
                                type: "presencial_class"
                            }
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            success_url,
            cancel_url,
            metadata: {
                type: "presencial_class",
                courseId: courseId.slice(0, 500),
                courseTitle: title.slice(0, 500),
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

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("Error creating presencial checkout session:", error);
        return NextResponse.json({ error: "Error al iniciar el pago" }, { status: 500 });
    }
}
