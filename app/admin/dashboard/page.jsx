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
  DollarSign,
  Pencil
} from 'lucide-react';

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

/* ─── Design System ─────────────────────────────────────────────────── */
const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --adm-bg:        #FAF7F4;
    --adm-surface:   #FFFFFF;
    --adm-surface2:  #F5F0EC;
    --adm-border:    #EDE5DF;
    --adm-rose:      #DA8695;
    --adm-rose-dk:   #C4717F;
    --adm-sage:      #A8B5A0;
    --adm-sage-dk:   #7E9674;
    --adm-beige:     #E1AA96;
    --adm-text:      #2D2D2D;
    --adm-text-md:   #6A6A6A;
    --adm-text-sm:   #9E9E9E;
    --adm-green:     #7AAD8A;
    --adm-amber:     #D4956A;
    --adm-red:       #C4717F;
    --adm-font-disp: 'Playfair Display', serif;
    --adm-font-ui:   'DM Sans', sans-serif;
    --adm-radius:    14px;
    --adm-shadow:    0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04);
    --adm-shadow-lg: 0 4px 12px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.07);
  }

  /* Layout */
  .adm-root {
    min-height: 100vh;
    background: var(--adm-bg);
    font-family: var(--adm-font-ui);
    color: var(--adm-text);
  }

  /* ── Header ── */
  .adm-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--adm-border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .adm-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .adm-brand-title {
    font-family: var(--adm-font-disp);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1;
  }

  .adm-brand-sub {
    font-size: 0.72rem;
    color: var(--adm-sage);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
    margin-top: 2px;
  }

  .adm-header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .adm-user-email {
    font-size: 0.82rem;
    color: var(--adm-text-md);
    display: none;
  }

  @media (min-width: 640px) {
    .adm-user-email { display: block; }
  }

  .adm-logout-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    border: 1.5px solid var(--adm-border);
    background: transparent;
    color: var(--adm-text-md);
    font-size: 0.82rem;
    font-family: var(--adm-font-ui);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .adm-logout-btn:hover {
    border-color: var(--adm-rose);
    color: var(--adm-rose);
    background: rgba(218,134,149,0.05);
  }

  /* ── Main ── */
  .adm-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Stats ── */
  .adm-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .adm-stats-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .adm-stat-card {
    background: var(--adm-surface);
    border: 1px solid var(--adm-border);
    border-radius: var(--adm-radius);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--adm-shadow);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }

  .adm-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--adm-shadow-lg);
  }

  .adm-stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--adm-text-sm);
    font-weight: 500;
    margin: 0 0 0.5rem;
  }

  .adm-stat-num {
    font-family: var(--adm-font-disp);
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1;
    margin: 0 0 0.3rem;
  }

  .adm-stat-num.rose { color: var(--adm-rose); }
  .adm-stat-num.sage { color: var(--adm-sage-dk); }
  .adm-stat-num.beige { color: var(--adm-amber); }

  .adm-stat-desc {
    font-size: 0.78rem;
    color: var(--adm-text-sm);
    margin: 0;
  }

  .adm-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .adm-stat-icon.rose { background: rgba(218,134,149,0.12); color: var(--adm-rose); }
  .adm-stat-icon.sage { background: rgba(168,181,160,0.15); color: var(--adm-sage-dk); }
  .adm-stat-icon.beige { background: rgba(225,170,150,0.15); color: var(--adm-amber); }

  /* ── Actions ── */
  .adm-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .adm-actions { flex-direction: row; }
  }

  .adm-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    border: none;
    background: var(--adm-rose);
    color: #fff;
    font-family: var(--adm-font-ui);
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(218,134,149,0.28);
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    text-decoration: none;
  }

  .adm-btn-primary:hover {
    background: var(--adm-rose-dk);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(218,134,149,0.38);
  }

  .adm-btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    border: 1.5px solid var(--adm-sage);
    background: transparent;
    color: var(--adm-sage-dk);
    font-family: var(--adm-font-ui);
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .adm-btn-secondary:hover {
    background: rgba(168,181,160,0.1);
    border-color: var(--adm-sage-dk);
    transform: translateY(-1px);
  }

  /* ── Section Title ── */
  .adm-section-title {
    font-family: var(--adm-font-disp);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .adm-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--adm-border);
  }

  /* ── Date Cards ── */
  .adm-date-cards {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .adm-date-card {
    background: var(--adm-surface);
    border: 1px solid var(--adm-border);
    border-radius: var(--adm-radius);
    overflow: hidden;
    box-shadow: var(--adm-shadow);
    animation: cardIn 0.4s ease both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .adm-date-card.blocked {
    border-color: rgba(212,149,106,0.4);
  }

  .adm-date-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    background: var(--adm-surface2);
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--adm-border);
  }

  .adm-date-header.blocked {
    background: #FFF6EF;
    border-bottom-color: rgba(212,149,106,0.25);
  }

  .adm-date-title {
    font-family: var(--adm-font-disp);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--adm-text);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .adm-date-left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .adm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.28rem 0.7rem;
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .adm-badge.blocked-badge {
    background: rgba(212,149,106,0.15);
    color: var(--adm-amber);
    border: 1px solid rgba(212,149,106,0.3);
  }

  .adm-badge.full {
    background: rgba(122,173,138,0.15);
    color: var(--adm-green);
    border: 1px solid rgba(122,173,138,0.3);
  }

  .adm-badge.reserved {
    background: rgba(225,170,150,0.15);
    color: var(--adm-beige);
    border: 1px solid rgba(225,170,150,0.3);
  }

  .adm-badge.manual {
    background: rgba(168,181,160,0.12);
    color: var(--adm-sage-dk);
    border: 1px solid rgba(168,181,160,0.25);
  }

  .adm-unblock-btn {
    padding: 0.3rem 0.75rem;
    border-radius: 7px;
    border: 1px solid rgba(212,149,106,0.4);
    background: transparent;
    color: var(--adm-amber);
    font-family: var(--adm-font-ui);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .adm-unblock-btn:hover {
    background: rgba(212,149,106,0.1);
  }

  /* ── Booking Row ── */
  .adm-booking-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-bottom: 1px solid var(--adm-border);
    transition: background 0.15s ease;
  }

  .adm-booking-row:last-child {
    border-bottom: none;
  }

  .adm-booking-row:hover {
    background: rgba(250,247,244,0.6);
  }

  @media (min-width: 768px) {
    .adm-booking-row {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .adm-booking-info {
    flex: 1;
    min-width: 0;
  }

  .adm-booking-service {
    font-family: var(--adm-font-disp);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--adm-text);
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .adm-booking-meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }

  @media (min-width: 480px) {
    .adm-booking-meta { grid-template-columns: 1fr 1fr; }
  }

  .adm-meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: var(--adm-text-md);
  }

  .adm-meta-item svg {
    width: 13px;
    height: 13px;
    color: var(--adm-sage);
    flex-shrink: 0;
  }

  .adm-note-chip {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.3rem 0.7rem;
    background: #F5EDE6;
    border-radius: 7px;
    font-size: 0.78rem;
    font-style: italic;
    color: #7A6055;
    border: 1px solid rgba(225,170,150,0.25);
    max-width: 100%;
    word-break: break-word;
  }

  /* ── Payment Panel ── */
  .adm-payment-panel {
    min-width: 180px;
    background: var(--adm-surface2);
    border-radius: 10px;
    border: 1px solid var(--adm-border);
    padding: 0.875rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .adm-payment-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .adm-payment-key {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--adm-text-sm);
    font-weight: 600;
  }

  .adm-payment-val {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--adm-text);
  }

  .adm-payment-val.paid { color: var(--adm-green); }
  .adm-payment-val.pending { color: var(--adm-amber); }

  .adm-payment-divider {
    height: 1px;
    background: var(--adm-border);
    margin: 0.15rem 0;
  }

  .adm-payment-badge-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.25rem;
  }

  /* ── Action Buttons Column ── */
  .adm-row-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    border-top: 1px solid var(--adm-border);
    padding-top: 0.75rem;
    margin-top: 0;
  }

  @media (min-width: 768px) {
    .adm-row-actions {
      flex-direction: column;
      border-top: none;
      padding-top: 0;
      align-items: flex-end;
    }
  }

  .adm-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--adm-border);
    background: var(--adm-surface);
    color: var(--adm-text-md);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .adm-icon-btn:hover {
    border-color: var(--adm-rose);
    color: var(--adm-rose);
    background: rgba(218,134,149,0.06);
  }

  .adm-icon-btn.danger:hover {
    border-color: var(--adm-red);
    color: var(--adm-red);
    background: rgba(196,113,127,0.06);
  }

  /* ── Empty / Loading ── */
  .adm-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--adm-text-sm);
    border: 1.5px dashed var(--adm-border);
    border-radius: var(--adm-radius);
    background: var(--adm-surface);
    font-size: 0.9rem;
  }

  .adm-loading-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--adm-bg);
    font-family: var(--adm-font-ui);
  }

  .adm-loading-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .adm-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(218,134,149,0.2);
    border-top-color: var(--adm-rose);
    border-radius: 50%;
    animation: adminSpin 0.75s linear infinite;
  }

  @keyframes adminSpin { to { transform: rotate(360deg); } }

  .adm-loading-text {
    font-size: 0.88rem;
    color: var(--adm-text-md);
    margin: 0;
  }

  /* ── Dialog overrides for admin ── */
  .adm-dialog-section {
    background: var(--adm-surface2);
    border: 1px solid var(--adm-border);
    border-radius: 10px;
    padding: 1rem;
  }

  .adm-dialog-section-title {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--adm-sage-dk);
    margin: 0 0 0.75rem;
  }

  .adm-blocked-reason {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--adm-amber);
  }

  /* ── Filter Bar ── */
  .adm-filter-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .adm-filter-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.9rem;
    background: var(--adm-surface);
    border: 1.5px solid var(--adm-border);
    border-radius: 9px;
    font-family: var(--adm-font-ui);
    font-size: 0.85rem;
    color: var(--adm-text);
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .adm-filter-date:focus {
    outline: none;
    border-color: var(--adm-rose);
    box-shadow: 0 0 0 3px rgba(218,134,149,0.1);
  }

  .adm-filter-clear {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.8rem;
    border-radius: 9px;
    border: 1px solid var(--adm-border);
    background: transparent;
    color: var(--adm-text-sm);
    font-family: var(--adm-font-ui);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .adm-filter-clear:hover {
    border-color: var(--adm-rose);
    color: var(--adm-rose);
    background: rgba(218,134,149,0.05);
  }

  .adm-filter-result {
    font-size: 0.79rem;
    color: var(--adm-text-sm);
  }

  /* ── Group Divider ── */
  .adm-group-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .adm-group-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .adm-group-label.upcoming { color: var(--adm-rose); }
  .adm-group-label.past     { color: var(--adm-text-sm); }

  .adm-group-line {
    flex: 1;
    height: 1px;
    background: var(--adm-border);
  }

  .adm-group-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.65rem;
    border-radius: 7px;
    border: 1px solid var(--adm-border);
    background: transparent;
    color: var(--adm-text-sm);
    font-family: var(--adm-font-ui);
    font-size: 0.74rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .adm-group-toggle:hover {
    background: var(--adm-surface2);
    color: var(--adm-text);
  }

  .adm-past-section {
    opacity: 0.75;
  }

  .adm-date-card.past {
    border-style: dashed;
  }

  .adm-date-header.past {
    background: var(--adm-bg);
  }

  .adm-date-title.past {
    color: var(--adm-text-md);
  }
`;

/* ═══════════════════════════════════════════════════════════════════ */

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter & grouping state
  const [filterDate, setFilterDate] = useState('');
  const [pastCollapsed, setPastCollapsed] = useState(true);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });

  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const [manualForm, setManualForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    serviceType: 'mentoria', serviceName: 'Mentoria 1:1',
    serviceId: 'manual_service', bookingDate: '',
    paymentType: 'full', amountPaid: '', totalPrice: '', notes: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    serviceName: '', amountPaid: '', totalPrice: '', notes: ''
  });

  useEffect(() => { loadData(); }, []);

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
    try { await logout(); router.push('/admin/login'); }
    catch (error) { console.error('Logout error:', error); }
  };

  const handleOpenEdit = (booking) => {
    setEditingId(booking.id);
    const paid = (booking.pricePaid || 0) / 100;
    const total = (booking.price || 0) / 100;
    setEditForm({
      clientName: booking.buyer?.name || booking.clientName || '',
      clientEmail: booking.buyer?.email || booking.clientEmail || '',
      clientPhone: booking.buyer?.phone || booking.clientPhone || '',
      serviceName: booking.serviceName || '',
      amountPaid: paid.toFixed(2),
      totalPrice: total.toFixed(2),
      notes: booking.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!editingId) return;
    setActionLoading(true);
    try {
      const paidVal = parseFloat(editForm.amountPaid || '0');
      const totalVal = parseFloat(editForm.totalPrice || '0');
      const payload = {
        id: editingId,
        clientName: editForm.clientName,
        clientEmail: editForm.clientEmail,
        clientPhone: editForm.clientPhone,
        serviceName: editForm.serviceName,
        notes: editForm.notes,
        price: Math.round(totalVal * 100),
        pricePaid: Math.round(paidVal * 100),
      };
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowEditModal(false);
        setSuccessMessage({ title: 'Reserva Actualizada', description: 'Los datos han sido guardados correctamente.' });
        setShowSuccessModal(true);
        loadData();
      } else {
        alert('Error al actualizar');
      }
    } catch (e) {
      console.error(e); alert('Error de conexión');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('¿Estás segura de cancelar esta reserva? Esta acción es irreversible.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${bookingId}`, { method: 'DELETE' });
      if (res.ok) { loadData(); }
      else { const data = await res.json(); alert(data.error || 'Error al cancelar'); }
    } catch (error) { alert('Error de conexión'); }
    finally { setActionLoading(false); }
  };

  const handleManualBookingSubmit = async () => {
    setActionLoading(true);
    try {
      const finalServiceName = manualForm.serviceName;
      const finalDate = manualForm.bookingDate || null;
      const amountPaidCents = Math.round(parseFloat(manualForm.amountPaid) * 100);
      const totalPriceCents = Math.round(parseFloat(manualForm.totalPrice) * 100);
      const payload = {
        clientName: manualForm.clientName, clientEmail: manualForm.clientEmail,
        clientPhone: manualForm.clientPhone, serviceId: manualForm.serviceId || 'manual_id',
        serviceName: finalServiceName, bookingDate: finalDate,
        paymentType: manualForm.paymentType, amountPaid: amountPaidCents,
        totalPrice: totalPriceCents, notes: manualForm.notes,
        isPresencial: manualForm.serviceType === 'presencial'
      };
      const res = await fetch('/api/admin/manual-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowManualModal(false);
        setManualForm({
          clientName: '', clientEmail: '', clientPhone: '',
          serviceType: 'mentoria', serviceName: 'Mentoria 1:1',
          serviceId: 'manual_service', bookingDate: '', paymentType: 'full',
          amountPaid: '', totalPrice: '', notes: ''
        });
        loadData();
        setSuccessMessage({ title: '¡Reserva Creada!', description: 'Se ha registrado el pago y enviado el email de confirmación correctamente.' });
        setShowSuccessModal(true);
      } else {
        const d = await res.json(); alert(d.error || 'Falló la creación');
      }
    } catch (e) {
      console.error(e); alert('Error conectando con servidor');
    } finally {
      setActionLoading(false);
    }
  };

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
        setShowBlockModal(false); setBlockDate(''); setBlockReason(''); loadData();
      } else { alert('Error al bloquear'); }
    } finally { setActionLoading(false); }
  };

  const handleUnblockDay = async (date) => {
    if (!confirm('¿Desbloquear este día?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blocked-days?date=${date}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } finally { setActionLoading(false); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
  };

  const formatMoney = (cents) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const getPaymentStatus = (booking) => {
    const total = booking.price || 0;
    const paid = booking.pricePaid || 0;
    const remaining = total - paid;
    return {
      total, paid, remaining,
      isPaidFull: remaining <= 50,
      isReserved: paid > 0 && remaining > 50
    };
  };

  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = booking.bookingDate || 'Sin Fecha';
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  const allDates = [...new Set([...Object.keys(bookingsByDate), ...blockedDays.map(b => b.date)])].sort();

  // Today's date as YYYY-MM-DD (local)
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // Apply date filter
  const filteredDates = filterDate
    ? allDates.filter(d => d === filterDate)
    : allDates;

  // Split into upcoming (>= today or 'Sin Fecha') and past (< today)
  const upcomingDates = filteredDates.filter(d => d === 'Sin Fecha' || d >= todayStr);
  const pastDates = filteredDates.filter(d => d !== 'Sin Fecha' && d < todayStr);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{dashStyles}</style>
        <div className="adm-loading-root">
          <div className="adm-loading-inner">
            <div className="adm-spinner" />
            <p className="adm-loading-text">Cargando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  /* ── Render ── */
  return (
    <>
      <style>{dashStyles}</style>
      <div className="adm-root">

        {/* ── Header ── */}
        <header className="adm-header">
          <div className="adm-header-inner">
            <div>
              <h1 className="adm-brand-title">Admin Connect</h1>
              <p className="adm-brand-sub">Maje Nail Spa</p>
            </div>
            <div className="adm-header-right">
              <span className="adm-user-email">{user?.email}</span>
              <button className="adm-logout-btn" onClick={handleLogout}>
                <LogOut size={13} />
                Salir
              </button>
            </div>
          </div>
        </header>

        <main className="adm-main">

          {/* ── Stats ── */}
          <div className="adm-stats-grid">
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Reservas Totales</p>
                <p className="adm-stat-num rose">{bookings.length}</p>
                <p className="adm-stat-desc">Registros activos</p>
              </div>
              <div className="adm-stat-icon rose">
                <Calendar size={18} />
              </div>
            </div>
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Días Bloqueados</p>
                <p className="adm-stat-num sage">{blockedDays.length}</p>
                <p className="adm-stat-desc">No disponibles al público</p>
              </div>
              <div className="adm-stat-icon sage">
                <Ban size={18} />
              </div>
            </div>
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Fechas Ocupadas</p>
                <p className="adm-stat-num beige">{allDates.filter(d => d !== 'Sin Fecha').length}</p>
                <p className="adm-stat-desc">Días con actividad</p>
              </div>
              <div className="adm-stat-icon beige">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="adm-actions">
            <button className="adm-btn-primary" onClick={() => setShowManualModal(true)}>
              <Plus size={15} />
              Nueva Reserva Manual
            </button>
            <button className="adm-btn-secondary" onClick={() => setShowBlockModal(true)}>
              <Ban size={15} />
              Bloquear Día
            </button>
          </div>

          {/* ── Filter Bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--adm-font-ui)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--adm-text-md)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Filtrar por día:
            </span>
            <input
              type="date"
              className="adm-filter-date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="adm-filter-clear" onClick={() => setFilterDate('')}>
                <X size={12} />
                Limpiar filtro
              </button>
            )}
            {filterDate && (
              <span className="adm-filter-result">
                {filteredDates.length === 0 ? 'Sin resultados' : `${filteredDates.length} día(s)`}
              </span>
            )}
          </div>

          {/* ── Agenda Feed ── */}
          <div>
            <h2 className="adm-section-title">Agenda & Actividad</h2>

            {filteredDates.length === 0 ? (
              <div className="adm-empty">
                {filterDate ? `No hay actividad el ${filterDate}.` : 'No hay actividad registrada aún.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* ── Upcoming / Active ── */}
                {upcomingDates.length > 0 && (
                  <div>
                    {!filterDate && (
                      <div className="adm-group-header">
                        <span className="adm-group-label upcoming">Próximas</span>
                        <div className="adm-group-line" />
                      </div>
                    )}
                    <div className="adm-date-cards">
                      {upcomingDates.map(date => {
                        const dateBookings = bookingsByDate[date] || [];
                        const blocked = blockedDays.find(b => b.date === date);
                        return (
                          <div key={date} className={`adm-date-card${blocked ? ' blocked' : ''}`}>

                            {/* Date Header */}
                            <div className={`adm-date-header${blocked ? ' blocked' : ''}`}>
                              <div className="adm-date-left">
                                <h3 className="adm-date-title">{formatDate(date) || date}</h3>
                                {blocked && (
                                  <span className="adm-blocked-reason">
                                    <Ban size={12} />
                                    Bloqueado: {blocked.reason}
                                  </span>
                                )}
                              </div>
                              {blocked && (
                                <button className="adm-unblock-btn" onClick={() => handleUnblockDay(date)}>
                                  Desbloquear
                                </button>
                              )}
                            </div>

                            {/* Bookings */}
                            {dateBookings.length > 0 ? (
                              <div>
                                {dateBookings.map(booking => {
                                  const status = getPaymentStatus(booking);
                                  return (
                                    <div key={booking.id} className="adm-booking-row">

                                      {/* Info */}
                                      <div className="adm-booking-info">
                                        <p className="adm-booking-service">
                                          {booking.serviceName}
                                          {booking.source === 'manual-admin' && (
                                            <span className="adm-badge manual">Manual</span>
                                          )}
                                        </p>
                                        <div className="adm-booking-meta">
                                          <span className="adm-meta-item">
                                            <Users size={13} />
                                            {booking.buyer?.name || booking.clientName}
                                          </span>
                                          <span className="adm-meta-item">
                                            <Mail size={13} />
                                            {booking.buyer?.email || booking.clientEmail}
                                          </span>
                                          <span className="adm-meta-item">
                                            <Phone size={13} />
                                            {booking.buyer?.phone || booking.clientPhone}
                                          </span>
                                        </div>
                                        {booking.notes && (
                                          <span className="adm-note-chip">📌 {booking.notes}</span>
                                        )}
                                      </div>

                                      {/* Payment */}
                                      <div className="adm-payment-panel">
                                        <div className="adm-payment-row">
                                          <span className="adm-payment-key">Total</span>
                                          <span className="adm-payment-val">{formatMoney(status.total)}</span>
                                        </div>
                                        <div className="adm-payment-row">
                                          <span className="adm-payment-key">Pagado</span>
                                          <span className="adm-payment-val paid">{formatMoney(status.paid)}</span>
                                        </div>
                                        {status.remaining > 0 && (
                                          <>
                                            <div className="adm-payment-divider" />
                                            <div className="adm-payment-row">
                                              <span className="adm-payment-key">Pendiente</span>
                                              <span className="adm-payment-val pending">{formatMoney(status.remaining)}</span>
                                            </div>
                                          </>
                                        )}
                                        <div className="adm-payment-badge-wrap">
                                          <span className={`adm-badge ${status.isPaidFull ? 'full' : 'reserved'}`}>
                                            {status.isPaidFull ? '✓ Completado' : 'Reservado 30%'}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="adm-row-actions">
                                        <button
                                          className="adm-icon-btn"
                                          onClick={() => handleOpenEdit(booking)}
                                          title="Editar Reserva"
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          className="adm-icon-btn danger"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          title="Cancelar Reserva"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--adm-text-sm)', margin: 0 }}>
                                Sin reservas — solo día bloqueado.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Past ── */}
                {!filterDate && pastDates.length > 0 && (
                  <div className={pastCollapsed ? '' : 'adm-past-section'}>
                    <div className="adm-group-header">
                      <span className="adm-group-label past">Historial</span>
                      <div className="adm-group-line" />
                      <button
                        className="adm-group-toggle"
                        onClick={() => setPastCollapsed(c => !c)}
                      >
                        {pastCollapsed
                          ? `Ver ${pastDates.length} reservas pasadas ↓`
                          : 'Colapsar ↑'
                        }
                      </button>
                    </div>
                    {!pastCollapsed && (
                      <div className="adm-date-cards">
                        {pastDates.map(date => {
                          const dateBookings = bookingsByDate[date] || [];
                          const blocked = blockedDays.find(b => b.date === date);
                          return (
                            <div key={date} className={`adm-date-card past${blocked ? ' blocked' : ''}`}>
                              <div className={`adm-date-header past${blocked ? ' blocked' : ''}`}>
                                <div className="adm-date-left">
                                  <h3 className="adm-date-title past">{formatDate(date) || date}</h3>
                                  {blocked && (
                                    <span className="adm-blocked-reason">
                                      <Ban size={12} />
                                      Bloqueado: {blocked.reason}
                                    </span>
                                  )}
                                </div>
                                {blocked && (
                                  <button className="adm-unblock-btn" onClick={() => handleUnblockDay(date)}>
                                    Desbloquear
                                  </button>
                                )}
                              </div>
                              {dateBookings.length > 0 ? (
                                <div>
                                  {dateBookings.map(booking => {
                                    const status = getPaymentStatus(booking);
                                    return (
                                      <div key={booking.id} className="adm-booking-row">
                                        <div className="adm-booking-info">
                                          <p className="adm-booking-service">
                                            {booking.serviceName}
                                            {booking.source === 'manual-admin' && <span className="adm-badge manual">Manual</span>}
                                          </p>
                                          <div className="adm-booking-meta">
                                            <span className="adm-meta-item"><Users size={13} />{booking.buyer?.name || booking.clientName}</span>
                                            <span className="adm-meta-item"><Mail size={13} />{booking.buyer?.email || booking.clientEmail}</span>
                                            <span className="adm-meta-item"><Phone size={13} />{booking.buyer?.phone || booking.clientPhone}</span>
                                          </div>
                                          {booking.notes && <span className="adm-note-chip">📌 {booking.notes}</span>}
                                        </div>
                                        <div className="adm-payment-panel">
                                          <div className="adm-payment-row">
                                            <span className="adm-payment-key">Total</span>
                                            <span className="adm-payment-val">{formatMoney(status.total)}</span>
                                          </div>
                                          <div className="adm-payment-row">
                                            <span className="adm-payment-key">Pagado</span>
                                            <span className="adm-payment-val paid">{formatMoney(status.paid)}</span>
                                          </div>
                                          {status.remaining > 0 && (
                                            <><div className="adm-payment-divider" />
                                              <div className="adm-payment-row">
                                                <span className="adm-payment-key">Pendiente</span>
                                                <span className="adm-payment-val pending">{formatMoney(status.remaining)}</span>
                                              </div></>
                                          )}
                                          <div className="adm-payment-badge-wrap">
                                            <span className={`adm-badge ${status.isPaidFull ? 'full' : 'reserved'}`}>
                                              {status.isPaidFull ? '✓ Completado' : 'Reservado 30%'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="adm-row-actions">
                                          <button className="adm-icon-btn" onClick={() => handleOpenEdit(booking)} title="Editar">
                                            <Pencil size={14} />
                                          </button>
                                          <button className="adm-icon-btn danger" onClick={() => handleCancelBooking(booking.id)} title="Cancelar">
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--adm-text-sm)', margin: 0 }}>
                                  Sin reservas — solo día bloqueado.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* ══════════════════════════════ MODALS ══════════════════════════════ */}

        {/* Manual Booking */}
        <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-playfair" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
                Nueva Reserva Manual
              </DialogTitle>
              <DialogDescription>
                Registra un pago por Zelle / Cash. Se enviará email de confirmación.
              </DialogDescription>
            </DialogHeader>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>

              {/* Cliente */}
              <div className="adm-dialog-section">
                <p className="adm-dialog-section-title">Datos del Cliente</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                  <div style={{ gridColumn: '1' }}>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Nombre Completo</Label>
                    <Input className="mt-1" placeholder="Ej: María Pérez" value={manualForm.clientName}
                      onChange={e => setManualForm({ ...manualForm, clientName: e.target.value })} />
                  </div>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Teléfono</Label>
                    <Input className="mt-1" placeholder="+1..." value={manualForm.clientPhone}
                      onChange={e => setManualForm({ ...manualForm, clientPhone: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Email (para confirmación)</Label>
                    <Input className="mt-1" type="email" placeholder="cliente@email.com" value={manualForm.clientEmail}
                      onChange={e => setManualForm({ ...manualForm, clientEmail: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Servicio */}
              <div className="adm-dialog-section">
                <p className="adm-dialog-section-title">Servicio & Fecha</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Tipo de Servicio</Label>
                    <Select value={manualForm.serviceType} onValueChange={v => setManualForm({ ...manualForm, serviceType: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mentoria">Mentoria Online (1:1)</SelectItem>
                        <SelectItem value="presencial">Clase Presencial</SelectItem>
                        <SelectItem value="custom">Otro / Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Nombre del Servicio</Label>
                    <div className="mt-1" style={{ display: 'flex', gap: '0.5rem' }}>
                      <Input placeholder="Nombre del servicio..." value={manualForm.serviceName}
                        onChange={e => setManualForm({ ...manualForm, serviceName: e.target.value })} />
                      <Select onValueChange={(v) => {
                        setManualForm({ ...manualForm, serviceName: v, totalPrice: v.includes('Presencial') ? '800' : '200' });
                      }}>
                        <SelectTrigger style={{ width: '40px', padding: '0 8px' }}>
                          <span className="sr-only">Elegir</span>
                          <Search size={14} style={{ opacity: 0.5 }} />
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
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Fecha de Reserva <span style={{ color: 'var(--adm-text-sm)' }}>(Opcional)</span></Label>
                    <Input className="mt-1" type="date" value={manualForm.bookingDate}
                      onChange={e => setManualForm({ ...manualForm, bookingDate: e.target.value })} />
                    <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-sm)', marginTop: '0.25rem' }}>Si se deja vacío, no bloquea calendario.</p>
                  </div>
                </div>
              </div>

              {/* Pago */}
              <div className="adm-dialog-section" style={{ background: 'rgba(122,173,138,0.06)', borderColor: 'rgba(122,173,138,0.25)' }}>
                <p className="adm-dialog-section-title" style={{ color: 'var(--adm-green)' }}>Detalles del Pago</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Tipo Pago</Label>
                    <Select value={manualForm.paymentType} onValueChange={v => setManualForm({ ...manualForm, paymentType: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Pago Completo</SelectItem>
                        <SelectItem value="reservation">Reserva (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Precio Total ($)</Label>
                    <Input className="mt-1" type="number" placeholder="0.00" value={manualForm.totalPrice}
                      onChange={e => setManualForm({ ...manualForm, totalPrice: e.target.value })} />
                  </div>
                  <div>
                    <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Pagado Hoy ($)</Label>
                    <Input className="mt-1" type="number" placeholder="0.00" value={manualForm.amountPaid}
                      onChange={e => setManualForm({ ...manualForm, amountPaid: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <Label style={{ fontSize: '0.78rem', color: 'var(--adm-text-md)' }}>Notas Internas</Label>
                  <Input className="mt-1" placeholder="Ej: Pagó por Zelle ref 12345" value={manualForm.notes}
                    onChange={e => setManualForm({ ...manualForm, notes: e.target.value })} />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setShowManualModal(false)}>Cancelar</Button>
              <Button
                onClick={handleManualBookingSubmit}
                disabled={actionLoading}
                style={{ background: 'var(--adm-rose)', color: '#fff' }}
              >
                {actionLoading ? 'Procesando...' : 'Crear Reserva'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block Day */}
        <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Playfair Display, serif' }}>Bloquear Día</DialogTitle>
              <DialogDescription>Selecciona una fecha para cerrar la disponibilidad.</DialogDescription>
            </DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
              <div>
                <Label>Fecha</Label>
                <Input className="mt-1" type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} />
              </div>
              <div>
                <Label>Razón</Label>
                <Input className="mt-1" placeholder="Ej: Vacaciones" value={blockReason} onChange={e => setBlockReason(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBlockModal(false)}>Cancelar</Button>
              <Button onClick={handleBlockDay} disabled={actionLoading}
                style={{ background: 'var(--adm-sage-dk)', color: '#fff' }}>
                Bloquear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Booking */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Playfair Display, serif' }}>Editar Reserva</DialogTitle>
              <DialogDescription>Modifica los detalles del pago o del cliente.</DialogDescription>
            </DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
              <div className="adm-dialog-section" style={{ background: 'rgba(122,173,138,0.06)', borderColor: 'rgba(122,173,138,0.25)' }}>
                <p className="adm-dialog-section-title" style={{ color: 'var(--adm-green)' }}>Estado del Pago</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <Label>Total ($)</Label>
                    <Input className="mt-1" type="number" value={editForm.totalPrice}
                      onChange={e => setEditForm({ ...editForm, totalPrice: e.target.value })} />
                  </div>
                  <div>
                    <Label>Pagado ($)</Label>
                    <Input className="mt-1" type="number" value={editForm.amountPaid}
                      onChange={e => setEditForm({ ...editForm, amountPaid: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.625rem' }}>
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => setEditForm({ ...editForm, amountPaid: editForm.totalPrice })}>
                    Marcar Pagado Completo
                  </Button>
                </div>
              </div>

              <div>
                <Label>Nombre del Servicio</Label>
                <Input className="mt-1" value={editForm.serviceName}
                  onChange={e => setEditForm({ ...editForm, serviceName: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <Label>Nombre Cliente</Label>
                  <Input className="mt-1" value={editForm.clientName}
                    onChange={e => setEditForm({ ...editForm, clientName: e.target.value })} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input className="mt-1" value={editForm.clientPhone}
                    onChange={e => setEditForm({ ...editForm, clientPhone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" value={editForm.clientEmail}
                  onChange={e => setEditForm({ ...editForm, clientEmail: e.target.value })} />
              </div>
              <div>
                <Label>Notas</Label>
                <Input className="mt-1" value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancelar</Button>
              <Button onClick={handleUpdateBooking} disabled={actionLoading}
                style={{ background: 'var(--adm-rose)', color: '#fff' }}>
                {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(122,173,138,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Check size={22} style={{ color: 'var(--adm-green)' }} />
              </div>
              <DialogTitle style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
                {successMessage.title}
              </DialogTitle>
              <DialogDescription style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
                {successMessage.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ justifyContent: 'center' }}>
              <Button onClick={() => setShowSuccessModal(false)}
                style={{ minWidth: 120, background: 'var(--adm-rose)', color: '#fff' }}>
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <DashboardContent />
    </AdminProtectedRoute>
  );
}
