import React from "react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-brand-black to-brand-gray-dark text-brand-gray-light/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-serif font-bold text-brand-white">Horarios de Atención</h3>
          <p className="text-sm text-brand-gray/70 uppercase tracking-[0.35em]">Agenda tu momento Maje</p>
          <div className="mx-auto max-w-md rounded-3xl border border-brand-white/10 bg-white/5 px-8 py-10 shadow-xl backdrop-blur">
            <ul className="space-y-3 text-base">
              <li className="flex items-center justify-between text-brand-gray-light">
                <span className="font-semibold text-brand-white">Lunes a Viernes</span>
                <span>10:00 — 19:00</span>
              </li>
              <li className="flex items-center justify-between text-brand-gray-light">
                <span className="font-semibold text-brand-white">Sábados</span>
                <span>09:00 — 18:00</span>
              </li>
              <li className="flex items-center justify-between text-brand-gray-light">
                <span className="font-semibold text-brand-white">Domingos</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-brand-gray/70">
          &copy; {new Date().getFullYear()} Maje Nail Spa · Orlando, FL. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}