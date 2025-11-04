'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// --- Datos de Servicios ---
const servicios = {
  manicuras: [
    {
      id: 1,
      nombre: "Manicura Rusa con Rubber Base",
      descripcion: "Ideal para uñas cortas o pequeñas que necesitan resistencia y una mejor apariencia.",
      detalles: "Incluye manicura rusa avanzada, nivelación con rubber base y esmaltado en gel color sólido. No incluye diseño.",
      imagen: "/manicurasjpg/Usa está en el servicio de manicura .jpg"
    },
    {
      id: 2,
      nombre: "Manicura Rusa con Builder Gel",
      descripcion: "Recomendada para uñas naturales cortas a medianas que requieren mayor soporte.",
      detalles: "Incluye manicura rusa, nivelación con builder gel y esmaltado en gel color sólido. No incluye diseño.",
      imagen: "/manicurasjpg/IMG_7119.jpg"
    },
    {
      id: 3,
      nombre: "Extensiones con Builder Gel",
      descripcion: "Extensión de la uña natural con molde o sistema dual. Uñas resistentes y naturales.",
      detalles: "Incluye un solo color en gel. No incluye diseño.",
      imagen: "/diseniosjpg/Usar en servicio de _ extensión con builder gel .jpg"
    },
    {
      id: 4,
      nombre: "Polygel en Uñas Naturales",
      descripcion: "Refuerzo híbrido que aporta resistencia y flexibilidad en uñas cortas o medianas.",
      detalles: "Incluye esmaltado en gel color sólido. No incluye diseño.",
      imagen: "/manicurasjpg/IMG_4912.jpg"
    },
    {
      id: 5,
      nombre: "Extensiones con Polygel",
      descripcion: "Para estructura más definida y acabados más elaborados.",
      detalles: "Incluye esmaltado en gel color sólido. No incluye diseño.",
      imagen: "/manicurasjpg/Usar en servicio de extensión con Poly gel .jpg"
    },
    {
      id: 6,
      nombre: "Manicura Caballero",
      descripcion: "Limpieza detallada de uñas, cutículas, exfoliación e hidratación.",
      detalles: "No incluye esmaltado.",
      imagen: "/manicurasjpg/manicuraCaballero.jpg"
    }
  ],
  pedicuras: [
    {
      id: 7,
      nombre: "Pedicura Clásica en Gel",
      descripcion: "Limpieza detallada con máquina, vapor y esmaltado en gel.",
      detalles: "Técnica europea moderna.",
      imagen: "/pedicurajpg/Usar para servicio _ de pedicura .jpg"
    },
    {
      id: 8,
      nombre: "Pedicura Deluxe",
      descripcion: "Servicio de higiene profunda para pies sanos que requieren mayor cuidado estético.",
      detalles: "Incluye limpieza detallada con técnica mecánica, vapor, remoción de callosidades y piel agrietada, limpieza profunda de laterales y paroniquios, corte y perfeccionamiento de cutículas, exfoliación, masaje hidratante y esmaltado en gel.",
      imagen: "/pedicurajpg/IMG_7597.jpg"
    },
    {
      id: 9,
      nombre: "Pedicura Rusa",
      descripcion: "Técnica al seco, detallada en cutículas con tijera, nivelación con rubber base si se requiere y esmaltado en gel.",
      detalles: "Ideal para uñas sanas.",
      imagen: "/pedicurajpg/IMG_0479.jpg"
    },
    {
      id: 10,
      nombre: "Quirópedia Combinada",
      descripcion: "Tratamiento no invasivo para casos leves de hongos, uñas encarnadas en fase inicial y cuidado preventivo.",
      detalles: "Incluye tratamiento tópico natural, remoción de hiperqueratosis y plan de seguimiento. *No tratamos casos clínicos. No somos podólogos.*",
      imagen: "/quieropediaJPG/Usar en servicio de Quiropedia combinada .jpg"
    },
    {
      id: 11,
      nombre: "Mantenimiento de Quirópedia",
      descripcion: "Solo para usuarios en seguimiento periódico.",
      detalles: "No aplica para nuevos clientes.",
      imagen: "/quieropediaJPG/majenailspa - 3.jpg"
    },
    {
      id: 12,
      nombre: "Pedicura Caballero",
      descripcion: "Limpieza profunda con máquina, exfoliación e hidratación.",
      detalles: "No incluye esmaltado.",
      imagen: "/pedicurajpg/IMG_0941.jpg"
    }
  ]
};

