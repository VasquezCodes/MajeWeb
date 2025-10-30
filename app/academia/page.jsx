'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import getStripe from '@/lib/getStripe';

// Iconos
import {
  AcademicCapIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  SparklesIcon,
  XMarkIcon,
  TrashIcon,
  BookOpenIcon,
  LifebuoyIcon,
  ListBulletIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

// --- Helper de pago con Stripe ---
async function iniciarPago(cart, bookingDetails) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cart,
        bookingDetails // { date: 'YYYY-MM-DD', time: 'HH:MM' }
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

// --- Datos de los Módulos ---
const courses = [
  {
    id: 1,
    title: "MANICURA RUSA & BUILDER GEL",
    description:
      "Capacitación intensiva de 6-8 horas. Perfecciona la limpieza profunda de cutícula y la nivelación con builder gel para un acabado impecable.",
    imageUrl: "/academiaImg/manicuraRusa.png",
    tags: ["Técnica Rusa", "Builder Gel", "Nivelación Perfecta"],
    price: 850.00,
    originalPrice: 950.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
  },
  {
    id: 2,
    title: "SISTEMA DUAL & BUILDER GEL",
    description:
      "Capacitación intensiva de 6-8 horas. Domina la construcción rápida y estructural con moldes dual system y la versatilidad del builder gel.",
    imageUrl: "/academiaImg/sistemaDual.png",
    tags: ["Dual System", "Builder Gel", "Estructura Rápida"],
    price: 850.00,
    originalPrice: 950.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
  },
  {
    id: 3,
    title: "POLY GEL TÉCNICAS HÍBRIDAS",
    description:
      "Capacitación intensiva de 6-8 horas. Aprende a combinar Poly Gel con otras técnicas para crear estructuras complejas y diseños innovadores.",
    imageUrl: "/academiaImg/polyGel.png",
    tags: ["Poly Gel", "Técnicas Híbridas", "Esculpidas"],
    price: 850.00,
    originalPrice: 950.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
  },
  {
    id: 4,
    title: "PEDICURA PRO",
    description:
      "Capacitación intensiva de 6-8 horas. Eleva tu servicio de pedicura a un nivel profesional, enfocándote en técnicas avanzadas, higiene y spa.",
    imageUrl: "/academiaImg/pedicura.png",
    tags: ["Pedicura Pro", "Servicio Spa", "Técnica Avanzada"],
    price: 850.00,
    originalPrice: 950.00,
    format: "Mentoría VIP Presencial",
    duration: "6-8 horas",
  },
  {
    id: 5,
    title: "MARKETING PARA MANICURISTAS",
    description:
      "Aprende a vender sin miedo y atraer clientas premium. Presencial en Orlando, FL. (Puedes obtenerlo GRATIS en un tercer día si reservas 2 mentorías VIP)",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80",
    tags: ["Marketing", "Clientes Premium", "Redes Sociales"],
    price: 497.00,
    originalPrice: 600.00,
    format: "Módulo Presencial",
    duration: "1 Día",
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
    answer: "Puedes reservar tu cupo pagando el total de la mentoría a través de nuestra plataforma segura con tarjeta. La inscripción se confirma al recibir el pago."
  },
  {
    question: "EL CERTIFICADO ME SIRVE PARA TRABAJAR EN LOS ESTADOS UNIDOS ?",
    answer: "Recibirás un certificado de finalización de Maje Nails Academy que avala tu participación y las técnicas aprendidas. Este certificado acredita tu capacitación privada. Los requisitos para licencias de trabajo varían por estado y deben consultarse con las entidades regulatorias locales."
  }
];

// --- Logros de las alumnas ---
const achievements = [
  {
    title: "Lanzan servicios premium en menos de 30 días",
    desc: "Implementan rutinas exclusivas y diferenciales que las posicionan sobre la competencia desde el primer mes."
  },
  {
    title: "Duplican la frecuencia de clientas",
    desc: "Aprenden protocolos de fidelización y marketing que generan clientas recurrentes y listas de espera."
  },
  {
    title: "Profesionalizan su marca personal",
    desc: "Construyen una imagen sólida en redes, con contenidos estratégicos que atraen a clientas dispuestas a pagar más."
  },
  {
    title: "Escalan sus ingresos",
    desc: "Crean paquetes VIP, suben tarifas y gestionan finanzas del negocio para vivir 100% de la belleza de lujo."
  }
];

// --- Horarios disponibles (definir después según reglas) ---
const AVAILABLE_TIMES = [
  "09:00",
  "10:00",
  "14:00",
  "15:00",
];

// --- Helper: Verificar si un día es disponible (Lunes=1, Martes=2, Sábado=6) ---
function isDayAvailable(date) {
  const day = date.getDay();
  return day === 1 || day === 2 || day === 6;
}

// --- Componente de Calendario ---
function CalendarPicker({ selectedDate, onSelectDate }) {
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
      const isAvailable = isDayAvailable(date) && !isPast;
      
      days.push({
        date,
        day,
        isAvailable,
        isPast,
      });
    }

    return days;
  }, [currentMonth]);

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

          const { date, day, isAvailable, isPast } = dayInfo;
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
                  : 'bg-transparent text-brand-text-light/30 cursor-not-allowed line-through'
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

