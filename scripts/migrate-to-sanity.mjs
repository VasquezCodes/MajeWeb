// scripts/migrate-to-sanity.mjs
// Script para migrar el contenido hardcodeado a Sanity
// Ejecutar con: $env:SANITY_API_TOKEN="tu_token"; node scripts/migrate-to-sanity.mjs

import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN

if (!token) {
    console.error('❌ No se encontró SANITY_API_TOKEN')
    console.error('💡 Ejecuta: $env:SANITY_API_TOKEN="tu_token"; node scripts/migrate-to-sanity.mjs')
    process.exit(1)
}

console.log('✓ Token encontrado:', token.substring(0, 10) + '...')

const client = createClient({
    projectId: 'oxiz2wg2',
    dataset: 'production',
    apiVersion: '2025-12-12',
    token: token,
    useCdn: false,
})

// Datos de los cursos (de academia/page.jsx)
const courses = [
    {
        _type: 'course',
        _id: 'course-builder-gel',
        title: 'MANICURA RUSA & BUILDER GEL',
        slug: { _type: 'slug', current: 'builder-gel' },
        description: 'Capacitación intensiva de 6-8 horas. Perfecciona la limpieza profunda de cutícula y la nivelación con builder gel para un acabado impecable.',
        price: 850.00,
        originalPrice: 850.00,
        duration: '6-8 horas',
        format: 'Mentoría VIP Presencial',
        tags: ['Técnica Rusa', 'Builder Gel', 'Nivelación Perfecta'],
        isMarketingCourse: false,
        order: 1,
        temario: [
            { _key: 'section1', title: 'Preparación Profesional', items: ['Anatomía aplicada a la manicura rusa', 'Eliminación de tejido no vivo con precisión', 'Uso profesional de preparadores químicos'] },
            { _key: 'section2', title: 'Cutícula de Lujo', items: ['Creación de bolsillo perfecto (efecto salón top)', 'Perfeccionamiento con corta cutícula y tijera', 'Pulido espejo: "efecto Photoshop" real en la piel'] },
            { _key: 'section3', title: 'Nivelación & Estética Final', items: ['Capa base: elección y técnica', 'Nivelación con Builder Gel según estructura', 'Acabado invisible sin bordes', 'Presentación comercial para clientas reales'] },
            { _key: 'section4', title: 'BONUS Profesional', items: ['Fotografía para elevar el valor percibido de tus servicios'] }
        ]
    },
    {
        _type: 'course',
        _id: 'course-dual-system',
        title: 'SISTEMA DUAL & BUILDER GEL',
        slug: { _type: 'slug', current: 'dual-system' },
        description: 'Capacitación intensiva de 6-8 horas. Domina la construcción rápida y estructural con moldes dual system y la versatilidad del builder gel.',
        price: 850.00,
        originalPrice: 850.00,
        duration: '6-8 horas',
        format: 'Mentoría VIP Presencial',
        tags: ['Dual System', 'Builder Gel', 'Estructura Rápida'],
        isMarketingCourse: false,
        order: 2,
        temario: [
            { _key: 'section1', title: 'Fundamentos técnicos', items: ['Morfología y anatomía de la uña natural', 'Preparación profunda de la lámina ungueal', 'Protocolos de seguridad e higiene', 'Uso profesional de brocas según área de trabajo', 'Manicura express segura para colocar cápsulas'] },
            { _key: 'section2', title: 'Aplicación con Sistema Dual', items: ['Selección de cápsulas según tipo de uña y estructura deseada', 'Control de producto para evitar burbujas', 'Adherencia perfecta y sellado seguro', 'Construcción de extensiones sin sobrecarga de producto'] },
            { _key: 'section3', title: 'Nivelación & Builder Gel', items: ['Técnica de nivelación para fortalecer uñas débiles', 'Corrección de curvaturas', 'Acabado de alto nivel con mínimo limado'] },
            { _key: 'section4', title: 'Esmaltado & Estilización Comercial', items: ['Pulido espejo y efecto premium', 'Técnica de encapsulado', 'Degradado moderno y armonías de color', 'Estructuras comerciales: Cuadrada • Almendra • Coffin • Stiletto'] },
            { _key: 'section5', title: 'BONUS Profesional', items: ['Fotografía de uñas para venta en redes: iluminación, ángulos, nitidez'] }
        ]
    },
    {
        _type: 'course',
        _id: 'course-poly-gel',
        title: 'POLY GEL TÉCNICAS HÍBRIDAS',
        slug: { _type: 'slug', current: 'poly-gel' },
        description: 'Capacitación intensiva de 6-8 horas. Aprende a combinar Poly Gel con otras técnicas para crear estructuras complejas y diseños innovadores.',
        price: 850.00,
        originalPrice: 850.00,
        duration: '6-8 horas',
        format: 'Mentoría VIP Presencial',
        tags: ['Poly Gel', 'Técnicas Híbridas', 'Esculpidas'],
        isMarketingCourse: false,
        order: 3,
        temario: [
            { _key: 'section1', title: 'Fundamentos', items: ['Principios del PolyGel y compatibilidades químicas', 'Preparación avanzada para máxima adherencia', 'Brocas: tipos, funciones y control del fresado'] },
            { _key: 'section2', title: 'Construcción y Diseño de Estructuras', items: ['Extensión con moldes y cápsulas duales', 'Construcción limpia con técnica "one bead"', 'Técnica híbrida: builder + polygel para uñas más resistentes', 'Efecto nude natural con acabado profesional'] },
            { _key: 'section3', title: 'Acabado Premium', items: ['Esmaltado en gel sin bordes visibles', 'Encapsulados limpios y sin burbujas', 'Técnicas de degradado comercial'] },
            { _key: 'section4', title: 'BONUS Profesional', items: ['Fotografía para realzar color y forma (ideal para marketing)'] }
        ]
    },
    {
        _type: 'course',
        _id: 'course-pedicura-pro',
        title: 'PEDICURA PRO',
        slug: { _type: 'slug', current: 'pedicura-pro' },
        description: 'Capacitación intensiva de 6-8 horas. Eleva tu servicio de pedicura a un nivel profesional, enfocándote en técnicas avanzadas, higiene y spa.',
        price: 850.00,
        originalPrice: 850.00,
        duration: '6-8 horas',
        format: 'Mentoría VIP Presencial',
        tags: ['Pedicura Pro', 'Servicio Spa', 'Técnica Avanzada'],
        isMarketingCourse: false,
        order: 4,
        temario: [
            { _key: 'section1', title: 'Bases Técnicas', items: ['Anatomía y necesidades de la uña del pie', 'Protocolos de higiene, desinfección y esterilización', 'Identificación temprana de afecciones comunes', 'Técnicas segura con broca'] },
            { _key: 'section2', title: 'Técnicas de Corte & Limpieza Profunda', items: ['Corte anatómico y seguro', 'Limpieza de laterales y surcos sin invasión', 'Eliminación de callosidades con control del fresado'] },
            { _key: 'section3', title: 'Bienestar & Experiencia Premium', items: ['Pedicura Spa con protocolo de relajación', 'Reflexología podal básica (concepto + aplicación)', 'Estética final con enfoque profesional', 'Esmaltado en gel duradero y perfecto'] },
            { _key: 'section4', title: 'BONUS Profesional', items: ['Tips para fotografiar resultados premium'] }
        ]
    },
    {
        _type: 'course',
        _id: 'course-marketing',
        title: 'MARKETING PARA MANICURISTAS',
        slug: { _type: 'slug', current: 'marketing' },
        description: 'Aprende a vender sin miedo y atraer clientas premium. Formato presencial u online según el paquete seleccionado.',
        price: 497.00,
        originalPrice: 497.00,
        duration: '1 Día',
        format: 'Módulo Bonus',
        tags: ['Marketing', 'Clientes Premium', 'Redes Sociales'],
        isMarketingCourse: true,
        order: 5,
        temario: [
            { _key: 'section1', title: 'Marca Personal y Posicionamiento', items: ['Qué es una marca personal en el mundo de las uñas', 'Cómo crear y comunicar tu marca personal', 'Cómo posicionarte como experta premium', 'Elegir un nombre adecuado para tu negocio y tu Instagram', 'Identidad visual sencilla y coherente (colores, estilo y mensaje)'] },
            { _key: 'section2', title: 'Biografía que Convierte', items: ['Optimización completa del perfil', 'Palabras clave para atraer a tu clienta ideal', 'CTA que impulsa citas y crecimiento'] },
            { _key: 'section3', title: 'Contenido Estratégico', items: ['Qué publicar según objetivos: atraer, educar, vender', 'Estructura sencilla para Reels y Stories que conectan', 'Storytelling: cómo contar tu historia y tus procesos', 'Organización del contenido y calendario semanal', 'Plan de acción para las primeras publicaciones'] },
            { _key: 'section4', title: 'Edición y Diseño para Emprendedoras', items: ['Cómo editar Reels fácilmente (CapCut básico)', 'Cómo crear plantillas en Canva básico', 'Fotografía y video funcional con celular', 'Cómo programar contenido para no perder constancia'] },
            { _key: 'section5', title: 'ChatGPT e Inteligencia Artificial para Manicuristas', items: ['Cómo pedir prompts y usar IA para tu negocio', 'Guiones, captions, ideas de contenido y respuestas por DM', 'IA como asistente de marketing para ahorrar tiempo'] },
            { _key: 'section6', title: 'Ventas y Comunicación', items: ['Cómo generar confianza por mensajes', 'Conversión: de seguidora a clienta que agenda', 'Lenguaje persuasivo y emocional aplicado a uñas'] }
        ]
    }
]

