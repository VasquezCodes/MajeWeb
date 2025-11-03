'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import {
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, blockedRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/blocked-days'),
      ]);

      const bookingsData = await bookingsRes.json();
      const blockedData = await blockedRes.json();

      setBookings(bookingsData.bookings || []);
      setBlockedDays(blockedData.blockedDays || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('¿Estás segura de cancelar esta reserva?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Reserva cancelada exitosamente');
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cancelar reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar reserva');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockDay = async () => {
    if (!blockDate) {
      alert('Selecciona una fecha');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/blocked-days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: blockDate, reason: blockReason }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Día bloqueado exitosamente');
        setShowBlockModal(false);
        setBlockDate('');
        setBlockReason('');
        loadData();
      } else {
        alert(data.error || 'Error al bloquear día');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al bloquear día');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockDay = async (date) => {
    if (!confirm('¿Desbloquear este día?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blocked-days?date=${date}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Día desbloqueado exitosamente');
        loadData();
      } else {
        alert('Error al desbloquear día');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al desbloquear día');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (cents, currency) => {
    const value = (cents / 100).toFixed(2);
    return `$${value} ${currency?.toUpperCase() || 'USD'}`;
  };

  const getPaymentStatus = (booking) => {
    const totalPrice = booking.price || 0; // Precio total del servicio
    const paidAmount = booking.pricePaid || 0; // Monto pagado (reserva)
    const remaining = totalPrice - paidAmount; // Pendiente de pago

    return {
      total: totalPrice,
      paid: paidAmount,
      remaining: remaining,
      isPaidFull: remaining <= 0,
      isReserved: paidAmount > 0 && remaining > 0,
    };
  };

  // Agrupar reservas por fecha
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = booking.bookingDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  // Combinar con días bloqueados
  const allDates = [
    ...Object.keys(bookingsByDate),
    ...blockedDays.map(b => b.date),
  ].sort();

  const uniqueDates = [...new Set(allDates)];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                Panel de Administración
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 font-medium">
                Maje Nail Spa & Academy
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs md:text-sm font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 font-medium">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-semibold text-sm md:text-base"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-4 md:p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-bold text-blue-700 uppercase tracking-wide">Total Reservas</p>
                <p className="text-3xl md:text-4xl font-black text-blue-900 mt-1 md:mt-2">{bookings.length}</p>
              </div>
              <CalendarDaysIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-4 md:p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-bold text-orange-700 uppercase tracking-wide">Días Bloqueados</p>
                <p className="text-3xl md:text-4xl font-black text-orange-900 mt-1 md:mt-2">{blockedDays.length}</p>
              </div>
              <ExclamationTriangleIcon className="h-10 w-10 md:h-12 md:w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-4 md:p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-bold text-green-700 uppercase tracking-wide">Fechas Ocupadas</p>
                <p className="text-3xl md:text-4xl font-black text-green-900 mt-1 md:mt-2">{uniqueDates.length}</p>
              </div>
              <CheckCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => setShowBlockModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold text-sm md:text-base shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Bloquear Día (Vacaciones)
          </button>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-lg md:text-xl font-black text-gray-900">Calendario Maestro</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Todas las reservas y días bloqueados</p>
          </div>

          <div className="divide-y divide-gray-200">
            {uniqueDates.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No hay reservas ni días bloqueados
              </div>
            ) : (
              uniqueDates.map((date) => {
                const dateBookings = bookingsByDate[date] || [];
                const blocked = blockedDays.find(b => b.date === date);

                return (
                  <div key={date} className="px-4 md:px-6 py-4 md:py-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 md:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <CalendarDaysIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-500 flex-shrink-0" />
                            <h3 className="text-base md:text-lg font-black text-gray-900 capitalize">
                              {formatDate(date)}
                            </h3>
                          </div>
                          {blocked && (
                            <span className="inline-flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 bg-orange-100 text-orange-800 text-xs md:text-sm font-bold rounded-full">
                              Bloqueado: {blocked.reason}
                            </span>
                          )}
                        </div>

                        {/* Reservas en esta fecha */}
                        {dateBookings.length > 0 && (
                          <div className="space-y-3 ml-0 md:ml-9">
                            {dateBookings.map((booking) => {
                              const payment = getPaymentStatus(booking);
                              return (
                                <div
                                  key={booking.id}
                                  className="bg-white rounded-lg p-4 md:p-5 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                      {/* Servicio */}
                                      <div>
                                        <p className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                                          {booking.serviceName}
                                        </p>
                                      </div>

                                      {/* Info del cliente */}
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm md:text-base">
                                          <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500 flex-shrink-0" />
                                          <span className="font-semibold text-gray-900">{booking.buyer?.name || 'Sin nombre'}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm md:text-base">
                                          <PhoneIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500 flex-shrink-0" />
                                          <a href={`tel:${booking.buyer?.phone}`} className="text-blue-600 hover:underline">
                                            {booking.buyer?.phone || 'Sin teléfono'}
                                          </a>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm md:text-base">
                                          <EnvelopeIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500 flex-shrink-0" />
                                          <a href={`mailto:${booking.buyer?.email}`} className="text-blue-600 hover:underline truncate">
                                            {booking.buyer?.email || 'Sin email'}
                                          </a>
                                        </div>
                                      </div>

                                      {/* Información de pago */}
                                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 md:p-4 space-y-2 border border-gray-200">
                                        <div className="flex items-center justify-between text-sm md:text-base">
                                          <span className="text-gray-600 font-medium">Precio Total:</span>
                                          <span className="font-bold text-gray-900">
                                            {formatPrice(payment.total, booking.currency)}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm md:text-base">
                                          <span className="text-gray-600 font-medium">Reserva Pagada:</span>
                                          <span className="font-bold text-green-600">
                                            {formatPrice(payment.paid, booking.currency)}
                                          </span>
                                        </div>

                                        {payment.remaining > 0 && (
                                          <div className="flex items-center justify-between text-sm md:text-base pt-2 border-t border-gray-300">
                                            <span className="text-gray-700 font-semibold">Pendiente:</span>
                                            <span className="font-bold text-orange-600 text-base md:text-lg">
                                              {formatPrice(payment.remaining, booking.currency)}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Estado */}
                                      <div className="flex items-center gap-2">
                                        {payment.isPaidFull ? (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 text-xs md:text-sm font-bold rounded-full">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Pagado Completo
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs md:text-sm font-bold rounded-full">
                                            <CalendarDaysIcon className="h-4 w-4" />
                                            Reservado
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      disabled={actionLoading}
                                      className="self-start sm:self-auto p-2.5 md:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 border border-red-200"
                                      title="Cancelar reserva"
                                    >
                                      <TrashIcon className="h-5 w-5 md:h-6 md:w-6" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {blocked && (
                        <button
                          onClick={() => handleUnblockDay(date)}
                          disabled={actionLoading}
                          className="self-start sm:self-auto px-3 md:px-4 py-2 text-xs md:text-sm text-orange-700 hover:bg-orange-100 bg-orange-50 rounded-lg transition-colors disabled:opacity-50 font-bold border border-orange-200"
                        >
                          Desbloquear
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Modal para bloquear día */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Bloquear Día</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón (opcional)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ej: Vacaciones, Día personal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBlockDay}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Bloqueando...' : 'Bloquear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <DashboardContent />
    </AdminProtectedRoute>
  );
}
