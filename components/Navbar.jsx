// Usamos "use client" para poder usar hooks de React como useState (para el menú móvil)
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Iconos para el menú móvil

// Componente interno que usa useSearchParams
function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/reservas" },
    { name: "Galería", href: "/galeria" },
    { name: "Mentorías VIP", href: "/academia" },
    { name: "Clases Grupales", href: "/presencial" },
    { name: "Productos Digitales", href: "/productos" },
    { name: "Contacto", href: "/contacto" },
  ];

  const isLinkActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const desktopLinkClasses = (href) =>
    `group relative text-lg font-crimson font-medium transition-all duration-300 transform hover:scale-105 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand-pink after:transition-all after:duration-300 ${isLinkActive(href)
      ? "text-brand-black after:w-full"
      : "text-brand-text-light hover:text-brand-black after:w-0 group-hover:after:w-full"
    }`;

  const mobileLinkClasses = (href) =>
    `block px-4 py-3 text-lg font-crimson font-medium rounded-xl transition-all duration-300 transform ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
    } ${isLinkActive(href)
      ? "bg-brand-gray-light text-brand-black"
      : "text-brand-text-light hover:bg-brand-gray-light hover:text-brand-black"
    }`;

  return (
    <nav className="bg-brand-white shadow-lg sticky top-0 z-50 border-b border-brand-gray-light">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <div className="flex-shrink-0 relative">
            <Link href="/" className="text-3xl font-crimson font-semibold text-brand-black hover:text-brand-gray-dark transition-colors duration-300">
              {(pathname?.startsWith('/academia') || pathname?.startsWith('/presencial')) ? 'Maje Nails Academy' : 'Maje Nails'}
            </Link>
          </div>

          {/* Links del Menú (Escritorio) - Changed md to lg to prevent overcrowding on tablets */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={desktopLinkClasses(link.href)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/reservas"
              className="px-6 py-3 bg-brand-black text-brand-white rounded-2xl shadow-lg hover:bg-brand-charcoal transition-all duration-300 hover:scale-105 font-crimson font-semibold text-lg"
            >
              Reservar Turno
            </Link>
          </div>

          {/* Botón de Menú Móvil */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-text focus:outline-none p-2 rounded-lg hover:bg-brand-gray-light/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative w-6 h-6">
                {/* Iconos con animación de transición */}
                <Bars3Icon className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                <XMarkIcon className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) - Siempre renderizado para animaciones */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-brand-white pb-6 space-y-3 px-4 border-t border-brand-gray-light transform transition-transform duration-300 delay-100">
          {links.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
              className={mobileLinkClasses(link.href)}
              style={{ transitionDelay: isOpen ? `${(index + 1) * 80}ms` : '0ms' }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservas"
            onClick={() => setIsOpen(false)}
            className={`block w-full text-center px-6 py-4 bg-brand-black text-brand-white rounded-2xl shadow-lg hover:bg-brand-charcoal transition-all duration-300 font-crimson font-semibold text-lg transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}
            style={{ transitionDelay: isOpen ? `${(links.length + 1) * 80}ms` : '0ms' }}
          >
            Reservar Turno
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Export con Suspense wrapper para useSearchParams
export default function Navbar() {
  return (
    <Suspense fallback={
      <nav className="bg-brand-white shadow-lg sticky top-0 z-50 border-b border-brand-gray-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0">
              <span className="text-3xl font-crimson font-semibold text-brand-black">Maje Nails</span>
            </div>
          </div>
        </div>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
}