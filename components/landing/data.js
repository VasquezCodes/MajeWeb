// components/landing/data.js
// Contenido de la landing de captación.
// ⚠️ Los textos marcados con [MOCK] son provisionales — reemplazar por datos reales.

export const STATS = [
  { value: 8, prefix: "+", suffix: "", label: "años elevando la industria" }, // [MOCK]
  { value: 500, prefix: "+", suffix: "", label: "manicuristas formadas" }, // [MOCK]
  { value: 100, prefix: "", suffix: "%", label: "técnica con estructura" },
];

// Frase que se repite en el marquee bajo el hero
export const MARQUEE_WORDS = [
  "Manicura Rusa High Level",
  "Sistema Dual",
  "PolyGel",
  "Estructura & Criterio",
  "Acabados que fidelizan",
  "Mentorías VIP",
];

export const PAINS = [
  "Trabajas todo el día, pero no logras cobrar lo que tu tiempo realmente vale.",
  "Improvisas en cada servicio porque nadie te enseñó una estructura de verdad.",
  "Tus clientas no regresan y no terminas de entender por qué.",
  "Ves a otras manicuristas subir de nivel y sientes que te quedaste atrás.",
];

export const OUTCOMES = [
  "Dominas la Manicura Rusa High Level con estructura, criterio y seguridad.",
  "Entregas acabados impecables que fidelizan clientas y se pagan solos.",
  "Subes tus precios sin miedo, porque tu trabajo respalda cada cifra.",
  "Trabajas con un método claro, no con suerte ni improvisación.",
];

export const PROGRAMS = [
  {
    id: "presencial",
    eyebrow: "Presencial · Orlando, FL",
    title: "Formación Presencial 2026",
    subtitle: "Clases grupales intensivas",
    description:
      "Entrenamientos para manicuristas que no se conforman con lo básico. Dominarás la Manicura Rusa High Level con estructura y criterio, ganando la seguridad para ofrecer acabados impecables.",
    image: "/carruselMaje/manicuraRusa.jpg",
    messageKey: "presencial",
    featured: true,
  },
  {
    id: "mentoria",
    eyebrow: "1 a 1 · Personalizado",
    title: "Programas y Mentorías VIP",
    subtitle: "Acompañamiento estratégico",
    description:
      "Formación personalizada para quienes buscan atención cercana, corrección detallada y acompañamiento en su evolución técnica y profesional. No es aprender más: es aprender mejor.",
    image: "/portadaMentoria.jpeg",
    messageKey: "mentoria",
    featured: false,
  },
  {
    id: "online",
    eyebrow: "Online · A tu ritmo",
    title: 'Programa Online "Manicurista CEO"',
    subtitle: "Desde cualquier lugar",
    description:
      "Un proceso claro y estructurado para fortalecer tu base técnica y tu mentalidad profesional desde donde estés, sin perder el enfoque ni el criterio.",
    image: "/programaCEO.jpeg",
    messageKey: "online",
    featured: false,
  },
];

export const PORTFOLIO = [
  "/diseniosjpg/IMG_0981.jpg",
  "/diseniosjpg/IMG_1006.jpg",
  "/diseniosjpg/IMG_1999.jpg",
  "/diseniosjpg/IMG_2147.jpg",
  "/diseniosjpg/IMG_3323.jpg",
  "/diseniosjpg/IMG_4309.jpg",
  "/diseniosjpg/IMG_4324.jpg",
  "/diseniosjpg/IMG_5246.jpg",
  "/diseniosjpg/IMG_5274.jpg",
  "/diseniosjpg/IMG_6536.jpg",
  "/diseniosjpg/IMG_6907.jpg",
  "/diseniosjpg/IMG_6913.jpg",
];

// Testimonios reales de alumnas. La sección solo se renderiza si hay al menos uno,
// así que basta con agregar objetos aquí para que vuelva a aparecer en la landing.
// Formato: { name: "Nombre A.", role: "Manicurista · Ciudad", text: "..." }
export const TESTIMONIALS = [];

export const FAQS = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No es indispensable. Tenemos rutas tanto para quienes empiezan como para manicuristas que quieren perfeccionar su técnica. En la conversación por WhatsApp definimos juntas cuál es tu punto de partida.",
  },
  {
    q: "¿Las formaciones son presenciales u online?",
    a: "Ambas. Tenemos clases presenciales en Orlando, mentorías VIP personalizadas y un programa online para que aprendas desde donde estés. Te ayudamos a elegir el formato ideal para ti.",
  },
  {
    q: "¿Entregan certificado?",
    a: "Sí. Al completar tu formación recibes una certificación que respalda tu nivel técnico y profesional.",
  },
  {
    q: "¿Cómo reservo mi cupo?",
    a: "Escríbenos por WhatsApp. Mariajesus te orienta personalmente, resuelve tus dudas y te guía paso a paso para asegurar tu lugar. Los cupos son limitados.",
  },
];
