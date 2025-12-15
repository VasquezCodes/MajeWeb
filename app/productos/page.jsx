'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Helper para obtener clases de color del badge
const badgeColorClasses = {
  yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  pink: 'bg-gradient-to-r from-brand-pink to-pink-600',
  blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
  black: 'bg-black'
};

// Productos por defecto
const defaultProducts = [
  {
    _id: 'ebook',
    title: 'E-book: Manicuras Millonarias',
    description: 'Descubre las estrategias probadas para convertir tu pasión por las uñas en un negocio rentable y sostenible. Este e-book incluye:',
    features: [
      'Técnicas de marketing para manicuristas',
      'Estrategias de pricing y ventas',
      'Cómo atraer y retener clientas VIP',
      'Derechos de reventa incluidos'
    ],
    badge: 'Con Derechos de Reventa',
    badgeColor: 'yellow',
    ctaText: 'Comprar Ahora',
    ctaLink: 'https://go.hotmart.com/A91933579Q',
    imageUrl: '/ebook.png'
  },
  {
    _id: 'ceo',
    title: 'Programa Online Manicurista CEO',
    description: 'Domina el negocio de las uñas y escala tu carrera al siguiente nivel. Aprende a gestionar tu tiempo, tus finanzas y a atraer clientes de alto valor.',
    features: [
      'Estrategias de negocio probadas',
      'Gestión de marca personal',
      'Marketing digital para manicuristas'
    ],
    badge: 'Workshop Online',
    badgeColor: 'pink',
    ctaText: 'Inscribirme Ahora',
    ctaLink: 'https://go.hotmart.com/G99672120D',
    imageUrl: '/hero.JPEG'
  }
];

export default function ProductosPage() {
  const [isBlackFriday, setIsBlackFriday] = useState(false);
  const [products, setProducts] = useState(defaultProducts);

  // Cargar productos de Sanity
  useEffect(() => {
    fetch('/api/sanity/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.log('Using default products'));
  }, []);

  // Check Black Friday
  useEffect(() => {
    const checkPromo = () => {
      const now = new Date();
      const year = now.getFullYear();
      const bfStart = new Date(year, 10, 28, 0, 0, 0);
      const bfEnd = new Date(year, 11, 1, 23, 59, 59);

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

      {/* Products Sections */}
      {products.map((product, index) => (
        <section key={product._id} className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 md:pb-32">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Content - Alternar orden en desktop */}
              <div className={`p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6 ${index % 2 !== 0 ? 'order-2 lg:order-1' : ''}`}>
                {isBlackFriday ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 w-fit animate-pulse">
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      🔥 50% OFF BLACK FRIDAY
                    </span>
                  </div>
                ) : (
                  <div className={`inline-flex items-center gap-2 rounded-full ${badgeColorClasses[product.badgeColor] || badgeColorClasses.yellow} px-4 py-2 w-fit`}>
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {product.badge}
                    </span>
                  </div>
                )}

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-text leading-tight">
                  {product.title}
                </h2>

                <p className="text-base md:text-lg text-brand-text-light leading-relaxed">
                  {product.description}
                </p>

                <ul className="space-y-3">
                  {product.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`text-xl ${product.badgeColor === 'pink' ? 'text-brand-pink' : 'text-blue-600'}`}>✓</span>
                      <span className="text-brand-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <a
                    href={product.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-brand-black text-white rounded-full font-black text-lg hover:bg-brand-text transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    {product.ctaText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Image - Alternar orden en desktop */}
              <div className={`relative h-96 lg:h-auto ${index % 2 !== 0 ? 'order-1 lg:order-2' : ''}`}>
                <Image
                  src={product.imageUrl || (index === 0 ? '/ebook.png' : '/hero.JPEG')}
                  alt={product.title}
                  fill
                  className="object-cover"
                  style={index === 1 ? { objectPosition: 'center 25%' } : {}}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
