'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import {
  Calendar,
  Users,
  Phone,
  Mail,
  Trash2,
  X,
  Plus,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  Ban,
  DollarSign
} from 'lucide-react';

// Shadcn Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Data State
  const [bookings, setBookings] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Actions State
  const [actionLoading, setActionLoading] = useState(false);

  // Modals State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Block Day Form
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  // Manual Booking Form
  const [manualForm, setManualForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: 'mentoria', // mentoria, presencial, custom
    serviceName: 'Mentoria 1:1',

    serviceId: 'manual_service',
    bookingDate: '',
    paymentType: 'full', // full, reservation
    amountPaid: '',
    totalPrice: '',
    notes: ''
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // --- Handlers: Bookings ---

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('¿Estás segura de cancelar esta reserva? Esta acción es irreversible.')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cancelar');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualBookingSubmit = async () => {
    setActionLoading(true);
    try {
      const finalServiceName = manualForm.serviceName;
      const finalDate = manualForm.bookingDate || null; // Allow no date

      // Convert to cents
      const amountPaidCents = Math.round(parseFloat(manualForm.amountPaid) * 100);
      const totalPriceCents = Math.round(parseFloat(manualForm.totalPrice) * 100);

      const payload = {
        clientName: manualForm.clientName,
        clientEmail: manualForm.clientEmail,
        clientPhone: manualForm.clientPhone,
        serviceId: manualForm.serviceId || 'manual_id',
        serviceName: finalServiceName,
        bookingDate: finalDate,
        paymentType: manualForm.paymentType,
        amountPaid: amountPaidCents,
        totalPrice: totalPriceCents,
        notes: manualForm.notes,
        isPresencial: manualForm.serviceType === 'presencial'
      };

      const res = await fetch('/api/admin/manual-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Reserva manual creada exitosamente (Email enviado).');
        setShowManualModal(false);
        setManualForm({
          clientName: '', clientEmail: '', clientPhone: '',
          serviceType: 'mentoria', serviceName: 'Mentoria 1:1',
          serviceId: 'manual_service', bookingDate: '', paymentType: 'full',
          amountPaid: '', totalPrice: '', notes: ''
        });
        loadData();
      } else {
        const d = await res.json();
        alert(d.error || 'Falló la creación');
      }
    } catch (e) {
      console.error(e);
      alert('Error conectando con servidor');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Handlers: Block Days ---

  const handleBlockDay = async () => {
    if (!blockDate) return alert('Selecciona fecha');
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/blocked-days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: blockDate, reason: blockReason }),
      });
      if (res.ok) {
        setShowBlockModal(false);
        setBlockDate('');
        setBlockReason('');
        loadData();
      } else {
        alert('Error al bloquear');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockDay = async (date) => {
    if (!confirm('¿Desbloquear este día?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blocked-days?date=${date}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } finally {
      setActionLoading(false);
    }
  };

  // --- Helpers ---
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
  };

  const formatMoney = (cents) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  const getPaymentStatus = (booking) => {
    const total = booking.price || 0;
    const paid = booking.pricePaid || 0;
    const remaining = total - paid;
    return {
      total, paid, remaining,
      isPaidFull: remaining <= 50, // tolerance for rounding
      isReserved: paid > 0 && remaining > 50
    };
  };

  // --- Processing Data ---
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = booking.bookingDate || 'Sin Fecha';
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  const allDates = [...new Set([...Object.keys(bookingsByDate), ...blockedDays.map(b => b.date)])].sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
          <p className="font-medium text-gray-500">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Connect</h1>
            <p className="text-xs text-muted-foreground">Maje Nail Spa</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Registros activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días Bloqueados</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockedDays.length}</div>
              <p className="text-xs text-muted-foreground">No disponibles al público</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fechas Ocupadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allDates.filter(d => d !== 'Sin Fecha').length}</div>
              <p className="text-xs text-muted-foreground">Días con actividad</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setShowManualModal(true)} className="bg-black hover:bg-zinc-800 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva Manual
          </Button>
          <Button variant="secondary" onClick={() => setShowBlockModal(true)}>
            <Ban className="h-4 w-4 mr-2" />
            Bloquear Día
          </Button>
        </div>

        {/* Content Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Agenda & Actividad</h2>

          {allDates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border border-dashed">
              No hay actividad registrada.
            </div>
          ) : (
            allDates.map(date => {
              const dateBookings = bookingsByDate[date] || [];
              const blocked = blockedDays.find(b => b.date === date);

              return (
                <Card key={date} className={`overflow-hidden ${blocked ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                  <div className="p-4 sm:p-6 bg-secondary/20 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={blocked ? "destructive" : "outline"} className="h-8 text-base px-3">
                        {formatDate(date)}
                      </Badge>
                      {blocked && (
                        <span className="text-sm font-medium text-orange-700 flex items-center gap-1">
                          <Ban className="h-3 w-3" />
                          Bloqueado: {blocked.reason}
                        </span>
                      )}
                    </div>
                    {blocked && (
                      <Button variant="ghost" size="sm" onClick={() => handleUnblockDay(date)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">
                        Desbloquear
                      </Button>
                    )}
                  </div>

                  <CardContent className="p-0">
                    {dateBookings.length > 0 ? (
                      <div className="divide-y">
                        {dateBookings.map(booking => {
                          const status = getPaymentStatus(booking);
                          return (
                            <div key={booking.id} className="p-4 sm:p-6 hover:bg-zinc-50 transition-colors flex flex-col md:flex-row gap-4">
                              {/* Client Info */}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                                  {booking.source === 'manual-admin' && <Badge variant="secondary">Manual</Badge>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    {booking.buyer?.name || booking.clientName}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    {booking.buyer?.email || booking.clientEmail}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    {booking.buyer?.phone || booking.clientPhone}
                                  </div>
                                </div>
                                {booking.notes && (
                                  <p className="text-xs bg-yellow-50 p-2 rounded mt-2 text-yellow-800 border border-yellow-100">
                                    Nota: {booking.notes}
                                  </p>
                                )}
                              </div>

                              {/* Payment Info */}
                              <div className="flex flex-col gap-2 min-w-[200px] bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium uppercase text-muted-foreground">Total</span>
                                  <span className="font-bold">{formatMoney(status.total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-700">
                                  <span className="text-xs font-medium uppercase">Pagado</span>
                                  <span className="font-bold flex items-center gap-1">
                                    <Check className="h-3 w-3" />
                                    {formatMoney(status.paid)}
                                  </span>
                                </div>
                                {status.remaining > 0 && (
                                  <div className="flex justify-between items-center text-orange-600 border-t pt-2 mt-1">
                                    <span className="text-xs font-bold uppercase">Pendiente</span>
                                    <span className="font-bold">{formatMoney(status.remaining)}</span>
                                  </div>
                                )}
                                <div className="mt-2 text-right">
                                  <Badge variant={status.isPaidFull ? "default" : "outline"} className={status.isPaidFull ? "bg-green-600 hover:bg-green-700" : "text-blue-600 border-blue-600"}>
                                    {status.isPaidFull ? 'COMPLETADO' : 'RESERVADO 30%'}
                                  </Badge>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex md:flex-col justify-end gap-2">
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleCancelBooking(booking.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-center text-muted-foreground">
                        Sin reservas (solo día bloqueado).
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>

      {/* Manual Booking Modal */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Reserva Manual (Zelle / Cash)</DialogTitle>
            <DialogDescription>
              Registra un pago realizado por fuera de Stripe. Se enviará email de confirmación.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Cliente */}
            <div className="grid gap-4 p-4 border rounded-lg bg-gray-50/50">
              <h3 className="font-semibold text-sm">Datos del Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nombre Completo</Label>
                  <Input placeholder="Ej: María Pérez" value={manualForm.clientName} onChange={e => setManualForm({ ...manualForm, clientName: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="+1..." value={manualForm.clientPhone} onChange={e => setManualForm({ ...manualForm, clientPhone: e.target.value })} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Email (para confirmación)</Label>
                  <Input type="email" placeholder="cliente@email.com" value={manualForm.clientEmail} onChange={e => setManualForm({ ...manualForm, clientEmail: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Servicio */}
            <div className="grid gap-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-sm">Servicio & Fecha</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo de Servicio</Label>
                  <Select value={manualForm.serviceType} onValueChange={v => setManualForm({ ...manualForm, serviceType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentoria">Mentoria Online (1:1)</SelectItem>
                      <SelectItem value="presencial">Clase Presencial</SelectItem>
                      <SelectItem value="custom">Otro / Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Nombre del Servicio</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribe el nombre del servicio..."
                      value={manualForm.serviceName}
                      onChange={e => setManualForm({ ...manualForm, serviceName: e.target.value })}
                    />
                    <Select
                      onValueChange={(v) => {
                        setManualForm({
                          ...manualForm,
                          serviceName: v,
                          totalPrice: v.includes('Presencial') ? '800' : '200'
                        });
                      }}
                    >
                      <SelectTrigger className="w-[40px] px-2">
                        <span className="sr-only">Elegir</span>
                        <Search className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="Mentoria 1:1 - Nail Business">Mentoria Business</SelectItem>
                        <SelectItem value="Mentoria 1:1 - Marketing">Mentoria Marketing</SelectItem>
                        <SelectItem value="Clase Presencial Grupal">Clase Presencial</SelectItem>
                        <SelectItem value="Taller de Diseño">Taller de Diseño</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Fecha de Reserva (Opcional)</Label>
                  <Input type="date" value={manualForm.bookingDate} onChange={e => setManualForm({ ...manualForm, bookingDate: e.target.value })} />
                  <p className="text-[10px] text-muted-foreground">Si se deja vacío, no bloquea calendario.</p>
                </div>
              </div>
            </div>

            {/* Pago */}
            <div className="grid gap-4 p-4 border rounded-lg bg-green-50/30">
              <h3 className="font-semibold text-sm">Detalles del Pago</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo Pago</Label>
                  <Select value={manualForm.paymentType} onValueChange={v => setManualForm({ ...manualForm, paymentType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Pago Completo</SelectItem>
                      <SelectItem value="reservation">Reserva (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Precio Total ($)</Label>
                  <Input type="number" placeholder="0.00" value={manualForm.totalPrice} onChange={e => setManualForm({ ...manualForm, totalPrice: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Pagado Hoy ($)</Label>
                  <Input type="number" placeholder="0.00" value={manualForm.amountPaid} onChange={e => setManualForm({ ...manualForm, amountPaid: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Notas Internas</Label>
                <Input placeholder="Ej: Pagó por Zelle ref 12345" value={manualForm.notes} onChange={e => setManualForm({ ...manualForm, notes: e.target.value })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualModal(false)}>Cancelar</Button>
            <Button onClick={handleManualBookingSubmit} disabled={actionLoading}>
              {actionLoading ? 'Procesando...' : 'Crear Reserva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Day Modal */}
      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear Día</DialogTitle>
            <DialogDescription>Selecciona una fecha para cerrar la disponibilidad.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Fecha</Label>
              <Input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Razón</Label>
              <Input placeholder="Ej: Vacaciones" value={blockReason} onChange={e => setBlockReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockModal(false)}>Cancelar</Button>
            <Button onClick={handleBlockDay} disabled={actionLoading}>Bloquear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
