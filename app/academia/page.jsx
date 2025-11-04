'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import getStripe from '@/lib/getStripe';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

function formatearFechaSimple(dateStr) {
  if (!dateStr) return 'Fecha no seleccionada';
  try {
    const [y, m, d] = dateStr.split('-');
    const f = new Date(y, m - 1, d);
    return f.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Iconos
import {
  AcademicCapIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  SparklesIcon,
  XMarkIcon,
  TrashIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

// --- Helper de pago con Stripe (Pago Completo) ---
async function iniciarPago(cart, bookingDates, packageInfo = null) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart,
        bookingDates,
        packageInfo
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      alert(data.error || 'No se pudo iniciar el pago.');
      return;
    }
    window.location.assign(data.url);
  } catch (e) {
    console.error(e);
    alert('Error iniciando pago.');
  }
}

// --- Helper de pago con Stripe (Pago de Reserva) ---
async function iniciarPagoReserva(cart, bookingDates, packageInfo = null) {
  try {
    const res = await fetch('/api/checkout-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart,
        bookingDates,
        packageInfo
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      alert(data.error || 'No se pudo iniciar el pago.');
      return;
    }
    window.location.assign(data.url);
  } catch (e) {
    console.error(e);
    alert('Error iniciando pago de reserva.');
  }
}

// --- Datos de los Módulos ---
const courses = [
  {
    id: "builder-gel",
    title: "MANICURA RUSA & BUILDER GEL",
    description:
      "Capacitación intensiva de 6-8 horas. Perfecciona la limpieza profunda de cutícula y la nivelación con builder gel para un acabado impecable.",
    imageUrl: "/mentoriasVIP/rusa.png",
    tags: ["Técnica Rusa", "Builder Gel", "Nivelación Perfecta"],
    price: 850.00,
    originalPrice: 850.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
    isMarketingCourse: false,
  },
  {
    id: "dual-system",
    title: "SISTEMA DUAL & BUILDER GEL",
    description:
      "Capacitación intensiva de 6-8 horas. Domina la construcción rápida y estructural con moldes dual system y la versatilidad del builder gel.",
    imageUrl: "/mentoriasVIP/dual.png",
    tags: ["Dual System", "Builder Gel", "Estructura Rápida"],
    price: 850.00,
    originalPrice: 850.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
    isMarketingCourse: false,
  },
  {
    id: "poly-gel",
    title: "POLY GEL TÉCNICAS HÍBRIDAS",
    description:
      "Capacitación intensiva de 6-8 horas. Aprende a combinar Poly Gel con otras técnicas para crear estructuras complejas y diseños innovadores.",
    imageUrl: "/mentoriasVIP/polygel.png",
    tags: ["Poly Gel", "Técnicas Híbridas", "Esculpidas"],
    price: 850.00,
    originalPrice: 850.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
    isMarketingCourse: false,
  },
  {
    id: "pedicura-pro",
    title: "PEDICURA PRO",
    description:
      "Capacitación intensiva de 6-8 horas. Eleva tu servicio de pedicura a un nivel profesional, enfocándote en técnicas avanzadas, higiene y spa.",
    imageUrl: "/mentoriasVIP/pedicura.png",
    tags: ["Pedicura Pro", "Servicio Spa", "Técnica Avanzada"],
    price: 850.00,
    originalPrice: 850.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
    isMarketingCourse: false,
  },
  {
    id: "marketing",
    title: "MARKETING PARA MANICURISTAS",
    description:
      "Aprende a vender sin miedo y atraer clientas premium. Formato presencial u online según el paquete seleccionado.",
    imageUrl: "/mentoriasVIP/marketin.png",
    tags: ["Marketing", "Clientes Premium", "Redes Sociales"],
    price: 497.00,
    originalPrice: 497.00,
    format: "Módulo Bonus",
    duration: "1 Día",
    isMarketingCourse: true,
  },
];

// --- Stats ---
const stats = [
  { value: "100+", label: "Alumnas certificadas" },
  { value: "5", label: "Módulos VIP" },
  { value: "1:1", label: "Mentoría personalizada" },
];

// --- Beneficios de la Mentoría ---
const inclusions = [
  { 
    name: "Capacitación Intensiva", 
    desc: "Entrenamiento de 6 a 8 horas enfocado 100% en la práctica.",
    icon: AcademicCapIcon 
  },
  { 
    name: "Kit de Materiales", 
    desc: "Recibe un kit completo con los productos esenciales para empezar.",
    icon: ShoppingBagIcon 
  },
  { 
    name: "Guía Teórica", 
    desc: "Manual de estudio impreso y digital para consultar siempre.",
    icon: BookOpenIcon 
  },
  { 
    name: "Soporte Online", 
    desc: "Correcciones de práctica y dudas resueltas por 3 meses.",
    icon: LifebuoyIcon 
  },
  { 
    name: "Ebook de Marketing", 
    desc: "Acceso a la guía de estrategia de marketing para manicuristas.",
    icon: SparklesIcon 
  },
  { 
    name: "Lista de Proveedores", 
    desc: "Mis contactos y artículos recomendados para tu negocio.",
    icon: ListBulletIcon 
  },
];

// --- Testimonios ---
const testimonials = [
  {
    quote: "No hay palabras para decribir lo perfecto que es tener una capacitacion contigo !!!",
    author: "Alexabeth Garcia",
    role: "Clase privada VIP"
  },
  {
    quote: "Gracias por enseñarnos lo bonito de este mundo, por compartir todo lo que sabes, por cada truco, secreto para ser las mejores... quedamos empapadas de información y con ganas de seguir capacitandonos pero contigo eres una profe increible.",
    author: "Aimee Henandez",
    role: "Clase grupal - Manicura Rusa"
  }
];

// --- Preguntas Frecuentes ---
const faqs = [
  {
    question: "COMO SERA LA MODALIDAD DE PAGO ?",
    answer: "Ofrecemos dos opciones: 1) Pago Completo: Paga el total de la mentoría con tarjeta (aceptamos pagos en cuotas con Afterpay y Klarna). 2) Pago de Reserva: Asegura tu cupo con el 30% del total y el saldo restante se paga el día de la clase presencialmente con mariajesus."
  },
  {
    question: "EL CERTIFICADO ME SIRVE PARA TRABAJAR EN LOS ESTADOS UNIDOS ?",
    answer: "Recibirás un certificado de finalización de Maje Nails Academy que avala tu participación y las técnicas aprendidas. Este certificado acredita tu capacitación privada. Los requisitos para licencias de trabajo varían por estado y deben consultarse con las entidades regulatorias locales."
  }
];