// Testimonios
const testimonials = [
    {
        _type: 'testimonial',
        _id: 'testimonial-1',
        quote: 'No hay palabras para decribir lo perfecto que es tener una capacitacion contigo !!!',
        author: 'Alexabeth Garcia',
        role: 'Clase privada VIP',
        order: 1
    },
    {
        _type: 'testimonial',
        _id: 'testimonial-2',
        quote: 'Gracias por enseñarnos lo bonito de este mundo, por compartir todo lo que sabes, por cada truco, secreto para ser las mejores... quedamos empapadas de información y con ganas de seguir capacitandonos pero contigo eres una profe increible.',
        author: 'Aimee Henandez',
        role: 'Clase grupal - Manicura Rusa',
        order: 2
    }
]

// FAQs
const faqs = [
    {
        _type: 'faq',
        _id: 'faq-1',
        question: 'COMO SERA LA MODALIDAD DE PAGO ?',
        answer: 'Ofrecemos dos opciones: 1) Pago Completo: Paga el total de la mentoría con tarjeta (aceptamos pagos en cuotas con Afterpay y Klarna). 2) Pago de Reserva: Asegura tu cupo con el 30% del total y el saldo restante se paga el día de la clase presencialmente con mariajesus.',
        order: 1
    },
    {
        _type: 'faq',
        _id: 'faq-2',
        question: 'EL CERTIFICADO ME SIRVE PARA TRABAJAR EN LOS ESTADOS UNIDOS ?',
        answer: 'Recibirás un certificado de finalización de Maje Nails Academy que avala tu participación y las técnicas aprendidas. Este certificado acredita tu capacitación privada. Los requisitos para licencias de trabajo varían por estado y deben consultarse con las entidades regulatorias locales.',
        order: 2
    }
]

