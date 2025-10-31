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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600 mt-1">Maje Nail Spa & Academy</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
              </div>
              <CalendarDaysIcon className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Días Bloqueados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{blockedDays.length}</p>
              </div>
              <ExclamationTriangleIcon className="h-12 w-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fechas Ocupadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueDates.length}</p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Bloquear Día (Vacaciones)
          </button>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Calendario Maestro</h2>
            <p className="text-sm text-gray-600 mt-1">Todas las reservas y días bloqueados</p>
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
                  <div key={date} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatDate(date)}
                          </h3>
                          {blocked && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                              Bloqueado: {blocked.reason}
                            </span>
                          )}
                        </div>

                        {/* Reservas en esta fecha */}
                        {dateBookings.length > 0 && (
                          <div className="space-y-3 ml-9">
                            {dateBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <p className="font-semibold text-gray-900">
                                      {booking.serviceName}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                      <div className="flex items-center gap-2 text-gray-700">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                        <span>{booking.buyer?.name || 'Sin nombre'}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-gray-700">
                                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                                        <span>{booking.buyer?.phone || 'Sin teléfono'}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-gray-700">
                                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                        <span className="truncate">{booking.buyer?.email || 'Sin email'}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">
                                        Pagado: <span className="font-semibold text-green-600">
                                          {formatPrice(booking.pricePaid, booking.currency)}
                                        </span>
                                      </span>
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                        {booking.status}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={actionLoading}
                                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Cancelar reserva"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {blocked && (
                        <button
                          onClick={() => handleUnblockDay(date)}
                          disabled={actionLoading}
                          className="ml-4 px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
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
