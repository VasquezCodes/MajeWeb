// Usamos "use client" para poder usar hooks de React como useState (para el menú móvil)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Iconos para el menú móvil

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Tienda", href: "/tienda" },
    { name: "Galería", href: "/galeria" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <nav className="bg-brand-white shadow-lg sticky top-0 z-50 border-b border-brand-gray-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-crimson font-semibold text-brand-black hover:text-brand-gray-dark transition-colors duration-300">
              Maje Nail Spa
            </Link>
          </div>

          {/* Links del Menú (Escritorio) */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-crimson font-medium text-brand-text-light hover:text-brand-black transition-colors duration-300 hover:scale-105 transform"
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
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-text focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {isOpen && (
        <div className="md:hidden bg-brand-white pb-6 space-y-3 px-4 border-t border-brand-gray-light">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
              className="block px-4 py-3 text-lg font-crimson font-medium text-brand-text-light rounded-xl hover:bg-brand-gray-light hover:text-brand-black transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservas"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-6 py-4 bg-brand-black text-brand-white rounded-2xl shadow-lg hover:bg-brand-charcoal transition-all duration-300 font-crimson font-semibold text-lg"
          >
            Reservar Turno
          </Link>
        </div>
      )}
    </nav>
  );
}