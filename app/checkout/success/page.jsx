'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon, SparklesIcon, AcademicCapIcon, HomeIcon } from '@heroicons/react/24/solid';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans bg-gradient-to-br from-green-50 via-white to-brand-pink-light/20">
      <div className="max-w-2xl w-full">
        {/* Círculo de éxito animado */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-2xl">
              <CheckCircleIcon className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3">
              <SparklesIcon className="h-4 w-4 text-white animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                ¡Pago Exitoso!
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              ¡Inscripción Confirmada!
            </h1>
          </div>

          <div className="p-8 md:p-12 space-y-6 text-center">
            <p className="text-xl md:text-2xl text-brand-text font-light leading-relaxed">
              Tu pago se ha procesado correctamente. 
              <span className="font-bold text-brand-pink"> ¡Bienvenida a Maje Academy!</span>
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-wide">
                  Próximos Pasos
                </span>
              </div>
              <ul className="text-left space-y-3 text-brand-text-light">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span className="font-medium">
                    Recibirás un correo de confirmación con todos los detalles de tu mentoría
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span className="font-medium">
                    Nuestro equipo te contactará en las próximas 24-48 horas para coordinar fechas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span className="font-medium">
                    Prepárate para transformar tu carrera y elevar tu técnica al siguiente nivel
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-sm text-brand-text-light font-medium">
                ¿Alguna pregunta? Escribinos a{' '}
                <a href="mailto:info@majeacademy.com" className="text-brand-pink font-bold hover:underline">
                  info@majeacademy.com
                </a>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-black text-white px-8 py-4 text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <HomeIcon className="h-5 w-5" />
                  Volver al Inicio
                </Link>
                
                <Link
                  href="/academia"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white text-brand-text px-8 py-4 text-base font-black transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                >
                  <AcademicCapIcon className="h-5 w-5" />
                  Ver Más Mentorías
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decoración */}
        <div className="mt-8 text-center">
          <p className="text-sm text-brand-text-light font-medium">
            Gracias por confiar en <span className="font-black text-brand-pink">Maje Academy</span> ✨
          </p>
        </div>
      </div>
    </div>
  );
}