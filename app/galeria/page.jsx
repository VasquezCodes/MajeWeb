'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Datos de las imágenes de la galería
const galleryImages = [
  // Manicuras (14 imágenes)
  { src: '/manicurasjpg/IMG_7119.jpg', alt: 'Manicura profesional', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_4912.jpg', alt: 'Manicura elegante', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_0183.jpg', alt: 'Manicura con diseño', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_1200.jpg', alt: 'Manicura perfecta', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_3867.jpg', alt: 'Manicura premium', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_4312.jpg', alt: 'Manicura clásica', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_5756.jpg', alt: 'Manicura francesa', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_6242.jpg', alt: 'Manicura moderna', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_6250.jpg', alt: 'Manicura natural', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_6487.jpg', alt: 'Manicura sofisticada', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_7139.jpg', alt: 'Manicura delicada', category: 'Manicura' },
  { src: '/manicurasjpg/IMG_8632.jpg', alt: 'Manicura brillante', category: 'Manicura' },
  { src: '/manicurasjpg/Usa está en el servicio de manicura .jpg', alt: 'Manicura Rusa', category: 'Manicura' },
  { src: '/manicurasjpg/Usar en servicio de extensión con Poly gel .jpg', alt: 'Extensión Polygel', category: 'Manicura' },

  // Diseños (16 imágenes)
  { src: '/diseniosjpg/IMG_0981.jpg', alt: 'Diseño artístico', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_1006.jpg', alt: 'Diseño creativo', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_1999.jpg', alt: 'Diseño único', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_2147.jpg', alt: 'Diseño elegante', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_3323.jpg', alt: 'Diseño moderno', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_4309.jpg', alt: 'Diseño personalizado', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_4324.jpg', alt: 'Diseño sofisticado', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_5246.jpg', alt: 'Diseño delicado', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_5274.jpg', alt: 'Diseño especial', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_6536.jpg', alt: 'Diseño premium', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_6907.jpg', alt: 'Diseño exclusivo', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_6913.jpg', alt: 'Diseño brillante', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_8432.jpg', alt: 'Diseño glamuroso', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_8444.jpg', alt: 'Diseño original', category: 'Diseño' },
  { src: '/diseniosjpg/IMG_8454.jpg', alt: 'Diseño perfecto', category: 'Diseño' },
  { src: '/diseniosjpg/Usar en servicio de _ extensión con builder gel .jpg', alt: 'Extensión Builder Gel', category: 'Diseño' },

  // Pedicuras (16 imágenes)
  { src: '/pedicurajpg/IMG_0479.jpg', alt: 'Pedicura spa', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_0497.jpg', alt: 'Pedicura completa', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_0941.jpg', alt: 'Pedicura caballero', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_1169.jpg', alt: 'Pedicura profesional', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_1170.jpg', alt: 'Pedicura relajante', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_1433.jpg', alt: 'Pedicura premium', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_2802.jpg', alt: 'Pedicura elegante', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_4088.jpg', alt: 'Pedicura deluxe', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_4089.jpg', alt: 'Pedicura sofisticada', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_6006.jpg', alt: 'Pedicura clásica', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_6324.jpg', alt: 'Pedicura moderna', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_7597.jpg', alt: 'Pedicura natural', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_7620.jpg', alt: 'Pedicura francesa', category: 'Pedicura' },
  { src: '/pedicurajpg/IMG_8390.jpg', alt: 'Pedicura perfecta', category: 'Pedicura' },
  { src: '/pedicurajpg/Usar para servicio _ de pedicura .jpg', alt: 'Pedicura clásica', category: 'Pedicura' },
];

// Categorías disponibles
const categories = ['Todos', 'Manicura', 'Diseño', 'Pedicura'];

export default function GaleriaPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = selectedCategory === 'Todos'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const filterButtonClasses = (category) =>
    `px-5 py-2.5 rounded-full text-sm font-crimson tracking-[0.15em] transition-all duration-300 border ${
      selectedCategory === category
        ? 'bg-brand-black text-brand-white border-brand-black shadow-md shadow-brand-black/20'
        : 'bg-white text-brand-text border-brand-gray-light hover:border-brand-black hover:bg-brand-gray-light'
    }`;

  return (
    // Reducimos el espacio inferior ya que no hay más secciones
    <div className="space-y-24 md:space-y-32 mb-24 md:mb-32">

      {/* === Sección 1: Hero de Galería === (Sin cambios) */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-light via-white to-brand-pink-light" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-gray/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-text shadow-sm">
            Nuestra Galería
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-brand-text tracking-tight">
            Inspiración y <span className="text-brand-pink">Arte</span> en Cada Detalle
          </h1>
          <p className="mt-6 text-lg md:text-xl text-brand-text-light max-w-3xl mx-auto">
            Explora nuestro portfolio de trabajos realizados con pasión y precisión. Cada imagen cuenta una historia de transformación y belleza.
          </p>
        </div>
      </section>

      {/* === Sección 2: Filtros y Galería === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={filterButtonClasses(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid responsive para 41 imágenes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => openLightbox(image)}
            >
              {/* --- CAMBIO AQUÍ --- 
                  Contenedor simplificado. Sin overlays de texto.
              */}
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === SECCIONES 3 Y 4 ELIMINADAS === */}

      {/* --- Lightbox Modal (Simplificado) --- */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in" 
            onClick={closeLightbox}
        >
          <div 
            className="relative max-w-3xl max-h-[90vh] p-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1000}
              height={1000}
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 sm:top-2 sm:right-2 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-brand-pink transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* --- CAMBIO AQUÍ --- 
                Div de texto en lightbox ELIMINADO.
            */}
          </div>
        </div>
      )}

    </div>
  );
}