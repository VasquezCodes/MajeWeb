"use client";

import { useEffect, useState } from "react";

// Header minimal de la landing: solo wordmark. Sin enlaces al lado de ventas.
// La captación se cubre con los CTAs de cada sección + el botón flotante.
export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-spa-cream/90 backdrop-blur-md border-b border-spa-espresso/10 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center justify-center">
        {/* Wordmark — color adaptativo: claro sobre el hero oscuro, espresso al hacer scroll */}
        <a href="#top" className="flex items-baseline gap-2 select-none" aria-label="Majé Nails Academy">
          <span
            className={`font-display text-2xl sm:text-3xl tracking-tight leading-none transition-colors duration-500 ${
              scrolled ? "text-spa-espresso" : "text-spa-cream"
            }`}
          >
            MAJÉ
          </span>
          <span
            className={`hidden sm:block text-[10px] font-semibold uppercase tracking-[0.35em] leading-none transition-colors duration-500 ${
              scrolled ? "text-spa-mocha/70" : "text-spa-cream/60"
            }`}
          >
            Nails Academy
          </span>
        </a>
      </div>
    </header>
  );
}