// --- Logros de las alumnas ---
const achievements = [
  {
    title: "Perfeccionan su técnica según su nivel actual",
    desc: "Si comienzan desde cero, aprenden una base sólida y segura. Si ya tienen experiencia, pulen detalles y alcanzan un acabado realmente premium."
  },
  {
    title: "Aprenden mi método profesional y mis secretos de acabado",
    desc: "Domina una estructura más fina, duradera y estética que les permite cobrar lo que su trabajo realmente vale."
  },
  {
    title: "Aplican con confianza en clientas reales",
    desc: "Con guía personalizada, convierten lo aprendido en resultados visibles y consistentes."
  },
  {
    title: "Se posicionan como manicuristas de alto valor",
    desc: "Gracias al módulo de marketing, optimizan sus redes, muestran su diferencia y atraen clientas con alto poder de inversión."
  },
  {
    title: "Construyen una marca respetada y rentable",
    desc: "Mejoran su imagen, suben precios con respaldo y se convierten en profesionales visibles en su ciudad."
  }
];

// --- Temarios de los cursos ---
const courseTemarios = {
  "dual-system": {
    title: "MÓDULO — Sistema Dual & Builder Gel",
    subtitle: "Dominio de estructuras modernas sin limado excesivo",
    sections: [
      {
        title: "Fundamentos técnicos",
        items: [
          "Morfología y anatomía de la uña natural",
          "Preparación profunda de la lámina ungueal",
          "Protocolos de seguridad e higiene",
          "Uso profesional de brocas según área de trabajo",
          "Manicura express segura para colocar cápsulas"
        ]
      },
      {
        title: "Aplicación con Sistema Dual",
        items: [
          "Selección de cápsulas según tipo de uña y estructura deseada",
          "Control de producto para evitar burbujas",
          "Adherencia perfecta y sellado seguro",
          "Construcción de extensiones sin sobrecarga de producto"
        ]
      },
      {
        title: "Nivelación & Builder Gel",
        items: [
          "Técnica de nivelación para fortalecer uñas débiles",
          "Corrección de curvaturas",
          "Acabado de alto nivel con mínimo limado"
        ]
      },
      {
        title: "Esmaltado & Estilización Comercial",
        items: [
          "Pulido espejo y efecto premium",
          "Técnica de encapsulado",
          "Degradado moderno y armonías de color",
          "Estructuras comerciales: Cuadrada • Almendra • Coffin • Stiletto"
        ]
      },
      {
        title: "BONUS Profesional",
        items: [
          "Fotografía de uñas para venta en redes: iluminación, ángulos, nitidez"
        ]
      }
    ]
  },
  "poly-gel": {
    title: "MÓDULO — PolyGel & Técnicas Híbridas",
    subtitle: "Combinación inteligente de productos para durabilidad extrema",
    sections: [
      {
        title: "Fundamentos",
        items: [
          "Principios del PolyGel y compatibilidades químicas",
          "Preparación avanzada para máxima adherencia",
          "Brocas: tipos, funciones y control del fresado"
        ]
      },
      {
        title: "Construcción y Diseño de Estructuras",
        items: [
          "Extensión con moldes y cápsulas duales",
          "Construcción limpia con técnica \"one bead\"",
          "Técnica híbrida: builder + polygel para uñas más resistentes",
          "Efecto nude natural con acabado profesional"
        ]
      },
      {
        title: "Acabado Premium",
        items: [
          "Esmaltado en gel sin bordes visibles",
          "Encapsulados limpios y sin burbujas",
          "Técnicas de degradado comercial"
        ]
      },
      {
        title: "BONUS Profesional",
        items: [
          "Fotografía para realzar color y forma (ideal para marketing)"
        ]
      }
    ]
  },
  "builder-gel": {
    title: "MÓDULO — Manicura Rusa & Builder Gel",
    subtitle: "Cutículas impecables + estructura natural de alto valor",
    sections: [
      {
        title: "Preparación Profesional",
        items: [
          "Anatomía aplicada a la manicura rusa",
          "Eliminación de tejido no vivo con precisión",
          "Uso profesional de preparadores químicos"
        ]
      },
      {
        title: "Cutícula de Lujo",
        items: [
          "Creación de bolsillo perfecto (efecto salón top)",
          "Perfeccionamiento con corta cutícula y tijera",
          "Pulido espejo: \"efecto Photoshop\" real en la piel"
        ]
      },
      {
        title: "Nivelación & Estética Final",
        items: [
          "Capa base: elección y técnica",
          "Nivelación con Builder Gel según estructura",
          "Acabado invisible sin bordes",
          "Presentación comercial para clientas reales"
        ]
      },
      {
        title: "BONUS Profesional",
        items: [
          "Fotografía para elevar el valor percibido de tus servicios"
        ]
      }
    ]
  },
  "pedicura-pro": {
    title: "MÓDULO — Pedicura PRO",
    subtitle: "Bienestar + técnica avanzada para pies saludables y bellos",
    sections: [
      {
        title: "Bases Técnicas",
        items: [
          "Anatomía y necesidades de la uña del pie",
          "Protocolos de higiene, desinfección y esterilización",
          "Identificación temprana de afecciones comunes",
          "Técnicas segura con broca"
        ]
      },
      {
        title: "Técnicas de Corte & Limpieza Profunda",
        items: [
          "Corte anatómico y seguro",
          "Limpieza de laterales y surcos sin invasión",
          "Eliminación de callosidades con control del fresado"
        ]
      },
      {
        title: "Bienestar & Experiencia Premium",
        items: [
          "Pedicura Spa con protocolo de relajación",
          "Reflexología podal básica (concepto + aplicación)",
          "Estética final con enfoque profesional",
          "Esmaltado en gel duradero y perfecto"
        ]
      },
      {
        title: "BONUS Profesional",
        items: [
          "Tips para fotografiar resultados premium"
        ]
      }
    ]
  },
  "marketing": {
    title: "MÓDULO — Marketing para Manicuristas",
    subtitle: "Atrae clientas premium y posiciona tu negocio como experta",
    sections: [
      {
        title: "Marca Personal y Posicionamiento",
        items: [
          "Qué es una marca personal en el mundo de las uñas",
          "Cómo crear y comunicar tu marca personal",
          "Cómo posicionarte como experta premium",
          "Elegir un nombre adecuado para tu negocio y tu Instagram",
          "Identidad visual sencilla y coherente (colores, estilo y mensaje)"
        ]
      },
      {
        title: "Biografía que Convierte",
        items: [
          "Optimización completa del perfil",
          "Palabras clave para atraer a tu clienta ideal",
          "CTA que impulsa citas y crecimiento"
        ]
      },
      {
        title: "Contenido Estratégico",
        items: [
          "Qué publicar según objetivos: atraer, educar, vender",
          "Estructura sencilla para Reels y Stories que conectan",
          "Storytelling: cómo contar tu historia y tus procesos",
          "Organización del contenido y calendario semanal",
          "Plan de acción para las primeras publicaciones"
        ]
      },
      {
        title: "Edición y Diseño para Emprendedoras",
        items: [
          "Cómo editar Reels fácilmente (CapCut básico)",
          "Cómo crear plantillas en Canva básico",
          "Fotografía y video funcional con celular",
          "Cómo programar contenido para no perder constancia"
        ]
      },
      {
        title: "ChatGPT e Inteligencia Artificial para Manicuristas",
        items: [
          "Cómo pedir prompts y usar IA para tu negocio",
          "Guiones, captions, ideas de contenido y respuestas por DM",
          "IA como asistente de marketing para ahorrar tiempo"
        ]
      },
      {
        title: "Ventas y Comunicación",
        items: [
          "Cómo generar confianza por mensajes",
          "Conversión: de seguidora a clienta que agenda",
          "Lenguaje persuasivo y emocional aplicado a uñas"
        ]
      }
    ]
  }
};