// Página Principal
const homePage = {
    _type: 'homePage',
    _id: 'homePage',
    heroTitle: 'Hola, soy Mariajesus,',
    heroSubtitle: 'fundadora de Maje Nail Spa y Maje Nail Academy. Con más de 7 años de trayectoria en el mundo de las uñas y en la formación de profesionales del ramo, te doy la bienvenida a este espacio, donde podrás reservar tus servicios y formarte como profesional si así lo deseas.',
    heroButtons: [
        { _key: 'btn1', label: 'Academia', url: '/academia', variant: 'primary' },
        { _key: 'btn2', label: 'Servicios', url: '/reservas', variant: 'secondary' }
    ],
    aboutLabel: 'Mi Historia',
    aboutTitle: 'De Sueños a Realidad',
    aboutContent: [
        'Soy venezolana, y hace 8 años emigré a los Estados Unidos con tan solo 19 años, llevando en la maleta mis sueños... y una pasión que me acompañaba desde niña: el mundo de las uñas.',
        'Hoy tengo más de 10 años de experiencia en esta industria, pero no siempre fue fácil. Al inicio, mis conocimientos eran empíricos. Sabía que amaba este arte, pero entendí que el talento por sí solo no era suficiente para escalar un negocio rentable ni atraer clientas de alto valor.',
        'Con los años, descubrí que este mundo va mucho más allá de una buena técnica: es un negocio poderoso que necesita estructura, estrategia y educación.',
        'Por eso, comencé a formarme. Estudié con grandes academias e instructores, tanto presenciales como online. Me capacité en técnicas avanzadas, finanzas, redes sociales y marketing especializado para manicuristas.',
        'Hoy soy Master Instructor en uñas y marketing para manicuristas, y mi misión es compartir este camino con más mujeres soñadoras, que como yo, quieren vivir de su talento y construir una marca profesional y rentable.',
        'Porque el arte transforma... pero la educación y la visión hacen que ese arte se convierta en libertad.'
    ],
    ctaTitle: '¿Lista para tu próximo turno?',
    ctaDescription: 'Agenda tu cita en menos de un minuto a través de nuestro sistema de reservas online.',
    ctaButtonText: 'Reservar Turno Ahora',
    ctaButtonUrl: '/reservas'
}

