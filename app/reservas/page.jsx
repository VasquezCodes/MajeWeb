'use client';

import React, { useEffect, useRef, useState } from 'react';

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
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-100" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-gray-800 shadow-sm">
            Reservar Turno
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Agenda tu cita <span className="text-gray-700">fácilmente</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Haz clic en el botón de abajo para seleccionar el servicio, el día y la hora que prefieras a través de nuestro sistema de reservas online con Booksy.
          </p>
        </div>
      </section>

      {/* === Sección 2: Botón de Booksy === */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor objetivo del widget */}
        <div
          ref={contenedorBooksyRef}
          id="contenedor-booksy"
          className="w-full flex flex-col items-center gap-4 py-12 min-h-[100px]"
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

        <p className="mt-4 text-center text-sm text-gray-600">
          Si el botón de reserva no aparece correctamente, por favor{' '}
          <a
            href="https://booksy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 underline"
          >
            visita Booksy
          </a>{' '}
          o contáctanos.
        </p>
      </section>
    </div>
  );
}