// --- Componente de Selección de Hora ---
function TimePicker({ selectedTime, onSelectTime, selectedDate }) {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg border border-brand-gray-light/30 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px]">
        <ClockIcon className="h-12 w-12 sm:h-16 sm:w-16 text-brand-text-light/40 mx-auto mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base lg:text-lg text-brand-text font-bold mb-1 sm:mb-2">
          Selecciona una fecha primero
        </p>
        <p className="text-xs sm:text-sm text-brand-text-light">
          Elige un día disponible en el calendario
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-brand-gray-light/30">
      <h3 className="text-base sm:text-lg lg:text-xl font-black text-brand-text mb-4 sm:mb-6 flex items-center gap-2">
        <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-pink" />
        Selecciona la hora
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        {AVAILABLE_TIMES.map((time) => {
          const isSelected = selectedTime === time;
          
          return (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              className={`
                py-3 sm:py-4 lg:py-5 px-4 sm:px-6 rounded-xl text-sm sm:text-base lg:text-lg font-black transition-all duration-200 shadow-sm
                ${isSelected
                  ? 'bg-emerald-500 text-white shadow-xl scale-110 ring-4 ring-emerald-200'
                  : 'bg-brand-gray-light/40 text-brand-text hover:bg-emerald-50 hover:ring-2 hover:ring-emerald-200 active:scale-95 sm:hover:scale-105 sm:hover:shadow-md'
                }
              `}
            >
              {time}
            </button>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t-2 border-brand-gray-light/30">
        <p className="text-[10px] sm:text-xs lg:text-sm text-brand-text-light text-center font-medium">
          ⏰ Horarios en zona horaria de Orlando, FL (EST)
        </p>
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
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
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora para tu mentoría.');
      return;
    }

    const bookingDetails = {
      date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
      time: selectedTime,
    };

    iniciarPago(cart, bookingDetails);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return selectedDate.toLocaleDateString('es-ES', options);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-20 md:space-y-32 mb-24 md:mb-32 font-sans">

  {/* === Sección 1: Hero === */}
      <section className="relative overflow-hidden min-h-screen flex items-start pt-24 pb-20 lg:items-center lg:min-h-0 lg:pt-32 lg:pb-28">
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div className="text-left h-full flex flex-col justify-between min-h-[600px] lg:min-h-0">
            {/* Título arriba */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                <span className="text-white lg:text-brand-text drop-shadow-2xl lg:drop-shadow-none">
                  Convierte tu pasión en un{' '}
                </span>
                <span className="block mt-2 drop-shadow-2xl lg:drop-shadow-none bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500 bg-clip-text text-transparent">
                  negocio rentable
                </span>
              </h1>
            </div>

            {/* Texto descriptivo y stats abajo */}
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-white lg:text-brand-text-light leading-relaxed max-w-xl font-light drop-shadow-lg lg:drop-shadow-none">
                Consigue clientes de alto valor en 90 días. Muchas profesionales se frustran ❌ con malos cortes, esmalte corrido o clientas que no regresan. ¡Es momento de tomar acción!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left space-y-1 lg:space-y-2">
                    <div className="text-3xl lg:text-4xl font-black text-white lg:text-brand-text drop-shadow-xl lg:drop-shadow-none">{stat.value}</div>
                    <div className="text-[10px] lg:text-xs font-semibold lg:font-bold text-white/90 lg:text-brand-text-light uppercase tracking-wider lg:tracking-[0.2em] leading-tight drop-shadow-lg lg:drop-shadow-none">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
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

      {/* === Sección 2.5: Qué logran las alumnas === */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Columna de Texto */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-brand-text leading-tight">
              ¿Qué logran las alumnas en esta mentoría VIP?
            </h2>
            <div className="space-y-6">
              {achievements.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <CheckCircleIcon className="h-6 w-6 text-brand-pink" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-text">{item.title}</h3>
                    <p className="text-base text-brand-text-light font-light leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de Imagen */}
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl aspect-[4/5]">
              <img
                src="/academiaImg/queLogran.png"
                alt="Maje, mentora de Maje Nails Academy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-brand-pink/10 blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* === Sección de Pricing === */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-6 md:p-8 max-w-4xl w-full">
            <Image
              src="/academiaImg/pricing.png"
              alt="Pricing de Maje Nails Academy"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl"
            />
          </div>
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
            Elige la capacitación intensiva (6-8 horas) que transformará tu carrera. Todos los módulos incluyen el kit completo y soporte post-curso.
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

                      <div className="flex gap-4 pt-4">
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
            );
          })}
        </div>
      </section>

      {/* === Sección 4: Testimonios === */}
      <section className="relative bg-brand-gray-light/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
              Lo que dicen mis alumnas
            </h2>
            <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
              Más de 100 alumnas han probado este método y han duplicado sus ingresos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="relative bg-white p-8 rounded-3xl shadow-xl border border-brand-gray-light/20">
                <ChatBubbleBottomCenterTextIcon className="h-16 w-16 text-brand-pink/20 absolute -top-6 -left-4" />
                <div className="relative space-y-5">
                  <p className="text-xl font-light text-brand-text-light italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-black text-lg text-brand-text">{t.author}</div>
                    <div className="text-sm font-bold text-brand-pink uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Sección 5: FAQs === */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            Preguntas Frecuentes
          </h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white border-2 border-brand-gray-light/20 rounded-2xl p-6">
              <h3 className="text-xl font-black text-brand-text mb-3">{faq.question}</h3>
              <p className="text-base text-brand-text-light font-light leading-relaxed">{faq.answer}</p>
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

              {cart.length > 0 && (
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
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="#mentorias"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white px-8 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:shadow-lg"
                >
                  <AcademicCapIcon className="h-6 w-6" />
                  Ver Mentorías
                </Link>
          
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all duration-300 ${
                    cart.length > 0
                      ? 'bg-brand-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-brand-gray-light/50 text-brand-text/40 cursor-not-allowed'
                  }`}
                >
                  <CalendarDaysIcon className="h-6 w-6" />
                  Seleccionar Fecha y Hora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Modal de Reserva (Calendario + Hora) === */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-6xl">
              <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowBookingModal(false)}
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
                      Selecciona tu fecha y hora
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-brand-text-light font-light max-w-2xl mx-auto px-4">
                      Las mentorías están disponibles los lunes, martes y sábados. Reserva con mínimo 14 días de anticipación.
                    </p>
                  </div>

                  {/* Grid: Calendario + Hora */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                    <TimePicker
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                    />
                  </div>

                  {/* Resumen de la reserva */}
                  {selectedDate && selectedTime && (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 border-2 border-brand-pink/20 shadow-lg">
                      <h3 className="text-base sm:text-lg font-black text-brand-text mb-3 sm:mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-pink" />
                        Resumen de tu reserva
                      </h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-brand-gray-light/20 gap-1 sm:gap-0">
                          <span className="text-xs sm:text-sm font-bold text-brand-text-light uppercase tracking-wide">
                            Fecha seleccionada
                          </span>
                          <span className="text-sm sm:text-base font-black text-brand-text capitalize">
                            {formatSelectedDate()}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-brand-gray-light/20 gap-1 sm:gap-0">
                          <span className="text-xs sm:text-sm font-bold text-brand-text-light uppercase tracking-wide">
                            Hora
                          </span>
                          <span className="text-sm sm:text-base font-black text-brand-text">
                            {selectedTime} EST
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                          <span className="text-xs sm:text-sm font-bold text-brand-text-light uppercase tracking-wide">
                            Total a pagar
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-brand-pink">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-0 border-t sm:border-t-0 border-brand-gray-light/20">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white px-6 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30 order-2 sm:order-1"
                    >
                      Volver
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={!selectedDate || !selectedTime}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition-all duration-300 order-1 sm:order-2 ${
                        selectedDate && selectedTime
                          ? 'bg-brand-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                          : 'bg-brand-gray-light/50 text-brand-text/40 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBagIcon className="h-6 w-6" />
                      Confirmar y Pagar
                    </button>
                  </div>

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

                <div className="flex-1 p-8 space-y-6">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-brand-text leading-tight mb-4">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-lg text-brand-text-light leading-relaxed font-light">
                      {selectedCourse.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-brand-gray-light/60 px-4 py-2 text-sm font-bold uppercase tracking-wider text-brand-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-brand-gray-light/20">
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-4xl font-black text-[#32CD32]">
                        ${selectedCourse.price}
                      </span>
                      <span className="text-xl font-medium text-brand-text-light/70 line-through">
                        ${selectedCourse.originalPrice}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-brand-text uppercase tracking-wide">Duración</p>
                      <p className="text-base text-brand-text-light">{selectedCourse.duration}</p>
                    </div>

                    <div className="flex gap-4 pt-6">
                      {cart.some((item) => item.id === selectedCourse.id) ? (
                        <button
                          onClick={() => removeFromCart(selectedCourse.id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-50 border-2 border-red-200 px-6 py-4 text-base font-black text-red-600 transition-all duration-300 hover:bg-red-100"
                        >
                          <TrashIcon className="h-5 w-5" />
                          Quitar del carrito
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(selectedCourse)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-black px-6 py-4 text-base font-black text-white shadow-lg hover:shadow-xl transition-all duración-300"
                        >
                          <ShoppingBagIcon className="h-5 w-5" />
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
      {cart.length > 0 && (
        <>
          <button
            onClick={() => setShowCart(!showCart)}
            className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-black text-white shadow-2xl shadow-black/40 border-4 border-white transition-all duration-300 hover:scale-110 hover:shadow-black/60 active:scale-95"
          >
            <ShoppingBagIcon className="h-7 w-7" />
            <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 border-4 border-white text-xs font-black text-white shadow-xl">
              {totalItems}
            </span>
          </button>

          {/* Cart Dropdown */}
          {showCart && (
            <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border-2 border-brand-gray-light/20 overflow-hidden animate-fadeInUp">
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
                {cart.map((item) => (
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
                      <p className="text-base font-black text-brand-pink mt-1">
                        ${item.price}
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
                  Seleccionar Fecha y Hora
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}