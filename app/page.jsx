'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';
import ScrollReveal from '../components/ScrollReveal';

// Importamos los iconos que usaremos (asegúrate de tener @heroicons/react instalado)
import { 
  SparklesIcon, 
  PaintBrushIcon, 
  HandRaisedIcon, 
  StarIcon 
} from '@heroicons/react/24/solid';

// --- Datos de Ejemplo ---
const featuredServices = [
  {
    name: "Manicura Semipermanente",
    shortLabel: "Mani",
    description: "Brillo espejo hasta tres semanas con acabado impecable.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Spa de Pedicura",
    shortLabel: "Pedi",
    description: "Exfoliación aromática, masaje relajante y esmaltado perfecto.",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Diseños Personalizados",
    shortLabel: "Art",
    description: "Creamos diseños exclusivos inspirados en las últimas tendencias.",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1000&q=80",
  },
];

const testimonials = [
  {
    quote: "¡El mejor servicio de kapping en la ciudad! Majo es súper detallista y mis uñas duran semanas.",
    author: "Laura G.",
  },
  {
    quote: "Me hice la pedicura y fue una experiencia súper relajante. Profesionalismo 100%. ¡Volveré sin dudas!",
    author: "Sofía P.",
  },
  {
    quote: "Amo mis uñas. Los diseños son únicos y el lugar es impecable. Súper recomendado.",
    author: "Ana L.",
  },
];

// --- Componente Principal de la Página ---
export default function HomePage() {
  const serviceRefs = useStaggeredAnimation(3, 0.2);

  return (
    <div className="space-y-32 md:space-y-40 mb-32 md:mb-40">
      
      {/* === Sección 1: Hero === */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-end lg:items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/photo4.JPEG"
            alt="Manicura profesional aplicando esmalte a una clienta en un spa"
            fill
            priority
            className="object-cover object-[center_25%] sm:object-[center_30%] lg:object-[center_22%]"
            sizes="100vw"
          />
          {/* Gradiente lateral para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-brand-black/60 to-transparent lg:from-brand-black/80 lg:via-brand-black/40 lg:to-transparent" />
          {/* Gradiente inferior suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
        </div>

        {/* Contenedor del texto - ajustado para móvil y desktop */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 pb-12 lg:pb-0">
          <div className="max-w-7xl lg:ml-0">
            <div className="max-w-3xl lg:max-w-2xl space-y-4 lg:space-y-8 text-brand-white text-left">
              {/* Espaciado reducido en móvil para comprimir el contenido */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight animate-slide-up">
                Hola, soy MariaJesus,
              </h1>
              <p className="font-crimson text-base md:text-xl lg:text-2xl text-brand-gray-light/90 leading-relaxed tracking-[0.08em] animate-fade-in delay-300">
                fundadora de Maje Nail Spa y Maje Nail Academy. Con más de 7 años de trayectoria en el mundo de las uñas y en la formación de profesionales del ramo, te doy la bienvenida a este espacio, donde podrás reservar tus servicios y formarte como profesional si así lo deseas.
              </p>
              {/* Botones con espaciado reducido en móvil */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 justify-start animate-fade-in delay-500">
                <Link
                  href="/academia"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-white text-brand-black text-sm md:text-base lg:text-lg font-crimson tracking-[0.2em] rounded-2xl shadow-lg hover:bg-brand-gray-light hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Academia
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-brand-white/70 text-brand-white text-sm md:text-base lg:text-lg font-crimson tracking-[0.2em] rounded-2xl hover:bg-brand-white/15 hover:border-brand-white transition-all duration-300"
                >
                  Servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Sección 2: Servicios Destacados === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="text-center">
          <h2 className="text-sm font-semibold text-brand-gray-dark uppercase tracking-widest">
            Nuestros Servicios
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-serif font-bold text-brand-text">
            Especialistas en Cuidado y Diseño
          </p>
        </ScrollReveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <div
              key={service.name}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Image
                src={service.imageUrl}
                alt={service.name}
                width={500}
                height={600}
                className="h-80 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/45 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end space-y-3 text-brand-white">
                <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-brand-gray-light/80 font-crimson">{service.shortLabel}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold leading-snug">{service.name}</h3>
                <p className="text-sm md:text-base text-brand-gray-light/90 font-sans leading-relaxed max-w-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* === Sección 3: Testimonios (Prueba Social) === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="text-center">
          <h2 className="text-sm font-semibold text-brand-slate uppercase tracking-widest">
            Testimonios
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-serif font-bold text-brand-text">
            Lo que dicen nuestras clientas
          </p>
        </ScrollReveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.author}
              animation="scale"
              delay={index * 0.2}
              className="bg-brand-white p-8 rounded-2xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex text-brand-black animate-float">
                <StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" />
                <StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" />
                <StarIcon className="h-5 w-5" />
              </div>
              <blockquote className="mt-5 text-brand-text-light italic text-lg flex-grow">
                "{testimonial.quote}"
              </blockquote>
              <footer className="mt-4">
                <p className="font-bold text-brand-text">— {testimonial.author}</p>
                <p className="text-sm text-gray-400">Opinión verificada (Booksy)</p>
              </footer>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* === Sección 4: CTA Final (Llamado a la acción) === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="scale" className="bg-brand-gray-light p-12 md:p-20 rounded-3xl text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text animate-slide-up">
            ¿Lista para tu próximo turno?
          </h2>
          <p className="mt-4 text-lg text-brand-text-light max-w-xl mx-auto animate-fade-in delay-300">
            Agenda tu cita en menos de un minuto a través de nuestro sistema de reservas online.
          </p>
          <div className="mt-8 animate-fade-in delay-500">
            <Link
              href="/reservas"
              className="inline-block px-10 py-4 bg-brand-black text-brand-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-brand-charcoal hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Reservar Turno Ahora
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}