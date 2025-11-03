'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';
import ScrollReveal from '../components/ScrollReveal';

// --- Datos de Ejemplo ---
const featuredServices = [
  {
    name: "Mentorías VIP",
    shortLabel: "Academia",
    description: "Aprende técnicas profesionales de manicura y pedicura con nuestras mentorías exclusivas.",
    imageUrl: "/portadaMentoria.jpeg",
    link: "/academia",
  },
  {
    name: "Información sobre Nuestros Servicios",
    shortLabel: "Servicios",
    description: "Conoce todos los servicios de spa y belleza que ofrecemos para ti.",
    imageUrl: "/portadaParaServicios.jpg",
    link: "/reservas",
  },
  {
    name: "Productos Digitales",
    shortLabel: "E-books",
    description: "Descubre nuestros productos digitales exclusivos para emprendedoras.",
    imageUrl: "/portadaParaProductosDigitales.PNG",
    link: "/productos",
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
                Hola, soy Mariajesus,
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
                  href="/reservas"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-brand-white/70 text-brand-white text-sm md:text-base lg:text-lg font-crimson tracking-[0.2em] rounded-2xl hover:bg-brand-white/15 hover:border-brand-white transition-all duration-300"
                >
                  Servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Sección 2: Todo lo que puedes encontrar === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <ScrollReveal animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="text-xs md:text-sm font-bold text-brand-gray-dark uppercase tracking-[0.3em] md:tracking-widest font-crimson">
            Explora
          </h2>
          <p className="mt-4 text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-text leading-tight">
            Todo lo que puedes encontrar en esta web
          </p>
        </ScrollReveal>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featuredServices.map((service, index) => (
            <Link
              key={service.name}
              href={service.link}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="relative group rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-72 md:h-80 lg:h-96">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={service.imageUrl === '/portadaParaServicios.jpg' ? { objectPosition: 'center 35%' } : {}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/50 to-transparent" />
                <div className="absolute inset-0 p-5 md:p-6 lg:p-8 flex flex-col justify-end space-y-2 md:space-y-3 text-brand-white">
                  <span className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-brand-gray-light/90 font-crimson font-bold">
                    {service.shortLabel}
                  </span>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-brand-gray-light/95 font-sans leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* === Sección 3: Mi Historia / About Me === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Imagen */}
          <ScrollReveal animation="fade-right" className="order-2 lg:order-1">
            <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/historia.png"
                alt="María Jesús Matos"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          {/* Contenido */}
          <ScrollReveal animation="fade-left" className="order-1 lg:order-2 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <p className="text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase text-blue-600 font-crimson font-bold">
                Mi Historia
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-text leading-tight">
                De Sueños a Realidad
              </h2>
            </div>

            <div className="space-y-5 text-brand-text-light leading-relaxed text-base md:text-lg font-crimson">
              <p>
                Soy venezolana, y hace 8 años emigré a los Estados Unidos con tan solo 19 años, llevando en la maleta mis sueños... y una pasión que me acompañaba desde niña: el mundo de las uñas.
              </p>
              <p>
                Hoy tengo más de 10 años de experiencia en esta industria, pero no siempre fue fácil. Al inicio, mis conocimientos eran empíricos. Sabía que amaba este arte, pero entendí que el talento por sí solo no era suficiente para escalar un negocio rentable ni atraer clientas de alto valor.
              </p>
              <p>
                Con los años, descubrí que este mundo va mucho más allá de una buena técnica: es un negocio poderoso que necesita estructura, estrategia y educación.
              </p>
              <p>
                Por eso, comencé a formarme. Estudié con grandes academias e instructores, tanto presenciales como online. Me capacité en técnicas avanzadas, finanzas, redes sociales y marketing especializado para manicuristas.
              </p>
              <p>
                Hoy soy <span className="font-bold text-brand-text">Master Instructor en uñas y marketing para manicuristas</span>, y mi misión es compartir este camino con más mujeres soñadoras, que como yo, quieren vivir de su talento y construir una marca profesional y rentable.
              </p>
              <p className="text-brand-text font-bold italic">
                Porque el arte transforma... pero la educación y la visión hacen que ese arte se convierta en libertad.
              </p>
            </div>
          </ScrollReveal>
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