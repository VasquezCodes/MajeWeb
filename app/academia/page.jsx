'use client';

import React, { useState } from 'react';
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
  TrashIcon
} from '@heroicons/react/24/solid';

// --- Helper de pago con Stripe (redirección a Checkout) ---
async function iniciarPago(cart) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
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
    duration: "3 horas",
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
    duration: "4 horas",
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
    duration: "2 sesiones",
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
    duration: "5 horas",
  },
];

const stats = [
  { value: "200+", label: "Alumnas certificadas" },
  { value: "15+", label: "Cursos disponibles" },
  { value: "1:1", label: "Mentoría personalizada" },
];

// --- Componente Principal de la Página ---
export default function AcademiaPage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-20 md:space-y-32 mb-24 md:mb-32 font-sans">

      {/* === Sección 1: Hero === */}
      <section className="relative overflow-hidden min-h-screen flex items-center py-20 lg:min-h-0 lg:pt-32 lg:pb-28">
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
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 lg:bg-brand-pink/10 lg:border-brand-pink/20">
              <SparklesIcon className="h-4 w-4 text-brand-pink animate-pulse" />
              <span className="text-xs font-bold text-white lg:text-brand-pink uppercase tracking-[0.2em]">
                Formación Premium
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white lg:text-brand-text tracking-tight leading-[1.1]">
              Transforma tu carrera con{' '}
              <span className="text-brand-pink block mt-2 bg-gradient-to-r from-brand-pink to-pink-400 bg-clip-text text-transparent">
                Maje Academy
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 lg:text-brand-text-light leading-relaxed max-w-xl font-light">
              Mentorías exclusivas para artistas que desean dominar técnicas avanzadas y posicionarse como referentes de la industria del nail art.
            </p>

            {/* Stats Mobile */}
            <div className="grid grid-cols-3 gap-6 pt-6 lg:hidden">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-semibold text-white/70 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Desktop */}
            <div className="hidden lg:grid grid-cols-3 gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-4xl font-black text-brand-text">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-text-light">
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
      </section>

      {/* === Sección 2: Lista de Mentorías === */}
      <section id="mentorias" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 px-5 py-2.5">
            <AcademicCapIcon className="h-4 w-4 text-brand-pink" />
            <span className="text-xs font-bold text-brand-pink uppercase tracking-[0.2em]">
              Formación Profesional
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text leading-tight">
            Mentorías VIP
          </h2>
          
          <p className="text-lg md:text-xl text-brand-text-light font-light leading-relaxed">
            Programas exclusivos diseñados para elevar tu técnica y transformar tu negocio
          </p>
        </div>

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
                  <div className="relative h-64 overflow-hidden">
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

                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-white drop-shadow-2xl">
                          ${course.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-brand-text leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-base text-brand-text-light leading-relaxed font-light">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-brand-gray-light/50 px-3 py-1.5 text-xs font-bold text-brand-text"
                        >
                          {tag}
                        </span>
                      ))}
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
                      
                      <Link
                        href="#"
                        className="flex-1 flex items-center justify-center rounded-2xl border-2 border-brand-text/20 px-5 py-4 text-sm font-black text-brand-text transition-all duration-300 active:scale-95"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex">
                    <div className="relative w-2/5 overflow-hidden">
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
                        <p className="text-lg leading-relaxed text-brand-text-light font-light">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-brand-gray-light/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-black text-brand-pink">
                            ${course.price}
                          </span>
                        </div>
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
                        
                        <Link
                          href="#"
                          className="flex-1 flex items-center justify-center rounded-2xl border-2 border-brand-text/20 px-6 py-4 text-base font-black text-brand-text transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                        >
                          Ver temario completo
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                  Agenda Exclusiva
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-text leading-tight max-w-2xl mx-auto">
                ¿Lista para transformar tu carrera?
              </h2>
              
              <p className="text-lg sm:text-xl text-brand-text-light font-light max-w-2xl mx-auto leading-relaxed">
                Reserva tu llamada de descubrimiento y te ayudamos a elegir la mentoría perfecta para tus objetivos.
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
                  onClick={() => iniciarPago(cart)}
                  disabled={cart.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all duration-300 ${
                    cart.length > 0
                      ? 'bg-brand-black text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-brand-gray-light/50 text-brand-text/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  Completar Inscripción
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    iniciarPago(cart);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-black px-6 py-4 text-base font-black text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Completar Inscripción
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}