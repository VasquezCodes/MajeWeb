'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Datos de las imágenes de la galería (usando tus nuevas rutas)
const galleryImages = [
  {
    src: '/serviciosImg/nails1.jpeg',
    alt: 'Manicura profesional con esmaltado perfecto',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails2.jpeg',
    alt: 'Uñas esculpidas con técnica avanzada',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails3.jpeg',
    alt: 'Pedicura spa completa y relajante',
    category: 'Pedicura'
  },
  {
    src: '/serviciosImg/nails4.jpeg',
    alt: 'Decoración artística personalizada',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails5.jpeg',
    alt: 'Sistema dual para extensiones naturales',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails6.jpeg',
    alt: 'Esmaltado espejo premium',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails7.jpeg',
    alt: 'Trabajo de cutículas profesional',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails8.jpeg',
    alt: 'Resultado final de manicura elegante',
    category: 'Manicura'
  },
  {
    src: '/serviciosImg/nails9.jpeg',
    alt: 'Pedicura con masaje terapéutico',
    category: 'Pedicura'
  },
  {
    src: '/serviciosImg/redNails.jpeg',
    alt: 'Herramientas profesionales de alta calidad',
    category: 'Manicura'
  }
];

// Categorías disponibles basadas en las imágenes de servicios
const categories = ['Todos', 'Manicura', 'Pedicura'];

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

        {/* --- CAMBIO AQUÍ --- 
            Grid de 2 columnas en móvil y 5 en desktop.
            Esto encaja perfecto con 10 imágenes (5 filas en móvil, 2 en desktop).
            No más espacios vacíos.
        */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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