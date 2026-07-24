"use client";

import { MARQUEE_WORDS } from "./data";

// Marquee infinito de palabras clave (CSS puro, sin JS de animación).
// Refuerza el vocabulario de la formación bajo el hero.
export default function Marquee() {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="bg-spa-espresso text-spa-cream overflow-hidden py-5 select-none">
      <div className="flex w-max animate-marquee will-change-transform">
        {items.map((word, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-display text-2xl sm:text-3xl uppercase tracking-tight px-6">
              {word}
            </span>
            <span className="text-spa-clay text-2xl">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
