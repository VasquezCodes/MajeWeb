'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, SparklesIcon, AcademicCapIcon, HomeIcon, CreditCardIcon, CalendarDaysIcon, UserIcon } from '@heroicons/react/24/solid';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Try checkout endpoint first (for mentorías VIP)
      fetch(`/api/checkout?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Session data from checkout:', data);
          setSessionData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error obteniendo datos de sesión:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const isReservation = sessionData?.payment_type === 'reservation';
  const isPresencialClass = sessionData?.type === 'presencial_class';
  const cartSummary = sessionData?.cart_summary || [];
  const bookingDates = sessionData?.booking_dates || {};

  // Datos específicos para clases presenciales
  const customerName = sessionData?.customer_name || '';
  const courseTitle = sessionData?.course_title || '';
  const courseDate = sessionData?.date_text || sessionData?.booking_date || '';
  const fullPrice = sessionData?.full_price || 0;
  const reservationAmount = sessionData?.reservation_amount || 0;
  const remainingBalance = sessionData?.remaining_balance || 0;

  // Función para formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const f = new Date(y, m - 1, d);
      return f.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

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
              {isReservation ? '¡Reserva Confirmada!' : '¡Inscripción Confirmada!'}
            </h1>
          </div>

          <div className="p-8 md:p-12 space-y-6 text-center">
            <p className="text-xl md:text-2xl text-brand-text font-light leading-relaxed">
              {isReservation ? (
                <>
                  Tu reserva se ha procesado correctamente.
                  <span className="font-bold text-brand-pink"> ¡Tu cupo está asegurado!</span>
                </>
              ) : (
                <>
                  Tu pago se ha procesado correctamente.
                  <span className="font-bold text-brand-pink"> ¡Bienvenida a Maje Academy!</span>
                </>
              )}
            </p>

            {/* Detalles del participante y curso (para clases presenciales) */}
            {!loading && sessionData && (isPresencialClass || courseTitle) && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-purple-700 mb-3">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-wide">
                    Detalles de tu Inscripción
                  </span>
                </div>

                {customerName && (
                  <div className="bg-white rounded-xl p-4 border border-purple-100">
                    <p className="text-sm text-brand-text-light uppercase tracking-wide font-bold mb-1">Participante</p>
                    <p className="text-xl font-black text-brand-text">{customerName}</p>
                  </div>
                )}

                {courseTitle && (
                  <div className="bg-white rounded-xl p-4 border border-purple-100">
                    <p className="text-sm text-brand-text-light uppercase tracking-wide font-bold mb-1">Curso</p>
                    <p className="text-lg font-bold text-brand-text">{courseTitle}</p>
                  </div>
                )}

                {courseDate && (
                  <div className="bg-white rounded-xl p-4 border border-purple-100 flex items-center justify-center gap-3">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-brand-text-light uppercase tracking-wide font-bold">Fecha</p>
                      <p className="text-lg font-bold text-brand-text">{courseDate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información del tipo de pago */}
            {!loading && sessionData && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-700 mb-3">
                  <CreditCardIcon className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-wide">
                    {isReservation ? 'Pago de Reserva (30%)' : 'Pago Completo'}
                  </span>
                </div>

                {isReservation ? (
                  <div className="space-y-3">
                    {/* Monto pagado */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-700 font-bold uppercase tracking-wide mb-1">✓ Pagado Hoy</p>
                      <p className="text-2xl font-black text-green-600">
                        ${reservationAmount || (isPresencialClass ? reservationAmount : cartSummary.reduce((sum, item) => sum + 250 * (item.qty || 1), 0)).toFixed(2)} USD
                      </p>
                    </div>

                    {/* Saldo pendiente */}
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                      <p className="text-sm text-brand-text font-bold flex items-start gap-2">
                        <span className="text-xl">💰</span>
                        <span>
                          <strong>Saldo pendiente:</strong> ${remainingBalance || (isPresencialClass ? remainingBalance : cartSummary.reduce((sum, item) => sum + (item.remaining_balance || 0) * (item.qty || 1), 0)).toFixed(2)} USD
                          <br />
                          <span className="text-xs text-brand-text-light mt-1 block">
                            Este monto se paga el día de la clase presencialmente.
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-700 font-bold uppercase tracking-wide mb-1">✓ Pago Total Completado</p>
                    <p className="text-2xl font-black text-green-600">
                      ${fullPrice || (isPresencialClass ? fullPrice : cartSummary.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)).toFixed(2)} USD
                    </p>
                    <p className="text-sm text-green-600 mt-1 font-medium">¡Todo listo para tu capacitación!</p>
                  </div>
                )}
              </div>
            )}

            {/* Próximos pasos */}
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
                    Recibirás un correo de confirmación con todos los detalles de tu {isPresencialClass ? 'clase' : 'mentoría'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span className="font-medium">
                    {isReservation
                      ? 'Nuestro equipo te contactará en las próximas 24-48 horas para confirmar los detalles y recordarte el saldo pendiente'
                      : 'Nuestro equipo te contactará en las próximas 24-48 horas para confirmar todos los detalles'}
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
                <a href="mailto:info@majenailspa.com" className="text-brand-pink font-bold hover:underline">
                  info@majenailspa.com
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
                  href={isPresencialClass ? "/presencial" : "/academia"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-text/20 bg-white text-brand-text px-8 py-4 text-base font-black transition-all duration-300 hover:border-brand-text/40 hover:bg-brand-gray-light/30"
                >
                  <AcademicCapIcon className="h-5 w-5" />
                  {isPresencialClass ? 'Ver Más Clases' : 'Ver Más Mentorías'}
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}