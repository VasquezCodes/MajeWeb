// ============================================
// CANCEL PAGE - app/checkout/cancel/page.jsx
// ============================================
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { XCircleIcon, ArrowLeftIcon, ShoppingBagIcon, HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function CancelPage() {
  const [showContent, setShowContent] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar partículas solo en el cliente para evitar hydration error
    const newParticles = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 3,
    }));
    setParticles(newParticles);

    // Animación de aparición progresiva
    const timer1 = setTimeout(() => setShowIcon(true), 300);
    const timer2 = setTimeout(() => setShowContent(true), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute animate-float-slow opacity-20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full bg-red-400"
            />
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Círculo de cancelación con animación */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`absolute inset-0 bg-red-500/20 rounded-full blur-2xl transition-all duration-1000 ${showIcon ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
            <div className={`relative bg-gradient-to-br from-red-500 to-rose-600 rounded-full p-6 shadow-2xl transition-all duration-700 ${showIcon ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'}`}>
              <XCircleIcon className="h-16 w-16 text-white" />
            </div>
            {/* Anillo de pulso */}
            {showIcon && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50" />
            )}
          </div>
        </div>

        {/* Contenido principal con animación */}
        <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 text-center relative overflow-hidden">
              {/* Brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              
              <h1 className="relative text-4xl md:text-5xl font-black text-white leading-tight">
                Pago Cancelado
              </h1>
            </div>

            <div className="p-8 md:p-12 space-y-6 text-center">
              <p className="text-xl md:text-2xl text-brand-text font-light leading-relaxed">
                Tu compra fue cancelada.{' '}
                <span className="font-bold">No te preocupes</span>, podés intentar nuevamente cuando quieras.
              </p>

              {/* Info de ayuda */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-orange-700 mb-3">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-wide">
                    ¿Necesitás Ayuda?
                  </span>
                </div>
                
                <p className="text-base text-brand-text-light font-medium">
                  Si tuviste algún problema con el proceso de pago o tenés consultas sobre las mentorías, no dudes en contactarnos.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center text-sm pt-2">
                  <a
                    href="mailto:info@majenailspa.com"
                    className="inline-flex items-center gap-2 text-brand-pink font-black hover:underline transition-all hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@majenailspa.com
                  </a>
                  <span className="hidden sm:inline text-brand-text-light font-bold">•</span>
                  <a
                    href="https://wa.me/13213145268"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-pink font-black hover:underline transition-all hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Mensaje motivacional */}
              <div className="bg-brand-pink/5 border-2 border-brand-pink/20 rounded-2xl p-6">
                <p className="text-base text-brand-text font-medium">
                  💡 <span className="font-bold">Recordá:</span> Podés volver cuando quieras y elegir las mentorías que más te interesen. ¡Estamos aquí para ayudarte!
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link
                  href="/academia"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-black text-white px-8 py-4 text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Volver a Mentorías
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white text-brand-text px-8 py-4 text-base font-black transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30 hover:scale-105 active:scale-95"
                >
                  <HomeIcon className="h-5 w-5" />
                  Ir al Inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <div className="mt-8 text-center space-y-3 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-text/10">
            <p className="text-base text-brand-text font-bold">
              ¿Necesitás más información antes de inscribirte?
            </p>
            <Link 
              href="/academia#mentorias" 
              className="inline-flex items-center gap-2 text-brand-pink font-black hover:underline transition-all hover:scale-105"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Explorá nuestras mentorías
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}