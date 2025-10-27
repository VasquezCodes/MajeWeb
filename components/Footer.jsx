import React from "react";
import Link from "next/link";

// Iconos de redes sociales
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16a4 4 0 100-8 4 4 0 000 8z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16V8a5 5 0 015-5h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-brand-black to-brand-gray-dark text-brand-gray-light/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <h3 className="text-3xl font-serif font-bold text-brand-white">Maje Nail Spa</h3>
            <p className="text-sm leading-relaxed text-brand-gray-light/80">
              Experiencias de manicura y pedicura curadas para realzar tu estilo con precisión artesanal y un ambiente boutique en Orlando, FL.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/majenailspa/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-white/20 text-brand-white hover:bg-brand-white hover:text-brand-black transition-all duration-300"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-white/20 text-brand-white hover:bg-brand-white hover:text-brand-black transition-all duration-300"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Navegación y Horarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm tracking-[0.35em] uppercase text-brand-gray">Navegación</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-brand-white transition-colors duration-300">Inicio</Link></li>
                <li><Link href="/servicios" className="hover:text-brand-white transition-colors duration-300">Servicios</Link></li>
                <li><Link href="/galeria" className="hover:text-brand-white transition-colors duration-300">Galería</Link></li>
                <li><Link href="/academia" className="hover:text-brand-white transition-colors duration-300">Academia</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm tracking-[0.35em] uppercase text-brand-gray">Horarios</h4>
              <ul className="text-sm space-y-1">
                <li>Lunes a Viernes — 10:00 a 19:00</li>
                <li>Sábados — 9:00 a 18:00</li>
                <li>Domingos — Cerrado</li>
              </ul>
            </div>
          </div>

          {/* Reservas y Newsletter */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm tracking-[0.35em] uppercase text-brand-gray">Reservas</h4>
              <p className="text-sm text-brand-gray-light/80">
                Agenda tu sesión completa en línea y asegura tu espacio ideal.
              </p>
              <Link
                href="/reservas"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-white text-brand-black text-sm font-semibold rounded-2xl shadow-lg hover:bg-brand-gray-light hover:shadow-xl transition-all duration-300"
              >
                Reservar ahora
              </Link>
              <p className="text-xs text-brand-gray">o escríbenos a <span className="text-brand-white">contacto@majenailspa.com</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-brand-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-brand-gray flex flex-col md:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Maje Nail Spa. Todos los derechos reservados.</span>
          <span className="text-brand-gray/70">Diseño digital inspirado en la elegancia minimalista.</span>
        </div>
      </div>
    </footer>
  );
}