// --- Horarios disponibles (definir después según reglas) ---
// --- Helper: Verificar si un día es disponible (Lunes=1, Martes=2, Sábado=6) ---
function isDayAvailable(date) {
  const day = date.getDay();
  return day === 1 || day === 2 || day === 6;
}

// --- Componente de Calendario ---
function CalendarPicker({ selectedDate, onSelectDate, bookedDates }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 14); // Empezar 14 días adelante
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 14); // Mínimo 14 días adelante
    minDate.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const isPast = date < minDate;
      const dateString = date.toISOString().split('T')[0];
      const isAlreadyBooked = bookedDates.has(dateString);
      const isWorkingDay = isDayAvailable(date);

      const isAvailable = isWorkingDay && !isPast && !isAlreadyBooked;
      
      days.push({
        date,
        day,
        isAvailable,
        isPast,
        isAlreadyBooked,
      });
    }

    return days;
  }, [currentMonth, bookedDates]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSelectedDate = (date) => {
    if (!selectedDate || !date) return false;
    return (
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-brand-gray-light/30">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-brand-pink/10 transition-colors group"
          aria-label="Mes anterior"
        >
          <ChevronLeftIcon className="h-5 w-5 text-brand-text group-hover:text-brand-pink transition-colors" />
        </button>
        
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-brand-text">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-brand-pink/10 transition-colors group"
          aria-label="Mes siguiente"
        >
          <ChevronRightIcon className="h-5 w-5 text-brand-text group-hover:text-brand-pink transition-colors" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs lg:text-sm font-black text-brand-text uppercase py-2 sm:py-2.5 bg-brand-gray-light/20 rounded-md sm:rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInMonth.map((dayInfo, index) => {
          if (!dayInfo) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const { date, day, isAvailable, isPast, isAlreadyBooked } = dayInfo;
          const isSelected = isSelectedDate(date);

          return (
            <button
              key={day}
              onClick={() => isAvailable && onSelectDate(date)}
              disabled={!isAvailable}
              className={`
                aspect-square rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-bold transition-all duration-200 flex items-center justify-center
                ${isSelected 
                  ? 'bg-emerald-500 text-white shadow-xl scale-110 ring-4 ring-emerald-200' 
                  : isAvailable
                  ? 'bg-brand-gray-light/40 text-brand-text hover:bg-emerald-50 hover:ring-2 hover:ring-emerald-200 active:scale-95 sm:hover:scale-105 sm:hover:shadow-md'
                  : isAlreadyBooked
                  ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
                  : 'bg-transparent text-brand-text-light/30 cursor-not-allowed'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Leyenda mejorada */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t-2 border-brand-gray-light/30">
        <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs lg:text-sm justify-center sm:justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-md sm:rounded-lg bg-emerald-500 shadow-sm" />
            <span className="text-brand-text font-bold">Seleccionado</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-md sm:rounded-lg bg-brand-gray-light/40" />
            <span className="text-brand-text font-bold">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-md sm:rounded-lg bg-transparent border-2 border-brand-text-light/30" />
            <span className="text-brand-text font-bold">No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function AcademiaPage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({});
  const [bookedDates, setBookedDates] = useState(new Set());
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showTemarioModal, setShowTemarioModal] = useState(false);
  const [selectedTemario, setSelectedTemario] = useState(null);

  const { eligibleForOffer, offerApplied, finalCart, totalPrice, packageType, discount, marketingFormat, marketingIncluded } = useMemo(() => {
    const nonMarketingCourses = cart.filter(c => !c.isMarketingCourse);
    const hasMarketingCourse = cart.some(c => c.isMarketingCourse);
    const mentoriaCount = nonMarketingCourses.length;

    // Verificar si la promoción de marketing gratis aún está vigente
    const today = new Date();
    const promoEndDate = new Date('2025-12-15T23:59:59');
    const isMarketingPromoActive = today <= promoEndDate;

    // Determinar el tipo de paquete y descuento
    let packageName = null;
    let discountPercent = 0;
    let marketingDelivery = null;

    if (mentoriaCount === 2) {
      packageName = 'GOLD';
      discountPercent = 15;
      marketingDelivery = 'presencial';
    } else if (mentoriaCount === 3) {
      packageName = 'PLATINUM';
      discountPercent = 20;
      marketingDelivery = 'online';
    } else if (mentoriaCount >= 4) {
      packageName = 'DIAMOND';
      discountPercent = 25;
      marketingDelivery = 'online';
    }

    const isEligible = mentoriaCount >= 2 && !hasMarketingCourse && isMarketingPromoActive;
    const isApplied = mentoriaCount >= 2 && hasMarketingCourse && isMarketingPromoActive;

    let tempFinalCart = [...cart];
    const marketingBasePrice = courses.find(c => c.id === 'marketing')?.price ?? 497;

    // Calcular precio base de las mentorías (sin descuento)
    const mentoriasBasePrice = nonMarketingCourses.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Aplicar descuento si hay paquete
    const mentoriasWithDiscount = packageName
      ? mentoriasBasePrice * (1 - discountPercent / 100)
      : mentoriasBasePrice;

    // Actualizar precios de las mentorías con descuento aplicado
    tempFinalCart = tempFinalCart.map(item => {
      if (!item.isMarketingCourse && packageName) {
        const discountedPrice = item.price * (1 - discountPercent / 100);
        return { ...item, price: discountedPrice, originalPrice: item.price };
      }

      if (item.isMarketingCourse) {
        if (isApplied) {
          return { ...item, price: 0, originalPrice: 497.00 };
        }
        return { ...item, price: marketingBasePrice };
      }

      return item;
    });

    const finalPrice = tempFinalCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      eligibleForOffer: isEligible,
      offerApplied: isApplied,
      finalCart: tempFinalCart,
      totalPrice: finalPrice,
      packageType: packageName,
      discount: discountPercent,
      marketingFormat: marketingDelivery,
      marketingIncluded: isMarketingPromoActive,
    };
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const allDatesSelected = useMemo(
    () => finalCart.every(item => !!bookingDates[item.id]),
    [finalCart, bookingDates]
  );
  const bookingPayload = useMemo(
    () =>
      finalCart.reduce((acc, item) => {
        if (bookingDates[item.id]) {
          acc[item.id] = bookingDates[item.id];
        }
        return acc;
      }, {}),
    [finalCart, bookingDates]
  );

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const publicBookingsCol = collection(db, 'publicBookedDays');
        const snapshot = await getDocs(publicBookingsCol);
        const dates = new Set(snapshot.docs.map(doc => doc.id));
        setBookedDates(dates);
        console.log('Fechas ocupadas cargadas:', dates);
      } catch (error) {
        console.error("Error cargando fechas ocupadas:", error);
      }
    };

    fetchBookedDates();
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart;
      }
      const newCart = [...prevCart, { ...product, quantity: 1 }];

      const nonMarketing = newCart.filter(c => !c.isMarketingCourse).length;
      const hasMarketing = newCart.some(c => c.isMarketingCourse);

      if (nonMarketing >= 2 && !hasMarketing) {
        const marketingCourse = courses.find(c => c.id === 'marketing');
        if (marketingCourse && !newCart.some(c => c.id === 'marketing')) {
          return [...newCart, { ...marketingCourse, price: 0, quantity: 1 }];
        }
      }

      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      if (newCart.length === 0) {
        setShowCart(false);
      }
      return newCart;
    });

    setBookingDates(prev => {
      if (!prev[productId]) return prev;
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleCheckout = () => {
    if (finalCart.length === 0) return;
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!allDatesSelected) {
      alert('Por favor selecciona una fecha para CADA mentoría.');
      return;
    }

    const dates = Object.values(bookingPayload);
    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      alert('Por favor selecciona una fecha DIFERENTE para cada mentoría.');
      return;
    }

    // Mostrar opciones de pago en lugar de ir directo al pago
    setShowPaymentOptions(true);
  };

  const handlePaymentChoice = (paymentType) => {
    const packageInfo = packageType ? {
      type: packageType,
      discount: discount,
      marketingFormat: marketingFormat
    } : null;

    if (paymentType === 'full') {
      iniciarPago(finalCart, bookingPayload, packageInfo);
    } else if (paymentType === 'reservation') {
      iniciarPagoReserva(finalCart, bookingPayload, packageInfo);
    }
  };

  return (
    <div className="space-y-20 md:space-y-32 mb-24 md:mb-32 font-sans">

  {/* === Sección 1: Hero === */}
      <section className="relative overflow-hidden min-h-screen lg:min-h-0 pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Fondos decorativos */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-pink/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-gray/5 blur-[100px]" />

        {/* Imagen de fondo mobile */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/academiaImg/academiaHero.JPEG"
            alt="Mentoría personalizada de uñas de lujo"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-black/20 to-brand-black/75" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <div className="text-left space-y-8 lg:space-y-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                <span className="text-white lg:text-brand-text drop-shadow-2xl lg:drop-shadow-none">
                  Convierte tu pasión en un{' '}
                </span>
                <span className="block mt-2 drop-shadow-2xl lg:drop-shadow-none bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500 bg-clip-text text-transparent">
                  negocio rentable
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white lg:text-brand-text-light leading-relaxed max-w-xl font-light drop-shadow-lg lg:drop-shadow-none">
                Consigue clientes de alto valor en 90 días. Muchas profesionales se frustran ❌ con malos cortes, esmalte corrido o clientas que no regresan. ¡Es momento de tomar acción!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left space-y-2 lg:space-y-3">
                    <div className="text-3xl lg:text-4xl font-black text-white lg:text-brand-text drop-shadow-xl lg:drop-shadow-none">{stat.value}</div>
                    <div className="text-[10px] lg:text-xs font-semibold lg:font-bold text-white/90 lg:text-brand-text-light uppercase tracking-wider lg:tracking-[0.2em] leading-tight drop-shadow-lg lg:drop-shadow-none">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagen Desktop */}
            <div className="relative mx-auto max-w-lg hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/40 via-transparent to-brand-gray/20 blur-3xl rounded-[3rem]" />
              <div className="relative overflow-hidden rounded-[3rem] shadow-2xl">
                <Image
                  src="/academiaImg/academiaHero.JPEG"
                  alt="Mentoría personalizada de uñas de lujo"
                  width={900}
                  height={1100}
                  className="h-[700px] w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botón CTA - FUERA del contenedor, directo a la sección */}
        <div className="absolute bottom-8 left-0 right-0 z-20 px-6 lg:relative lg:bottom-auto lg:w-full lg:max-w-7xl lg:mx-auto lg:px-6 lg:mt-16">
          <div className="w-full flex justify-center lg:justify-start">
            <button
              onClick={() => {
                const mentoriasSection = document.getElementById('mentorias');
                if (mentoriasSection) {
                  mentoriasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group relative inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600 text-white font-black text-base md:text-lg rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <SparklesIcon className="h-6 w-6 relative z-10 animate-pulse" />
              <span className="relative z-10">¡Asegura tu lugar ahora!</span>
              <span className="relative z-10 text-xs md:text-sm font-semibold bg-white/20 px-3 py-1 rounded-full animate-pulse">
                Últimos espacios disponibles
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* === Sección 2: Qué Incluye === */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            Tu Mentoría VIP Incluye
          </h2>
          <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
            Todo lo que necesitas para pasar al siguiente nivel y asegurar tu éxito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inclusions.map((item) => (
            <div 
              key={item.name} 
              className="flex gap-5 bg-white p-6 rounded-3xl shadow-lg border border-brand-gray-light/20"
            >
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-pink/10">
                  <item.icon className="h-7 w-7 text-brand-pink" />
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-brand-text">{item.name}</h3>
                <p className="text-base text-brand-text-light font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Sección 2.3: Galería Visual === */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Imagen 1 - Certificado */}
          <div className="relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              <img
                src="/queAprenderan/IMG_5957.jpg"
                alt="Certificado de Maje Nails Academy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: 'center center' }}
              />
              {/* Overlay con gradiente - siempre visible en mobile, hover en desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 md:from-black/60 md:via-black/20 md:to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

              {/* Texto overlay - siempre visible en mobile, hover en desktop */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">
                  Certificación Profesional
                </h3>
                <p className="text-sm md:text-base text-white font-light drop-shadow-md">
                  Reconocimiento oficial al completar tu mentoría
                </p>
              </div>
            </div>
          </div>

          {/* Imagen 2 - Salón */}
          <div className="relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              <img
                src="/queAprenderan/IMG_7539.jpg"
                alt="Instalaciones de Maje Nails Academy"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay con gradiente - siempre visible en mobile, hover en desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 md:from-black/60 md:via-black/20 md:to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

              {/* Texto overlay - siempre visible en mobile, hover en desktop */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">
                  Ambiente Profesional
                </h3>
                <p className="text-sm md:text-base text-white font-light drop-shadow-md">
                  Instalaciones equipadas para tu aprendizaje
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === Sección 2.5: Qué logran las alumnas === */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Columna de Contenido - Izquierda */}
            <div className="space-y-8 md:space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                  ¿Qué logran mis alumnas?
                </h2>
                <p className="text-2xl md:text-3xl">👇🏻</p>
              </div>

              <div className="space-y-6 md:space-y-7">
                {achievements.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex gap-4 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                        <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-white mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna de Imagen - Derecha */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src="/queAprenderan/queAprenderan.jpg"
                  alt="Alumna de Maje Nails Academy trabajando"
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>

              {/* Elementos decorativos */}
              <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl -z-10" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-brand-pink/20 blur-3xl -z-10" />
            </div>

          </div>
        </div>
      </section>
      {/* === Sección de Paquetes === */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            Paquetes Exclusivos
          </h2>
          <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
            Obtén descuentos increíbles al reservar múltiples mentorías. {marketingIncluded && '¡Curso de Marketing GRATIS incluido!'}
          </p>
          {marketingIncluded && (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 shadow-lg">
              <span className="text-sm font-black text-white">
                ⏰ Oferta de Marketing GRATIS válida hasta el 15 de Diciembre
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Paquete GOLD */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 md:hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl" />
            <div className="relative p-5 md:p-8 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 md:px-4 py-1.5 md:py-2 shadow-lg">
                  <SparklesIcon className="h-4 md:h-5 w-4 md:w-5 text-white" />
                  <span className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                    Paquete Gold
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-brand-text">15% OFF</h3>
              </div>

              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3">
                  <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-brand-text font-medium leading-snug">
                    Elige <strong>2 mentorías</strong> y ahorra 15%
                  </p>
                </div>
                {marketingIncluded && (
                  <div className="flex items-start gap-2 md:gap-3">
                    <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-brand-text font-medium leading-snug">
                      Curso de Marketing <strong>GRATIS Presencial</strong> en un 3er día
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Paquete PLATINUM */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400 shadow-xl hover:shadow-2xl transition-all duration-300 md:hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-300/30 to-gray-400/30 rounded-full blur-3xl" />
            <div className="relative p-5 md:p-8 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 px-3 md:px-4 py-1.5 md:py-2 shadow-lg">
                  <SparklesIcon className="h-4 md:h-5 w-4 md:w-5 text-white" />
                  <span className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                    Paquete Platinum
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-brand-text">20% OFF</h3>
              </div>

              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3">
                  <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-brand-text font-medium leading-snug">
                    Elige <strong>3 mentorías</strong> y ahorra 20%
                  </p>
                </div>
                {marketingIncluded && (
                  <div className="flex items-start gap-2 md:gap-3">
                    <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-brand-text font-medium leading-snug">
                      Curso de Marketing <strong>GRATIS Online</strong> vía Zoom
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Paquete DIAMOND */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 md:hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-full blur-3xl" />
            <div className="relative p-5 md:p-8 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 px-3 md:px-4 py-1.5 md:py-2 shadow-lg ring-2 ring-gray-500/50">
                  <SparklesIcon className="h-4 md:h-5 w-4 md:w-5 text-yellow-400" />
                  <span className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                    Paquete Diamond
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">25% OFF</h3>
              </div>

              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3">
                  <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-white font-medium leading-snug">
                    Elige <strong>4+ mentorías</strong> y ahorra 25%
                  </p>
                </div>
                {marketingIncluded && (
                  <div className="flex items-start gap-2 md:gap-3">
                    <CheckCircleIcon className="h-5 md:h-6 w-5 md:w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-white font-medium leading-snug">
                      Curso de Marketing <strong>GRATIS Online</strong> vía Zoom
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          {marketingIncluded ? (
            <p className="text-base text-brand-text-light italic">
              💡 <strong>Nota:</strong> El curso de Marketing se añade automáticamente a tu carrito cuando seleccionas 2 o más mentorías. ¡No tienes que hacer nada adicional! <span className="text-red-600 font-bold">Oferta válida hasta el 15 de Diciembre.</span>
            </p>
          ) : (
            <p className="text-base text-brand-text-light italic">
              💡 <strong>Nota:</strong> Los descuentos se aplican automáticamente al seleccionar 2 o más mentorías.
            </p>
          )}
        </div>
      </section>

      {/* === Sección 3: Lista de Mentorías === */}
      <section id="mentorias" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 px-5 py-2.5">
            <AcademicCapIcon className="h-4 w-4 text-brand-pink" />
            <span className="text-xs font-bold text-brand-pink uppercase tracking-[0.2em]">
              Formación Profesional
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            Módulos Disponibles a Elegir
          </h2>

          <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
            Elige la capacitación intensiva (8 horas) que transformará tu carrera. Todos los módulos incluyen el kit completo y soporte post-curso.
          </p>
        </div>

        {/* Cards de Cursos */}
        <div className="space-y-8">
          {courses.map((course, index) => {
            const isInCart = cart.some(item => item.id === course.id);

            return (
              <div 
                key={course.id} 
                className="group animate-fadeInUp" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Mobile Layout */}
                <div className="md:hidden bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
          
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-3">
                      <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-[11px] font-black text-brand-text uppercase tracking-wider shadow-xl">
                        {course.format}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-brand-text leading-tight">
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {isInCart ? (
                          <button
                            onClick={() => removeFromCart(course.id)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-50 border-2 border-red-200 px-5 py-4 text-sm font-black text-red-600 transition-all duration-300 active:scale-95"
                          >
                            <TrashIcon className="h-5 w-5" />
                            Quitar
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(course)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-black px-5 py-4 text-sm font-black text-white shadow-lg transition-all duration-300 active:scale-95"
                          >
                            <ShoppingBagIcon className="h-5 w-5" />
                            Añadir
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowModal(true);
                          }}
                          className="flex-1 flex items-center justify-center rounded-2xl border-2 border-brand-text/20 px-5 py-4 text-sm font-black text-brand-text transition-all duration-300 active:scale-95"
                        >
                          Ver detalle
                        </button>
                      </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex">
                    <div className="relative w-1/2 overflow-hidden">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60" />
          
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-5 py-2.5 text-xs font-black uppercase tracking-wider text-brand-text shadow-xl">
                          {course.format}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col p-10 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl lg:text-4xl font-black text-brand-text leading-tight">
                          {course.title}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex gap-4">
                          {isInCart ? (
                            <button
                              onClick={() => removeFromCart(course.id)}
                              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-50 border-2 border-red-200 px-6 py-4 text-base font-black text-red-600 transition-all duration-300 hover:bg-red-100"
                            >
                              <TrashIcon className="h-5 w-5" />
                              Quitar del carrito
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(course)}
                              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-black px-6 py-4 text-base font-black text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <ShoppingBagIcon className="h-5 w-5" />
                              Añadir al carrito
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowModal(true);
                            }}
                            className="flex-1 flex items-center justify-center rounded-2xl border-2 border-brand-text/20 px-6 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Sección 4: Testimonios === */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-brand-pink/5 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 px-5 py-2.5">
              <StarIcon className="h-4 w-4 text-brand-pink" />
              <span className="text-xs font-bold text-brand-pink uppercase tracking-[0.2em]">
                Testimonios
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
              Historias de Éxito Reales
            </h2>
            <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
              Más de 100 alumnas han transformado su negocio y duplicado sus ingresos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="group relative h-full bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-brand-pink/20"
              >
                {/* Estrellas de rating */}
                <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="space-y-6">
                    <p className="text-lg md:text-xl text-brand-text leading-relaxed font-light">
                      {t.quote}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />

                    {/* Author info */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-black text-lg text-brand-text">
                          {t.author}
                        </div>
                        <div className="text-sm font-semibold text-brand-pink">
                          {t.role}
                        </div>
                      </div>

                      {/* Badge verificado */}
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
                          <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-600">Verificado</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Sección 5: FAQs === */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 px-5 py-2.5">
            <SparklesIcon className="h-4 w-4 text-brand-pink" />
            <span className="text-xs font-bold text-brand-pink uppercase tracking-[0.2em]">
              Preguntas Frecuentes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            ¿Tienes Dudas?
          </h2>
          <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
            Resolvemos las preguntas más comunes sobre la mentoría.
          </p>
        </div>
        <div className="space-y-4 md:space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="group bg-white border-2 border-brand-gray-light/20 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl hover:border-brand-pink/30 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-pink/10 flex items-center justify-center group-hover:bg-brand-pink/20 transition-colors duration-300">
                  <span className="text-lg md:text-xl font-black text-brand-pink">Q</span>
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg md:text-xl font-black text-brand-text leading-tight">
                    {faq.question}
                  </h3>
                  <p className="text-base md:text-lg text-brand-text-light font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === CTA Final === */}
      <section className="relative mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink/5 via-white to-brand-gray-light/30 p-[2px]">
          <div className="relative rounded-[calc(1.5rem-2px)] bg-white px-8 py-12 sm:px-12 sm:py-16 text-center">
            <div className="absolute -right-32 -top-20 h-64 w-64 rounded-full bg-brand-pink/10 blur-3xl" />
            <div className="absolute -left-32 -bottom-20 h-64 w-64 rounded-full bg-brand-gray/5 blur-3xl" />
            
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-brand-pink/20 bg-brand-pink/5 px-5 py-2.5">
                <SparklesIcon className="h-4 w-4 text-brand-pink animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-pink">
                  RESERVA AHORA
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-text leading-tight max-w-2xl mx-auto">
                De manicurista a líder reconocida
              </h2>
              
              <p className="text-lg sm:text-xl text-brand-text-light font-light max-w-2xl mx-auto leading-relaxed">
                Este programa está creado para que pases de ser una manicurista que lucha con clientes regateando precios a convertirte en una líder reconocida en la industria.
              </p>

              {finalCart.length > 0 && (
                <div className="inline-flex flex-col gap-3 items-center">
                  {packageType && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 shadow-lg">
                      <SparklesIcon className="h-5 w-5 text-white" />
                      <span className="text-sm font-black text-white uppercase tracking-wider">
                        Paquete {packageType} - {discount}% OFF
                      </span>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-6 rounded-2xl bg-brand-pink/10 border-2 border-brand-pink/20 px-8 py-4">
                    <div className="text-left">
                      <div className="text-xs font-bold text-brand-text-light uppercase tracking-wide">
                        En tu carrito
                      </div>
                      <div className="text-base font-black text-brand-text">
                        {totalItems} {totalItems === 1 ? 'mentoría' : 'mentorías'}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-brand-text/10" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-brand-text-light uppercase tracking-wide">
                        Total
                      </div>
                      <div className="text-2xl font-black text-brand-pink">
                        ${totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {offerApplied && (
                    <p className="text-sm font-semibold text-emerald-600 text-center max-w-md">
                      🎉 Curso de Marketing GRATIS incluido ({marketingFormat === 'presencial' ? 'Presencial en 3er día' : 'Online vía Zoom'})
                    </p>
                  )}
                  {eligibleForOffer && !offerApplied && (
                    <p className="text-xs font-semibold text-brand-pink text-center max-w-md">
                      ✨ Añade el curso de Marketing para activar tu paquete {packageType} completo
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="#mentorias"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white px-8 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                >
                  <AcademicCapIcon className="h-6 w-6" />
                  Ver Mentorías
                </Link>

                <button
                  onClick={handleCheckout}
                  disabled={finalCart.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all duration-300 ${
                    finalCart.length > 0
                      ? 'bg-brand-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-brand-gray-light/50 text-brand-text/40 cursor-not-allowed'
                  }`}
                >
                  <CalendarDaysIcon className="h-6 w-6" />
                  Seleccionar Fecha
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Modal de Reserva (Calendarios por curso) === */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-6xl">
              <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setShowPaymentOptions(false);
                  }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full bg-white sm:bg-brand-gray-light/80 hover:bg-brand-gray-light transition-colors shadow-lg"
                >
                  <XMarkIcon className="h-6 w-6 text-brand-text" />
                </button>

                <div className="p-4 pt-16 sm:p-8 sm:pt-12 lg:p-10">
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 px-4 sm:px-5 py-2 sm:py-2.5 mb-3 sm:mb-4">
                      <CalendarDaysIcon className="h-4 w-4 text-brand-pink" />
                      <span className="text-[10px] sm:text-xs font-bold text-brand-pink uppercase tracking-[0.2em]">
                        Paso Final
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-text mb-2 sm:mb-3 px-4">
                      Selecciona tus fechas
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-brand-text-light font-light max-w-2xl mx-auto px-4">
                      Selecciona una fecha disponible (Lun, Mar o Sáb) para cada mentoría en tu carrito.
                    </p>
                  </div>

                  <div className="space-y-8 mb-6 sm:mb-8">
                    {finalCart.map((item, index) => {
                      const selectedDateForThisCourse = bookingDates[item.id]
                        ? new Date(`${bookingDates[item.id]}T12:00:00`)
                        : null;
                      const selectedDatesByOthers = Object.entries(bookingDates)
                        .filter(([id, date]) => id !== item.id && date)
                        .map(([, date]) => date);
                      const blockedDates = new Set([
                        ...bookedDates,
                        ...selectedDatesByOthers,
                      ]);

                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl border-2 border-brand-gray-light/40"
                        >
                          <div className="lg:self-center space-y-2">
                            <span className="text-xs font-bold text-brand-pink uppercase tracking-wide">
                              Curso {index + 1} de {finalCart.length}
                            </span>
                            <h3 className="text-2xl font-black text-brand-text">{item.title}</h3>
                            {item.price === 0 && item.isMarketingCourse && (
                              <span className="inline-block bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm">
                                ¡Curso gratis 2+1!
                              </span>
                            )}
                            <p className="text-sm text-brand-text-light">
                              Selecciona la fecha disponible para esta mentoría.
                            </p>
                          </div>

                          <div>
                            <CalendarPicker
                              selectedDate={selectedDateForThisCourse}
                              onSelectDate={(date) => {
                                const dateString = date.toISOString().split('T')[0];
                                setBookingDates(prev => ({ ...prev, [item.id]: dateString }));
                              }}
                              bookedDates={blockedDates}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {allDatesSelected && (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 border-2 border-brand-pink/20 shadow-lg">
                      <h3 className="text-base sm:text-lg font-black text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-pink" />
                        Resumen de tu reserva
                      </h3>
                      <div className="space-y-3">
                        {finalCart.map(item => (
                          <div key={item.id} className="flex justify-between items-center pb-2 border-b border-brand-gray-light/20">
                            <span className="text-sm font-bold text-brand-text-light">{item.title}</span>
                            <span className="text-sm sm:text-base font-black text-brand-text capitalize">
                              {formatearFechaSimple(bookingPayload[item.id])}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-bold text-brand-text-light uppercase">Total a pagar</span>
                          <span className="text-xl sm:text-2xl font-black text-brand-pink">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!showPaymentOptions ? (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-0 border-t sm:border-t-0 border-brand-gray-light/20">
                      <button
                        onClick={() => {
                          setShowBookingModal(false);
                          setShowPaymentOptions(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white px-6 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30 order-2 sm:order-1"
                      >
                        Volver
                      </button>

                      <button
                        onClick={handleConfirmBooking}
                        disabled={!allDatesSelected}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition-all duration-300 order-1 sm:order-2 ${
                          allDatesSelected
                            ? 'bg-brand-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                            : 'bg-brand-gray-light/50 text-brand-text/40 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBagIcon className="h-6 w-6" />
                        Continuar al Pago
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 sm:p-0 border-t sm:border-t-0 border-brand-gray-light/20">
                      <div className="text-center mb-4">
                        <h3 className="text-xl sm:text-2xl font-black text-brand-text mb-2">
                          Elige tu opción de pago
                        </h3>
                        <p className="text-sm text-brand-text-light">
                          Selecciona cómo deseas realizar el pago de tu mentoría
                        </p>
                      </div>

                      {/* Opción 1: Pago Completo */}
                      <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-6 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-brand-text mb-2">
                              💳 Pago Completo
                            </h4>
                            <p className="text-sm text-brand-text-light mb-3">
                              Paga el monto total ahora. <strong>Aceptamos pagos en cuotas con Afterpay y Klarna.</strong>
                            </p>
                            <div className="text-2xl font-black text-emerald-600">
                              ${totalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePaymentChoice('full')}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-black text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 active:scale-95"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          Pagar Completo
                        </button>
                      </div>

                      {/* Opción 2: Pago de Reserva */}
                      <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-brand-text mb-2">
                              🎯 Reserva tu Cupo
                            </h4>
                            <p className="text-sm text-brand-text-light mb-3">
                              Asegura tu lugar con el <strong>30% del total</strong>. El saldo restante <strong>(${(totalPrice * 0.7).toFixed(2)})</strong> se paga el día de la clase presencialmente.
                            </p>
                            <div className="text-2xl font-black text-blue-600">
                              ${(totalPrice * 0.3).toFixed(2)}
                            </div>
                            <p className="text-xs text-brand-text-light mt-2 italic">
                              * El cobro presencial lo gestiona mariajesus el día de la mentoría
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePaymentChoice('reservation')}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 active:scale-95"
                        >
                          <CalendarDaysIcon className="h-5 w-5" />
                          Reservar con 30%
                        </button>
                      </div>

                      {/* Botón para volver */}
                      <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-brand-text/20 bg-white px-6 py-3 text-sm font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                      >
                        ← Volver a fechas
                      </button>
                    </div>
                  )}

                  <div className="h-4 sm:hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Modal de Detalles del Curso === */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-brand-text" />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                  <Image
                    src={selectedCourse.imageUrl}
                    alt={selectedCourse.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 lg:top-6 lg:left-6 lg:bottom-auto">
                    <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-black text-brand-text uppercase tracking-wider shadow-xl">
                      {selectedCourse.format}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 space-y-4 md:space-y-5">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-text leading-tight mb-3">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-base md:text-lg text-brand-text-light leading-relaxed font-light">
                      {selectedCourse.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-brand-gray-light/60 px-3 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider text-brand-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-brand-gray-light/20">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl md:text-4xl font-black text-[#32CD32]">
                        ${selectedCourse.price}
                      </span>
                      <span className="text-lg md:text-xl font-medium text-brand-text-light/70 line-through">
                        $1,197
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs md:text-sm font-bold text-brand-text uppercase tracking-wide">Duración</p>
                      <p className="text-sm md:text-base text-brand-text-light">{selectedCourse.duration}</p>
                    </div>

                    {courseTemarios[selectedCourse.id] && (
                      <button
                        onClick={() => {
                          setSelectedTemario(courseTemarios[selectedCourse.id]);
                          setShowTemarioModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-500 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-black text-blue-600 transition-all duration-300 hover:bg-blue-50 mb-3"
                      >
                        <DocumentTextIcon className="h-4 md:h-5 w-4 md:w-5" />
                        Ver Temario Completo
                      </button>
                    )}

                    <div className="flex gap-3 md:gap-4 pb-8 md:pb-12">
                      {cart.some((item) => item.id === selectedCourse.id) ? (
                        <button
                          onClick={() => removeFromCart(selectedCourse.id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-50 border-2 border-red-200 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-black text-red-600 transition-all duration-300 hover:bg-red-100"
                        >
                          <TrashIcon className="h-4 md:h-5 w-4 md:w-5" />
                          Quitar
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(selectedCourse)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-black px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-black text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <ShoppingBagIcon className="h-4 md:h-5 w-4 md:w-5" />
                          Añadir al carrito
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Floating Cart Widget === */}
      {finalCart.length > 0 && (
        <>
          <button
            onClick={() => setShowCart(!showCart)}
            className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-[9999] flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/50 ring-4 ring-white transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-blue-600/70 active:scale-95"
          >
            <ShoppingBagIcon className="h-8 w-8 md:h-10 md:w-10 text-white stroke-[2.5]" />
            <span className="absolute -top-2 -right-2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-500 border-4 border-white text-xs md:text-sm font-black text-white shadow-xl animate-pulse">
              {totalItems}
            </span>
          </button>

          {/* Cart Dropdown */}
          {showCart && (
            <div className="fixed bottom-40 right-6 md:bottom-32 md:right-8 z-[9998] w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border-2 border-brand-gray-light/20 overflow-hidden animate-fadeInUp">
              <div className="bg-gradient-to-r from-brand-pink to-pink-400 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Tu Carrito</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {finalCart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-brand-gray-light/30 rounded-xl p-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-brand-text truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-brand-text-light font-medium mt-0.5">
                        {item.format}
                      </p>
                      <p className={`text-base font-black mt-1 ${item.price === 0 ? 'text-emerald-600' : 'text-brand-pink'}`}>
                        {item.price === 0 ? 'GRATIS' : `$${item.price}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 self-start p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-brand-gray-light/20 p-4 space-y-3 bg-brand-gray-light/10">
                {packageType && (
                  <div className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 ${
                    packageType === 'GOLD'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                      : packageType === 'PLATINUM'
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                      : 'bg-gradient-to-r from-black to-gray-800'
                  }`}>
                    <SparklesIcon className="h-4 w-4 text-white" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {packageType === 'DIAMOND' ? `${packageType} VIP` : packageType} - {discount}% OFF
                    </span>
                  </div>
                )}
                {offerApplied && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <SparklesIcon className="h-4 w-4" />
                    Marketing GRATIS ({marketingFormat === 'presencial' ? 'Presencial' : 'Online'})
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-text uppercase tracking-wide">
                    Total
                  </span>
                  <span className="text-2xl font-black text-brand-pink">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    handleCheckout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-black px-6 py-4 text-base font-black text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                  Seleccionar Fecha
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Temario */}
      {showTemarioModal && selectedTemario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 md:p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl animate-scaleIn">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-2xl md:rounded-t-3xl">
              <div className="flex-1 pr-2">
                <h2 className="text-lg md:text-2xl lg:text-3xl font-black leading-tight">{selectedTemario.title}</h2>
                <p className="text-xs md:text-sm lg:text-base font-light mt-1">{selectedTemario.subtitle}</p>
              </div>
              <button
                onClick={() => {
                  setShowTemarioModal(false);
                  setSelectedTemario(null);
                }}
                className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
              >
                <XMarkIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
              </button>
            </div>

            <div className="p-4 md:p-6 lg:p-8 pb-16 md:pb-24 space-y-8 md:space-y-12">
              {selectedTemario.sections.map((section, idx) => (
                <div key={idx} className="space-y-5">
                  <div className="bg-gradient-to-r from-brand-black to-gray-800 rounded-2xl p-4 md:p-5 border-l-4 border-brand-pink shadow-lg">
                    <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-brand-pink" />
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-4 md:space-y-5 ml-2 md:ml-4 pb-4 md:pb-6">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-brand-pink flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-brand-text font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}