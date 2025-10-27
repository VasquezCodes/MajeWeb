'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Importamos los iconos que usaremos
import {
  AcademicCapIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';

// --- Datos de Ejemplo para los Cursos ---
const courses = [
  {
    id: 1,
    title: "Mentoría: Manicura Rusa",
    description:
      "Perfecciona tu técnica de cutículas y esmaltado. Aprende el 'antes y después' que define un trabajo premium.",
    imageUrl: "/serviciosImg/redNails.jpeg",
    tags: ["Técnica avanzada", "Cutículas perfectas", "Esmaltado espejo"],
    price: 250.00,
    originalPrice: 300.00,
    format: "Mentoría 1:1",
    duration: "Duración: 3 horas",
  },
  {
    id: 2,
    title: "Mentoría: Sistema Dual (Dual System)",
    description:
      "Domina la construcción de uñas esculpidas de forma rápida y precisa con la técnica de moldes duales.",
    imageUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=960&q=80",
    tags: ["Esculpidas premium", "Arquitectura precisa", "Modelado rápido"],
    price: 350.00,
    originalPrice: 400.00,
    format: "Mentoría híbrida",
    duration: "Duración: 4 horas",
  },
  {
    id: 3,
    title: "Mentoría: Marketing de Belleza",
    description:
      "Deja de cobrar barato. Aprende a crear tu marca, atraer clientas de alto valor y llenar tu agenda.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80",
    tags: ["Branding de lujo", "Estrategia digital", "Precio premium"],
    price: 200.00,
    originalPrice: 250.00,
    format: "Workshop VIP",
    duration: "Duración: 2 sesiones",
  },
  {
    id: 4,
    title: "Mentoría: Manicura y Pedicura Spa",
    description:
      "Eleva tu servicio básico a una experiencia de lujo. Aprende protocolos de spa, exfoliación y masajes.",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=960&q=80",
    tags: ["Experiencia sensorial", "Protocolos spa", "Fidelización"],
    price: 300.00,
    originalPrice: 350.00,
    format: "Práctica guiada",
    duration: "Duración: 5 horas",
  },
];

const stats = [
  {
    value: "200+",
    label: "Alumnas certificadas",
  },
  {
    value: "15+",
    label: "Cursos disponibles",
  },
  {
    value: "1:1",
    label: "Mentoría personalizada",
  },
];

const steps = [
  {
    icon: PencilSquareIcon,
    title: "Paso 1: Elige tu Mentoría",
    description: "Navega por nuestros cursos y selecciona la mentoría que mejor se adapte a tus objetivos. Revisa los detalles y precios."
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: "Paso 2: Completa tu Inscripción",
    description: "Llena el formulario de inscripción con tus datos. Te contactaremos para coordinar la fecha y forma de pago."
  },
  {
    icon: CalendarDaysIcon,
    title: "Paso 3: Confirma tu Fecha",
    description: "Una vez coordinado, confirma tu participación y realiza el pago. Tu lugar queda reservado inmediatamente."
  }
];

// --- Componente Principal de la Página ---

export default function AcademiaPage() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="space-y-24 md:space-y-32 mb-24 md:mb-32">

      {/* === Sección 1: Hero de Tienda (ACTUALIZADO CON RESPONSIVE Y MEJOR LEGIBILIDAD) === */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center py-20 lg:min-h-0 lg:pt-32 lg:pb-28">
        
        {/* Fondos decorativos para desktop */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl hidden lg:block" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-gray/10 blur-3xl hidden lg:block" />

        {/* --- NUEVO: Imagen de Fondo para Mobile (con más opacidad) --- */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/academiaImg/academiaHero.JPEG"
            alt="Mentoría personalizada de uñas de lujo"
            fill
            priority
            className="object-cover object-center" 
          />
          {/* Gradiente más oscuro para legibilidad del texto en móvil */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/60 to-transparent" />
        </div>

        {/* --- Contenedor Principal --- */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* === Texto del Hero (con alineación y elementos responsivos) === */}
          <div className="text-left"> {/* Texto alineado a la izquierda en móvil y desktop */}
            <h1 className="mt-6 text-4xl md:text-6xl font-bold text-brand-white lg:text-brand-text tracking-tight">
              Eleva tu carrera con <span className="text-brand-pink">Maje Academy</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-gray-light lg:text-brand-text-light max-w-xl">
              Diseñamos mentorías premium para artistas de uñas que desean dominar técnicas avanzadas, crear experiencias de lujo y posicionarse como referentes de la industria.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4"> {/* Botones alineados a la izquierda */}
              {/* Este botón solo se muestra en desktop (lg:block) */}
              <Link
                href="#proceso"
                className="hidden lg:inline-flex items-center justify-center rounded-2xl border px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 
                        lg:border-brand-text/20 lg:text-brand-text lg:hover:border-brand-text lg:hover:bg-transparent"
              >
                Conoce el Proceso
              </Link>
            </div>

            {/* --- Stats para Desktop (oculto en mobile) --- */}
            <dl className="mt-12 hidden grid-cols-1 sm:grid-cols-3 gap-8 lg:grid">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l-2 border-brand-pink/40 pl-6 text-left">
                  <dt className="text-3xl font-bold text-brand-text">{stat.value}</dt>
                  <dd className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-text-light">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* === Imagen del Hero (Oculta en mobile) === */}
          <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-lg hidden lg:block">
            <div className="absolute inset-0 -translate-x-6 translate-y-8 rounded-[2.5rem] bg-gradient-to-br from-brand-pink/50 via-white/30 to-brand-gray-light/60 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/60">
              <Image
                src="/academiaImg/academiaHero.JPEG"
                alt="Mentoría personalizada de uñas de lujo"
                width={900}
                height={1100}
                className="h-[720px] w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* === Sección 2: Lista de Mentorías (ACTUALIZADO CON SPLIT-LAYOUT) === */}
      <section id="mentorias" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center">
          <h2 className="text-sm font-semibold text-brand-pink uppercase tracking-widest">
            Formación Profesional
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-bold text-brand-text">
            Nuestras Mentorías VIP
          </p>
        </div>

        {/* Usamos 'grid-cols-1' y un 'gap' mayor */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:gap-16">
          {courses.map((course, index) => (
            <div key={course.title} className={`group relative rounded-[2rem] bg-gradient-to-br from-brand-gray-light via-white to-brand-pink-light p-[1px] animate-fadeInUp`} style={{ animationDelay: `${index * 200}ms` }}>
              
              {/* Contenedor con 'flex-col md:flex-row' */}
              <div className="flex h-full flex-col md:flex-row overflow-hidden rounded-[calc(2rem-1px)] bg-white/90 shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                
                {/* --- CONTENEDOR DE IMAGEN (IZQUIERDA) --- */}
                <div className="relative overflow-hidden md:w-5/12">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={600}
                    height={600} 
                    className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-text">
                    {course.format}
                  </span>
                  {course.originalPrice && (
                    <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Oferta
                    </span>
                  )}
                </div>

                {/* --- CONTENEDOR DE TEXTO (DERECHA) --- */}
                <div className="flex flex-grow flex-col gap-6 p-8 md:p-10 md:w-7/12">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-brand-text">{course.title}</h3>
                    <p className="mt-4 text-base lg:text-lg leading-relaxed text-brand-text-light">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-brand-gray-light/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm font-medium text-brand-text-light">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-brand-pink">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-xl text-brand-text-light line-through">${course.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-base">{course.duration}</span>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => addToCart(course)}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink/90"
                    >
                      Inscribirme Ahora
                    </button>
                    <Link
                      href="#"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-brand-text/15 px-6 py-3.5 text-base font-semibold text-brand-text transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-text"
                    >
                      Ver temario detallado
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Sección 3: Cómo Inscribirte === (Sin cambios) */}
      <section id="proceso" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-10 -top-10 h-40 rounded-full bg-brand-gray-light/70 blur-3xl" />
        <div className="text-center">
          <h2 className="text-sm font-semibold text-brand-pink uppercase tracking-widest">
            Nuestro Proceso
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-bold text-brand-text">
            Una Experiencia 100% Personalizada
          </p>
        </div>

        <div className="mt-16 rounded-[2.5rem] bg-white/90 p-10 shadow-2xl ring-1 ring-brand-gray-light/60 backdrop-blur">
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-[17%] top-12 hidden h-[2px] w-[66%] -translate-x-1/2 bg-gradient-to-r from-brand-pink/30 via-brand-gray/20 to-brand-pink/30 md:block" />
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center rounded-2xl border border-brand-gray-light/70 bg-white/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeInUp"
                style={{ animationDelay: `${(index + 2) * 300}ms` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink text-white shadow-lg">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-gray-light/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-text">
                  Paso {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-brand-text">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-brand-text-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Sección 4: CTA Final === (Sin cambios) */}
      <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-pink via-brand-gray-light to-white p-[1px] shadow-2xl">
          <div className="relative rounded-[2.5rem] bg-white/95 px-10 py-14 text-center backdrop-blur">
            <div className="absolute -right-20 -top-10 h-44 w-44 rounded-full bg-brand-pink/20 blur-3xl" />
            <div className="absolute -left-24 -bottom-12 h-52 w-52 rounded-full bg-brand-gray/10 blur-3xl" />
            <span className="inline-flex items-center justify-center rounded-full border border-brand-text/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-text">
              Agenda Exclusiva
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-brand-text">
              ¿Lista para dar el siguiente paso en tu carrera?
            </h2>
            <p className="mt-4 text-lg text-brand-text-light">
              Reserva tu llamada de descubrimiento y te ayudamos a elegir la mentoría ideal para tus objetivos. Nuestro equipo te acompaña en cada detalle.
            </p>
            <div className="mt-6 text-center">
              <p className="text-sm text-brand-text-light">
                Inscripciones en carrito: <span className="font-semibold text-brand-pink">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </p>
              <p className="text-lg font-bold text-brand-text">
                Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#mentorias"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-pink px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-pink/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink/90"
              >
                Revisar Mentorías
              </Link>
              <button
                onClick={() => alert('Proceso de inscripción próximamente con Stripe')}
                disabled={cart.length === 0}
                className={`inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  cart.length > 0
                    ? 'bg-brand-text text-white shadow-brand-text/30 hover:bg-brand-text/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Completar Inscripción
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === Floating Cart Icon === (Sin cambios) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink text-white shadow-xl shadow-brand-pink/30 transition-all duration-300 hover:scale-110">
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-text text-xs font-bold text-white">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>
      )}

    </div>
  );
}