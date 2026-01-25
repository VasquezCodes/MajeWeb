'use client';

import Link from 'next/link';
import Image from 'next/image';
import PassarelaCard from '../components/PassarelaCard';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { AnimatedText } from '@/components/ui/AnimatedText';

// --- Contenido de las Secciones ---
const pasarelas = [
  {
    title: "Formación Presencial 2026",
    subtitle: "Clases Grupales",
    description: [
      "Entrenamientos diseñados para manicuristas que desean aprender con profundidad, estructura y acompañamiento real.",
      "Cada programa está enfocado en perfeccionar la técnica, ganar seguridad en mesa y desarrollar un criterio profesional que se refleja en resultados, confianza y valor.",
      "Aquí no vienes a improvisar. Vienes a formarte con intención."
    ],
    cta: "Ver programas 2026",
    ctaUrl: "/presencial",
    image: "/nuevasImg/clasesGrupalesINFO.jpeg",
    imagePosition: "right"
  },
  {
    title: "Programas y Mentorías VIP",
    description: [
      "Procesos de formación personalizados para manicuristas que desean llevar su técnica y su visión profesional a un nivel más alto.",
      "Las mentorías VIP están diseñadas para quienes buscan atención cercana, corrección detallada y acompañamiento estratégico en su evolución técnica y profesional.",
      "No es solo aprender más. Es aprender mejor."
    ],
    cta: "Aplicar a Mentorías VIP",
    ctaUrl: "/academia",
    image: "/portadaMentoria.jpeg",
    imagePosition: "left"
  },
  {
    title: "Programa Online · Manicurista CEO",
    description: [
      "Un programa online creado para manicuristas que desean fortalecer su base técnica y mentalidad profesional desde cualquier lugar.",
      "Aquí encontrarás un proceso claro, estructurado y con intención, pensado para ayudarte a comprender la técnica desde otro nivel y comenzar a trabajar con más criterio y seguridad.",
      "Aprende a tu ritmo, sin perder el enfoque profesional."
    ],
    cta: "Acceder al programa online",
    ctaUrl: "https://go.hotmart.com/G99672120D",
    image: "/hero.JPEG",
    imagePosition: "right"
  },
  {
    title: "Productos Digitales",
    description: [
      "Recursos creados para complementar tu formación y ayudarte a reforzar conocimientos clave dentro de tu proceso profesional.",
      "Aquí encontrarás materiales digitales diseñados con el mismo enfoque que caracteriza nuestra formación: claridad, intención y criterio técnico.",
      "Ideales para quienes desean seguir aprendiendo y creciendo paso a paso."
    ],
    cta: "Ver productos digitales",
    ctaUrl: "/productos",
    image: "/portadaParaProductosDigitales.PNG",
    imagePosition: "left"
  },
  {
    title: "Servicios en el Spa",
    description: [
      "Además de la formación, también puedes vivir la experiencia Majé a través de nuestros servicios de manicura y pedicura profesional.",
      "Cada servicio está pensado para ofrecer limpieza, cuidado y acabados duraderos, en un ambiente de atención personalizada y bienestar."
    ],
    cta: "Reservar un servicio",
    ctaUrl: "/reservas",
    image: "/portadaParaServicios.jpg",
    imagePosition: "right"
  }
];

export default function HomePage() {
  return (
    <>
      <div className="bg-brand-white">

        {/* === HERO SECTION === */}
        <section className="relative min-h-[700px] md:min-h-[800px] lg:min-h-[850px] flex flex-col items-center justify-end pb-12 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/nuevasImg/nuevoHero.jpg"
              alt="Mariajesus Matos fundadora de Maje Nail Spa"
              fill
              className="object-cover object-center opacity-90"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay for better visibility of text while keeping face clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 animate-fade-in-up">


            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight drop-shadow-md">
              <AnimatedText text="Un espacio para manicuristas que quieren más" />
            </h1>

            <div className="max-w-2xl mx-auto space-y-6 text-white/90 text-lg md:text-xl font-light font-sans leading-relaxed drop-shadow-sm">
              <p>
                Soy Mariajesus Matos, fundadora y creadora de una marca dedicada a elevar el nivel de la industria de las uñas a través de formación y servicios especializados.
              </p>
            </div>

            <div className="pt-12 flex flex-col items-center gap-4 animate-bounce">
              <span className="text-white/90 font-light text-sm md:text-base uppercase tracking-[0.2em]">
                Desliza para ver programas y mentorías
              </span>
              <ArrowDownIcon className="w-6 h-6 text-white/90" />
            </div>
          </div>

          {/* Scroll Indicator */}
          {/* Scroll Indicator (Removed as requested) */}
        </section>

        {/* === PASARELAS === */}
        <div className="flex flex-col gap-8 md:gap-16 py-12 md:py-24">
          {pasarelas.map((pasarela, index) => (
            <PassarelaCard
              key={index}
              index={index}
              {...pasarela}
            />
          ))}
        </div>

      </div>
    </>
  );
}
