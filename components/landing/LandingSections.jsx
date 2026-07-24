"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "../ScrollReveal";
import WhatsAppCTA from "./WhatsAppCTA";
import { PAINS, OUTCOMES, PROGRAMS, PORTFOLIO, TESTIMONIALS, FAQS } from "./data";

const SECTION = "max-w-[1280px] mx-auto px-5 sm:px-8";

/* ------------------------------------------------------------------ HERO */
function Hero() {
  return (
    <section
      id="top"
      className="relative bg-spa-taupe-dark text-spa-cream overflow-hidden"
    >
      {/* Gradiente atmosférico radial — profundidad cinematográfica, no fondo plano */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 90% at 55% 45%, rgba(92, 78, 66, 0.6), transparent 75%)",
        }}
      />

      {/* Sello vertical rotado — borde izquierdo, lg+ */}
      <div className="hidden lg:flex absolute top-0 bottom-0 left-4 xl:left-8 items-center pointer-events-none z-20">
        <span
          className="font-display text-[10px] uppercase tracking-[0.6em] text-spa-clay/60 whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Atelier · Orlando, FL
        </span>
      </div>

      <div className="relative grid lg:grid-cols-12 lg:min-h-[92vh] z-10">
        {/* Foto editorial */}
        <div className="relative lg:col-span-6 aspect-[4/5] sm:aspect-[3/2] lg:aspect-auto">
          <Image
            src="/sesionFotosMaje/IMG_0159.jpg"
            alt="Mariajesus Matos, fundadora de Majé Nails Academy"
            fill
            priority
            quality={90}
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover object-[55%_25%]"
          />
          {/* Right edge fade hacia la columna oscura de texto */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-spa-taupe-dark"
          />
          {/* Bottom fade */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-spa-taupe-dark/65 to-transparent"
          />
        </div>

        {/* Texto */}
        <div className="relative lg:col-span-6 flex items-center px-5 sm:px-8 lg:pl-8 xl:pl-12 lg:pr-12 xl:pr-20 py-16 sm:py-20 lg:py-24">
          <div className="max-w-md lg:max-w-none lg:w-full">
            {/* Eyebrow Anton + clay (firma propia, no AnyiNails) */}
            <div
              className="flex items-center gap-3 mb-8 fade-in-rise"
              style={{ animationDelay: "0.1s" }}
            >
              <span aria-hidden="true" className="block h-px w-12 bg-spa-clay" />
              <span className="font-display text-sm sm:text-base uppercase tracking-[0.4em] text-spa-clay">
                Majé Nails Academy
              </span>
            </div>

            {/* Titular Playfair itálica — pura elegancia, sin mezcla agresiva */}
            <h1
              className="font-serif italic leading-[0.92] tracking-tight text-[clamp(3rem,7.5vw,5.75rem)] fade-in-rise"
              style={{ animationDelay: "0.25s" }}
            >
              De manicurista
              <br />
              a experta<span className="text-spa-clay not-italic">.</span>
            </h1>

            {/* Sub paragraph */}
            <p
              className="mt-8 max-w-md text-spa-cream/80 text-base sm:text-[17px] leading-relaxed fade-in-rise"
              style={{ animationDelay: "0.45s" }}
            >
              Formación de alto nivel para manicuristas que no se conforman con
              lo básico — estructura, criterio y acabados que se pagan solos.
            </p>

            {/* CTA + firma autoral */}
            <div
              className="mt-10 flex flex-col gap-5 fade-in-rise"
              style={{ animationDelay: "0.6s" }}
            >
              <WhatsAppCTA
                messageKey="hero"
                variant="outline-light"
                size="lg"
                greenIcon={false}
              >
                Contacto
              </WhatsAppCTA>
              <p className="font-serif italic text-spa-cream/55 text-sm">
                — Mariajesus Matos · Educadora referente en la industria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- MENTORÍAS / ASESORÍAS */
function Mentorias() {
  // Máscara radial: la foto se disuelve en el fondo crema. Sin bordes, sin marco.
  const vignetteMask =
    "radial-gradient(ellipse 75% 80% at 65% 50%, black 38%, transparent 95%)";

  return (
    <section
      aria-label="Mentorías VIP"
      className="relative bg-spa-cream overflow-hidden"
    >
      {/* Foto ambiental — solo lg+, fundida con el fondo */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-y-0 right-0 w-[58%] pointer-events-none"
      >
        <Image
          src="/sesionFotosMaje/IMG_0237.jpg"
          alt=""
          fill
          quality={90}
          sizes="58vw"
          className="object-cover object-[65%_center] opacity-85"
          style={{ maskImage: vignetteMask, WebkitMaskImage: vignetteMask }}
        />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-8 py-28 sm:py-40">
        <div className="max-w-md mx-auto lg:mx-0">
          <ScrollReveal animation="fade-up">
            <div className="flex items-center gap-3 text-spa-mocha/60">
              <span aria-hidden="true" className="block h-px w-8 bg-spa-mocha/30" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em]">
                Asesorías · 1 a 1
              </span>
            </div>

            <h2 className="font-serif italic text-spa-espresso mt-6 leading-[1.02] tracking-tight text-[clamp(2.6rem,5.5vw,4.25rem)]">
              Mentorías
            </h2>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-spa-mocha">
              VIP · personalizadas
            </p>

            <p className="mt-7 text-spa-mocha text-[17px] leading-relaxed">
              Un proceso personalizado, en privado, con Mariajesus. Atención
              cercana, corrección detallada y acompañamiento estratégico para
              tu evolución técnica y profesional.
            </p>

            <p className="mt-6 font-serif italic text-spa-espresso/80 text-lg leading-snug">
              No es aprender más — es aprender mejor.
            </p>

            <div className="mt-10">
              <WhatsAppCTA messageKey="mentoria" variant="outline" size="lg">
                Aplicar a una mentoría
              </WhatsAppCTA>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ DOLOR */
function Pain() {
  return (
    <section className="bg-spa-espresso text-spa-cream py-20 sm:py-28">
      <div className={SECTION}>
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            ¿Te suena?
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 max-w-4xl">
            El techo que nadie te explicó
          </h2>
        </ScrollReveal>

        <div className="mt-12 sm:mt-16 divide-y divide-spa-cream/10 border-y border-spa-cream/10">
          {PAINS.map((pain, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 0.08}>
              <div className="flex items-start gap-5 sm:gap-8 py-6 sm:py-8 group">
                <span className="font-display text-2xl sm:text-3xl text-spa-mocha group-hover:text-spa-cream transition-colors duration-300 tabular-nums">
                  0{i + 1}
                </span>
                <p className="text-xl sm:text-2xl md:text-3xl font-light leading-snug text-spa-cream/90">
                  {pain}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- TRANSFORMACIÓN */
function Transformation() {
  return (
    <section className="bg-spa-cream py-20 sm:py-28">
      <div className={SECTION}>
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            La otra orilla
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 text-spa-espresso max-w-4xl">
            Así trabaja una experta
          </h2>
        </ScrollReveal>

        <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 gap-px bg-spa-espresso/10 border border-spa-espresso/10">
          {OUTCOMES.map((item, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={(i % 2) * 0.08}>
              <div className="bg-spa-cream p-8 sm:p-10 h-full">
                <span className="font-display text-3xl text-spa-espresso tabular-nums">
                  0{i + 1}
                </span>
                <p className="mt-4 text-lg sm:text-xl text-spa-espresso/80 leading-relaxed">
                  {item}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FUNDADORA */
function Founder() {
  return (
    <section className="bg-spa-sand py-20 sm:py-28">
      <div className={`${SECTION} grid lg:grid-cols-12 gap-10 lg:gap-16 items-center`}>
        <ScrollReveal animation="fade-right" className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-spa-sand">
            <Image
              src="/sesionFotosMaje/IMG_0264.jpg"
              alt="Mariajesus Matos"
              fill
              quality={90}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center "
            />
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" className="lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            Quién está detrás
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 text-spa-espresso">
            Mariajesus Matos
          </h2>
          <div className="mt-6 space-y-5 text-lg text-spa-espresso/80 leading-relaxed max-w-2xl">
            <p>
              Soy Mariajesus, fundadora de Majé. Llevo más de 8 años dedicada a elevar el
              nivel de la industria de las uñas a través de formación y servicios
              especializados.
            </p>
            <p>
              No enseño a improvisar. Enseño a trabajar con estructura, criterio y la
              seguridad de quien sabe exactamente lo que hace — porque eso es lo que
              convierte a una manicurista en una referente que cobra lo que vale.
            </p>
          </div>
          <div className="mt-8">
            <WhatsAppCTA messageKey="general" variant="outline" size="md">
              Conversemos
            </WhatsAppCTA>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- PROGRAMAS */
function ProgramCard({ program }) {
  const featured = program.featured;
  return (
    <div
      className={`group flex flex-col h-full overflow-hidden border transition-colors duration-300 ${
        featured
          ? "bg-spa-espresso text-spa-cream border-spa-espresso lg:-translate-y-3 shadow-xl shadow-black/10"
          : "bg-spa-cream text-spa-espresso border-spa-espresso/15 hover:border-spa-espresso"
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-spa-sand">
        <Image
          src={program.image}
          alt={program.title}
          fill
          quality={90}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-all duration-700"
        />
        {featured && (
          <span className="absolute top-4 left-4 bg-spa-cream text-spa-espresso text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5">
            Más solicitado
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-7 sm:p-8">
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${
            featured ? "text-spa-cream/60" : "text-spa-mocha/70"
          }`}
        >
          {program.eyebrow}
        </span>
        <h3 className="font-display uppercase tracking-tight leading-none text-2xl sm:text-3xl mt-3">
          {program.title}
        </h3>
        <p className={`mt-1 text-sm font-medium ${featured ? "text-spa-cream/80" : "text-spa-mocha/70"}`}>
          {program.subtitle}
        </p>
        <p className={`mt-4 leading-relaxed flex-1 ${featured ? "text-spa-cream/80" : "text-spa-mocha"}`}>
          {program.description}
        </p>
        <div className="mt-7">
          <WhatsAppCTA
            messageKey={program.messageKey}
            variant={featured ? "light" : "solid"}
            size="md"
            className="w-full sm:w-auto"
          >
            Pedir información
          </WhatsAppCTA>
        </div>
      </div>
    </div>
  );
}

function Programs() {
  return (
    <section id="programas" className="bg-spa-cream py-20 sm:py-28">
      <div className={SECTION}>
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            Elige tu camino
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 text-spa-espresso max-w-4xl">
            Tres formas de subir de nivel
          </h2>
          <p className="mt-5 text-spa-mocha max-w-xl text-lg">
            No verás precios aquí: lo conversamos por WhatsApp según tu punto de partida y
            el formato que mejor se ajuste a ti.
          </p>
        </ScrollReveal>

        <div className="mt-12 sm:mt-16 grid lg:grid-cols-3 gap-6 items-stretch">
          {[...PROGRAMS]
            .sort((a, b) => Number(b.featured) - Number(a.featured))
            .map((program, i) => (
              <ScrollReveal key={program.id} animation="fade-up" delay={i * 0.08} className="h-full">
                <ProgramCard program={program} />
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- PORTAFOLIO */
function Portfolio() {
  return (
    <section className="bg-spa-sand py-20 sm:py-28">
      <div className={SECTION}>
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
                El trabajo habla
              </span>
              <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 text-spa-espresso">
                Resultados reales
              </h2>
            </div>
            <p className="text-sm text-spa-mocha/70 max-w-xs">
              Una muestra de los acabados que enseñamos a dominar — estructura, precisión y duración.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PORTFOLIO.map((src, i) => (
            <ScrollReveal key={src} animation="scale" delay={(i % 4) * 0.06}>
              <div className="relative aspect-square w-full overflow-hidden bg-spa-sand group">
                <Image
                  src={src}
                  alt={`Trabajo de uñas ${i + 1}`}
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- TESTIMONIOS */
function Testimonials() {
  // Sin testimonios reales cargados no se muestra nada: preferimos omitir la
  // sección antes que publicar reseñas de relleno.
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-spa-espresso text-spa-cream py-20 sm:py-28">
      <div className={SECTION}>
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            Lo que dicen
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 max-w-4xl">
            Sus resultados, sus palabras
          </h2>
        </ScrollReveal>

        <div className="mt-12 sm:mt-16 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} animation="fade-up" delay={i * 0.1}>
              <figure className="flex flex-col h-full border border-spa-cream/15 p-8">
                <span className="font-display text-5xl leading-none text-spa-cream/30">“</span>
                <blockquote className="mt-2 text-lg leading-relaxed text-spa-cream/90 flex-1">
                  {t.text}
                </blockquote>
                <figcaption className="mt-6 pt-6 border-t border-spa-cream/15">
                  <div className="text-sm" aria-label="5 de 5 estrellas">
                    ★★★★★
                  </div>
                  <div className="mt-3 font-semibold">{t.name}</div>
                  <div className="text-sm text-spa-mocha/70">{t.role}</div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- FAQ */
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-spa-espresso/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="text-lg sm:text-xl font-medium text-spa-espresso">{item.q}</span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center border border-spa-espresso rounded-full transition-transform duration-300 ${
            isOpen ? "rotate-45 bg-spa-espresso text-spa-cream" : "text-spa-espresso"
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-spa-mocha leading-relaxed max-w-3xl">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-spa-cream py-20 sm:py-28">
      <div className={`${SECTION} max-w-4xl`}>
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spa-mocha/70">
            Antes de escribir
          </span>
          <h2 className="font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] mt-4 text-spa-espresso">
            Preguntas frecuentes
          </h2>
        </ScrollReveal>

        <div className="mt-10 sm:mt-14 border-t border-spa-espresso/10">
          {FAQS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- CTA FINAL */
function FinalCta() {
  return (
    <section className="relative bg-spa-espresso text-spa-cream overflow-hidden">
      <Image
        src="/sesionFotosMaje/IMG_0237.jpg"
        alt=""
        fill
        quality={75}
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 py-24 sm:py-36 text-center">
        <ScrollReveal animation="fade-up">
          <h2 className="font-display uppercase leading-[0.9] tracking-tight text-[clamp(2.8rem,9vw,7rem)]">
            Da el primer paso hoy<span className="text-spa-clay">.</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-spa-cream/80 max-w-2xl mx-auto">
            Tu próxima etapa como manicurista de alto nivel empieza con una conversación.
            Sin compromiso, sin formularios — solo tú y Mariajesus.
          </p>
          <div className="mt-10 flex justify-center">
            <WhatsAppCTA messageKey="final" variant="light" size="lg">
              Escríbeme por WhatsApp
            </WhatsAppCTA>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FOOTER */
function LandingFooter() {
  return (
    <footer className="bg-spa-espresso text-spa-cream border-t border-spa-cream/10">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight">MAJÉ</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-spa-mocha/70">
            Nails Academy
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-spa-cream/60">
          <WhatsAppCTA messageKey="general" variant="light" size="sm" greenIcon>
            WhatsApp
          </WhatsAppCTA>
          <a
            href="https://www.instagram.com/majenailspa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-spa-cream transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-spa-cream/10">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-5 text-xs text-spa-mocha/70 text-center sm:text-left">
          © {new Date().getFullYear()} Majé Nails Academy · Orlando, FL. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- COMPOSICIÓN */
export default function LandingSections() {
  return (
    <>
      <Hero />
      <Mentorias />
      <Pain />
      <Transformation />
      <Founder />
      <Programs />
      <Portfolio />
      <Testimonials />
      <Faq />
      <FinalCta />
      <LandingFooter />
    </>
  );
}
