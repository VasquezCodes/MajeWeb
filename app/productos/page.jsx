'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductosPage() {
  const [isBlackFriday, setIsBlackFriday] = useState(false);

  useEffect(() => {
    const checkPromo = () => {
      const now = new Date();
      const year = now.getFullYear();
      // Black Friday: Viernes 28 Nov - Lunes 1 Dic
      const bfStart = new Date(year, 10, 28, 0, 0, 0);
      const bfEnd = new Date(year, 11, 1, 23, 59, 59);

      // Para pruebas: Descomentar para simular fechas
      // const nowTest = new Date(year, 10, 28, 10, 0, 0); // Simular BF

      if (now >= bfStart && now <= bfEnd) {
        setIsBlackFriday(true);
      } else {
        setIsBlackFriday(false);
      }
    };

    checkPromo();
    const timer = setInterval(checkPromo, 60000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-blue-600 font-crimson mb-6 font-bold">
              Productos Digitales
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-text leading-tight">
              Transforma tu Negocio de Manicura
            </h1>
            <p className="text-lg md:text-xl font-crimson text-brand-text-light leading-relaxed">
              Accede a nuestros recursos digitales exclusivos diseñados para emprendedoras del mundo de las uñas
            </p>
          </div>
        </div>
      </section>

      {/* E-book Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 md:pb-32">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative h-96 lg:h-auto">
              <Image
                src="/ebook.png"
                alt="E-book Manicuras Millonarias"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6">
              {isBlackFriday ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 w-fit animate-pulse">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    🔥 50% OFF BLACK FRIDAY
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 w-fit">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Con Derechos de Reventa
                  </span>
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-text leading-tight">
                E-book: Manicuras Millonarias
              </h2>

              <p className="text-base md:text-lg text-brand-text-light leading-relaxed">
                Descubre las estrategias probadas para convertir tu pasión por las uñas en un negocio rentable y sostenible. Este e-book incluye:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">✓</span>
                  <span className="text-brand-text">Técnicas de marketing para manicuristas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">✓</span>
                  <span className="text-brand-text">Estrategias de pricing y ventas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">✓</span>
                  <span className="text-brand-text">Cómo atraer y retener clientas VIP</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">✓</span>
                  <span className="text-brand-text">Derechos de reventa incluidos</span>
                </li>
              </ul>

              <div className="pt-6">
                <a
                  href="https://hotmart.com/es/marketplace/productos/e-book-manicuras-millonarias-con-derechos-de-reventa/A91933579Q?fbclid=PAZnRzaAN0m_VleHRuA2FlbQIxMQABpykGIk5y8tRcJhw5uyLFlvi9pCJg7EXoTjZpxmn031jTREMiuuujnqZwpHLQ_aem_4PtqUabkUrg6QPypXIkvpQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-brand-black text-white rounded-full font-black text-lg hover:bg-brand-text transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                >
                  Comprar Ahora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programa CEO Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 md:pb-32">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Content (Order 2 on mobile, 1 on desktop for alternation) */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6 order-2 lg:order-1">
              {isBlackFriday ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 w-fit animate-pulse">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    🔥 50% OFF BLACK FRIDAY
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-pink to-pink-600 px-4 py-2 w-fit">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Workshop Online
                  </span>
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-text leading-tight">
                Programa Online Manicurista CEO
              </h2>

              <p className="text-base md:text-lg text-brand-text-light leading-relaxed">
                Domina el negocio de las uñas y escala tu carrera al siguiente nivel. Aprende a gestionar tu tiempo, tus finanzas y a atraer clientes de alto valor.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-brand-pink text-xl">✓</span>
                  <span className="text-brand-text">Estrategias de negocio probadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-pink text-xl">✓</span>
                  <span className="text-brand-text">Gestión de marca personal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-pink text-xl">✓</span>
                  <span className="text-brand-text">Marketing digital para manicuristas</span>
                </li>
              </ul>

              <div className="pt-6">
                <a
                  href="https://go.hotmart.com/G99672120D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-brand-black text-white rounded-full font-black text-lg hover:bg-brand-text transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                >
                  Inscribirme Ahora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Image (Order 1 on mobile, 2 on desktop) */}
            <div className="relative h-96 lg:h-auto order-1 lg:order-2">
              <Image
                src="/hero.JPEG"
                alt="Programa Manicurista CEO"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 25%' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