/**
 * ServiciosBookingPage (JS puro)
 * - Mantiene el widget de Booksy vivo entre navegaciones (Next.js App Router) usando un "parking lot" oculto.
 * - En cada montaje:
 *    1) Si ya hay un widget existente (en el documento o en el parking), lo mueve a nuestro contenedor.
 *    2) Si no existe, inyecta el script dentro del contenedor y espera a que aparezca.
 * - En desmontaje: mueve el widget al parking para reutilizarlo luego.
 */
export default function ServiciosBookingPage() {
  const URL_SCRIPT_BOOKSY =
    'https://booksy.com/widget/code.js?id=482147&country=us&lang=en';

  const contenedorBooksyRef = useRef(null);
  const [widgetListo, setWidgetListo] = useState(false);
  const [errorWidget, setErrorWidget] = useState(null);

  // Cambia a true si quieres ocultar el botón nativo y usar un botón propio con el mismo comportamiento
  const usarBotonPropio = false;

  // Crea/obtiene el contenedor oculto donde "estacionamos" el widget entre rutas
  const getParking = () => {
    let park = document.getElementById('booksy-widget-parking');
    if (!park) {
      park = document.createElement('div');
      park.id = 'booksy-widget-parking';
      park.style.display = 'none';
      document.body.appendChild(park);
    }
    return park;
  };

  useEffect(() => {
    const contenedor = contenedorBooksyRef.current;
    if (!contenedor) return;

    const parking = getParking();

    const moveWidgetInto = (target) => {
      const w =
        document.querySelector('.booksy-widget-container') ||
        parking.querySelector('.booksy-widget-container') ||
        target.querySelector('.booksy-widget-container');
      if (w && target && w.parentNode !== target) {
        target.appendChild(w);
      }
      if (w) {
        setWidgetListo(true);
        if (usarBotonPropio) w.style.display = 'none';
      }
      return w;
    };

    // 1) Si ya existe el widget en cualquier parte, tráelo
    let existing = moveWidgetInto(contenedor);
    if (existing) {
      // Listo, no inyectamos nada.
    } else {
      // 2) No existe: inyectamos el script dentro del contenedor
      try {
        // Evita duplicar <script> en el DOM global
        let script = contenedor.querySelector('script[data-booksy-script="1"]');
        if (!script) {
          script = document.createElement('script');
          script.src = URL_SCRIPT_BOOKSY;
          script.async = true;
          script.setAttribute('data-booksy-script', '1');
          contenedor.appendChild(script);
        }

        // Observa el contenedor hasta que aparezca el widget
        const obs = new MutationObserver(() => {
          const w = contenedor.querySelector('.booksy-widget-container');
          if (w) {
            setWidgetListo(true);
            if (usarBotonPropio) w.style.display = 'none';
            obs.disconnect();
          }
        });
        obs.observe(contenedor, { childList: true, subtree: true });

        // Cleanup de este observer si la página se desmonta antes
        const stopObs = () => obs.disconnect();
        window.addEventListener('beforeunload', stopObs);
        return () => {
          window.removeEventListener('beforeunload', stopObs);
          obs.disconnect();
          // En desmontaje: estacionamos el widget (si ya existe) para reusarlo luego
          const w = contenedor.querySelector('.booksy-widget-container');
          if (w) parking.appendChild(w);
        };
      } catch (err) {
        console.error('Error inyectando Booksy:', err);
        setErrorWidget('No se pudo cargar el widget de reservas.');
      }
    }

    // Si llegamos aquí con existing, definimos cleanup que lo estaciona
    return () => {
      const w = contenedor.querySelector('.booksy-widget-container');
      if (w) parking.appendChild(w);
    };
  }, [/* no dependencias: correr solo en mount/unmount */]);

  // Dispara el click del botón de Booksy (cuando está oculto)
  const abrirBooksy = () => {
    const contenedor = contenedorBooksyRef.current;
    const botonNativo = contenedor?.querySelector(
      '.booksy-widget-container .booksy-widget-button'
    );

    if (botonNativo && typeof botonNativo.click === 'function') {
      botonNativo.click();
    } else {
      window.open('https://booksy.com/', '_blank');
    }
  };

  return (
    <div className="space-y-24 md:space-y-32 mb-24 md:mb-32">
      {/* === Sección 1: Hero de Reservas === */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-100" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 md:px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-gray-800 shadow-sm font-crimson">
            Servicios Profesionales
          </span>
          <h1 className="mt-4 md:mt-6 text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-text tracking-tight leading-tight">
            Maje Nail Spa
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl font-crimson text-brand-text-light max-w-3xl mx-auto leading-relaxed">
            Descubre todos nuestros servicios profesionales de manicura y pedicura. Agenda tu cita fácilmente.
          </p>

          {/* Botón para ir a reservar */}
          <div className="mt-8 md:mt-10">
            <button
              onClick={() => {
                const elemento = document.getElementById('contenedor-booksy');
                if (elemento) {
                  elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-brand-black text-white rounded-full font-black text-base md:text-lg hover:bg-brand-text transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            >
              Reservar Ahora
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* === Sección 2: Servicios de Manicura === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-text mb-3">
            Manicuras
          </h2>
          <div className="w-20 h-1 bg-brand-pink mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicios.manicuras.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-80 md:h-96 lg:h-[28rem]">
                <Image
                  src={servicio.imagen}
                  alt={servicio.nombre}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-pink text-white font-black text-sm md:text-base">
                    {servicio.id}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-serif font-bold text-brand-text leading-tight">
                  {servicio.nombre}
                </h3>
                <p className="text-sm md:text-base text-brand-text-light font-crimson leading-relaxed">
                  {servicio.descripcion}
                </p>
                <p className="text-xs md:text-sm text-gray-500 italic">
                  {servicio.detalles}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Sección 3: Servicios de Pedicura === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-text mb-3">
            Pedicuras
          </h2>
          <div className="w-20 h-1 bg-brand-pink mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicios.pedicuras.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-80 md:h-96 lg:h-[28rem]">
                <Image
                  src={servicio.imagen}
                  alt={servicio.nombre}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-pink text-white font-black text-sm md:text-base">
                    {servicio.id}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 space-y-3">
                <h3 className="text-lg md:text-xl font-serif font-bold text-brand-text leading-tight">
                  {servicio.nombre}
                </h3>
                <p className="text-sm md:text-base text-brand-text-light font-crimson leading-relaxed">
                  {servicio.descripcion}
                </p>
                <p className="text-xs md:text-sm text-gray-500 italic">
                  {servicio.detalles}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Notas importantes */}
        <div className="mt-10 md:mt-14 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl md:rounded-3xl p-6 md:p-8">
          <h3 className="text-lg md:text-xl font-serif font-bold text-brand-text mb-4">
            Notas Importantes
          </h3>
          <ul className="space-y-2 text-sm md:text-base text-brand-text-light font-crimson">
            <li className="flex items-start gap-2">
              <span className="text-brand-pink mt-1">•</span>
              <span>Los diseños no están incluidos en ningún servicio.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-pink mt-1">•</span>
              <span>Se pueden agregar según complejidad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-pink mt-1">•</span>
              <span>Todos los servicios incluyen exfoliación e hidratación.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* === Sección 4: Botón de Booksy === */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-br from-brand-pink/10 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-text mb-3">
              ¿Lista para Reservar tu Cita?
            </h2>
            <p className="text-base md:text-lg font-crimson text-brand-text-light max-w-2xl mx-auto">
              Haz clic en el botón de abajo para seleccionar tu servicio, día y hora preferida.
            </p>
          </div>

          {/* Contenedor objetivo del widget */}
          <div
            ref={contenedorBooksyRef}
            id="contenedor-booksy"
            className="w-full flex flex-col items-center gap-4 py-6 min-h-[100px]"
          >
          {!widgetListo && !errorWidget && (
            <p className="p-4 text-center text-gray-500">Cargando botón de reserva...</p>
          )}
          {errorWidget && (
            <p className="p-4 text-center text-red-600">
              {errorWidget} —{' '}
              <a
                href="https://booksy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                abrir Booksy
              </a>
            </p>
          )}
        </div>

        {/* Botón propio opcional (proxy) */}
        {false && (
          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={abrirBooksy}
              className="px-6 py-3 rounded-xl shadow-sm border border-transparent hover:shadow-md transition text-white bg-pink-600 hover:bg-pink-700 font-semibold"
            >
              Reservar ahora
            </button>
          </div>
        )}

          <p className="mt-6 text-center text-sm md:text-base text-brand-text-light font-crimson">
            Si el botón de reserva no aparece correctamente, por favor{' '}
            <a
              href="https://booksy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-text underline font-bold"
            >
              visita Booksy
            </a>{' '}
            o contáctanos.
          </p>
        </div>
      </section>
    </div>
  );
}
