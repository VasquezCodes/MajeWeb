
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
    if (!adminDb) {
        return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const courses = [
        {
            id: 'manicura-rusa-feb-18',
            title: 'Manicura Rusa High Level',
            dates: 'FEBRERO 18-19',
            startDate: '2026-02-18',
            price: 80000,
            capacity: 10,
            enrolled: 0,
            image: '/carruselMaje/manicuraRusaHighLevel.jpg',
            syllabus: [
                {
                    title: "Fundamentos de la Uña",
                    items: ["Anatomía de las uñas", "Tipos de piel", "Estructura natural de la uña"]
                },
                {
                    title: "Preparación de la Uña",
                    items: ["Preparación correcta de la uña natural", "Limpieza profunda de cutícula", "Uso correcto de brocas", "Presión, velocidad y seguridad"]
                },
                {
                    title: "Aplicación de Productos",
                    items: ["Control de materiales", "Aplicación de Rubber Base", "Aplicación de Builder Gel", "Construcción de estructura perfecta"]
                },
                {
                    title: "Acabado Premium",
                    items: ["Esmaltado perfecto", "Pulido efecto 'Photoshop'", "Sellado profesional", "Brillo duradero", "Tips de fotografía del trabajo final"]
                },
                {
                    title: "Marketing, Ventas y Posicionamiento",
                    items: ["Optimización profesional de la biografía", "Definición de marca personal", "Cómo crear contenido que vende", "Estructura correcta de Reels", "Organización de contenido estratégico", "Mentalidad de crecimiento", "Estrategias de ventas", "Cómo elevar tu valor profesional y tus precios"]
                }
            ]
        },
        {
            id: 'sistema-dual-mar-28',
            title: 'Sistema Gel Dual Pro',
            dates: 'MARZO 28-29',
            startDate: '2026-03-28',
            price: 80000,
            capacity: 10,
            enrolled: 0,
            image: '/carruselMaje/sistemaDualGelPro.jpg',
            syllabus: [
                {
                    title: "Fundamentos del Sistema Dual",
                    items: ["Introducción a las cápsulas duales", "Tipos de cápsulas y su uso correcto", "Selección de cápsula según el tipo de uña", "Errores comunes y cómo evitarlos"]
                },
                {
                    title: "Estructuras Comerciales de Salón",
                    items: ["Encaje correcto de la forma", "Construcción de: Coffin, Almendra, Cuadrada", "Grosor, balance y simetría comercial"]
                },
                {
                    title: "Dominio del Builder Gel",
                    items: ["Control correcto del Builder Gel", "Nivelación perfecta con Builder", "Sellado estructural correcto"]
                },
                {
                    title: "Acabado Profesional",
                    items: ["Manicura completa con acabado perfecto", "Pulido limpio para efecto (Photoshop)"]
                },
                {
                    title: "Diseños con Sistema Dual",
                    items: ["Degradados con moldes", "Encapsulados con moldes", "Diseños modernos, rápidos y comerciales"]
                }
            ]
        },
        {
            id: 'polygel-abr-17',
            title: 'PolyGel Level Up',
            subtitle: '(Técnicas Híbridas)',
            dates: 'ABRIL 17-18',
            startDate: '2026-04-17',
            price: 80000,
            capacity: 10,
            enrolled: 0,
            image: '/carruselMaje/polygelLevelUp.jpg',
            syllabus: [
                {
                    title: "Dominio del PolyGEL",
                    items: ["Qué es el PolyGEL y por qué es un producto híbrido", "Ventajas del PolyGEL frente a otros sistemas", "Control del material sin burbujas", "Manejo correcto de la textura"]
                },
                {
                    title: "Técnica Dual con PolyGEL",
                    items: ["Encaje correcto de cápsulas duales", "Construcción de estructura con PolyGEL", "Grosor, arquitectura y resistencia"]
                },
                {
                    title: "Técnica Híbrida",
                    items: ["Refuerzo estructural", "Nivelación correcta con técnica híbrida"]
                },
                {
                    title: "Técnicas de Diseño",
                    items: ["Técnica de encapsulado", "Técnica de degradado", "French Reversa", "Diseños modernos con estructura limpia"]
                },
                {
                    title: "Acabado Profesional",
                    items: ["Pulido perfecto", "Sellado final", "Brillo duradero", "Terminación de lujo"]
                }
            ]
        }
    ];

    try {
        const batch = adminDb.batch();

        for (const course of courses) {
            const docRef = adminDb.collection('presencial_courses').doc(course.id);
            // Use set checking manually if needed, but here we want to Reset/Update schema
            // merging: true to keep enrolled if we wanted, but enrolled:0 is in the object.
            // We should NOT reset enrolled if it was > 0, but since this is first setup, it's fine.
            // I'll use { merge: true } but careful with enrolled:0.
            // Since I know enrolled is 0 now (checked previous output), I'll just overwrite.
            batch.set(docRef, course);
        }

        await batch.commit();
        return NextResponse.json({ message: 'Seeded successfully', courses });
    } catch (error) {
        console.error('Error seeding:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