// Productos Digitales
const digitalProducts = [
    {
        _type: 'digitalProduct',
        _id: 'product-ebook',
        title: 'E-book: Manicuras Millonarias',
        description: 'Descubre las estrategias probadas para convertir tu pasión por las uñas en un negocio rentable y sostenible. Este e-book incluye:',
        features: [
            'Técnicas de marketing para manicuristas',
            'Estrategias de pricing y ventas',
            'Cómo atraer y retener clientas VIP',
            'Derechos de reventa incluidos'
        ],
        badge: 'Con Derechos de Reventa',
        badgeColor: 'yellow',
        ctaText: 'Comprar Ahora',
        ctaLink: 'https://go.hotmart.com/A91933579Q',
        order: 1
    },
    {
        _type: 'digitalProduct',
        _id: 'product-ceo',
        title: 'Programa Online Manicurista CEO',
        description: 'Domina el negocio de las uñas y escala tu carrera al siguiente nivel. Aprende a gestionar tu tiempo, tus finanzas y a atraer clientes de alto valor.',
        features: [
            'Estrategias de negocio probadas',
            'Gestión de marca personal',
            'Marketing digital para manicuristas'
        ],
        badge: 'Workshop Online',
        badgeColor: 'pink',
        ctaText: 'Inscribirme Ahora',
        ctaLink: 'https://go.hotmart.com/G99672120D',
        order: 2
    }
]

// Configuración del sitio
const siteSettings = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Maje Nail Spa',
    contactEmail: 'info@majenailspa.com',
    contactPhone: '',
    socialLinks: [
        { _key: 'ig', platform: 'instagram', url: 'https://instagram.com/majenailspa' }
    ]
}

async function migrate() {
    console.log('🚀 Iniciando migración a Sanity...\n')

    try {
        // Migrar cursos
        console.log('📚 Migrando cursos...')
        for (const course of courses) {
            await client.createOrReplace(course)
            console.log(`  ✓ ${course.title}`)
        }

        // Migrar testimonios
        console.log('\n💬 Migrando testimonios...')
        for (const testimonial of testimonials) {
            await client.createOrReplace(testimonial)
            console.log(`  ✓ ${testimonial.author}`)
        }

        // Migrar FAQs
        console.log('\n❓ Migrando FAQs...')
        for (const faq of faqs) {
            await client.createOrReplace(faq)
            console.log(`  ✓ ${faq.question.substring(0, 30)}...`)
        }

        // Migrar página principal
        console.log('\n🏠 Migrando página principal...')
        await client.createOrReplace(homePage)
        console.log('  ✓ Página principal')

        // Migrar productos digitales
        console.log('\n🛍️ Migrando productos digitales...')
        for (const product of digitalProducts) {
            await client.createOrReplace(product)
            console.log(`  ✓ ${product.title}`)
        }

        // Migrar configuración del sitio
        console.log('\n⚙️ Migrando configuración del sitio...')
        await client.createOrReplace(siteSettings)
        console.log('  ✓ Configuración del sitio')

        console.log('\n✅ ¡Migración completada exitosamente!')
        console.log('\n📝 Ahora puedes editar el contenido en: http://localhost:3000/studio')

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message)
        console.error('\n💡 Asegúrate de tener configurada la variable SANITY_API_TOKEN con permisos de escritura.')
        console.error('   Puedes crear un token en: https://www.sanity.io/manage/project/oxiz2wg2/api#tokens')
        process.exit(1)
    }
}

migrate()
