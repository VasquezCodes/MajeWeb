'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductosPage() {
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
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 w-fit">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Con Derechos de Reventa
                </span>
              </div>

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
    </div>
  );
}
