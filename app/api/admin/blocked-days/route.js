// app/api/admin/blocked-days/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET: Obtener todos los días bloqueados
export async function GET(req) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }
    
    const blockedSnapshot = await adminDb.collection('blockedDays').get();
    
    const blockedDays = [];
    blockedSnapshot.forEach(doc => {
      blockedDays.push({
        id: doc.id,
        date: doc.id, // El ID del documento es la fecha
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      });
    });

    return NextResponse.json({ blockedDays });
  } catch (error) {
    console.error('Error obteniendo días bloqueados:', error);
    return NextResponse.json({ error: 'Error al obtener días bloqueados' }, { status: 500 });
  }
}

// POST: Bloquear un día (vacaciones)
export async function POST(req) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }
    
    const { date, reason } = await req.json();

    if (!date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
    }

    // Verificar si ya hay una reserva en esa fecha
    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('bookingDate', '==', date)
      .get();

    if (!bookingsSnapshot.empty) {
      return NextResponse.json({ 
        error: 'Ya existe una reserva en esta fecha. Cancélala primero.' 
      }, { status: 400 });
    }

    // Bloquear el día
    const blockedRef = adminDb.collection('blockedDays').doc(date);
    await blockedRef.set({
      reason: reason || 'Vacaciones',
      createdAt: new Date(),
      type: 'vacation',
    });

    // También agregarlo a publicBookedDays para que no se pueda reservar
    const publicRef = adminDb.collection('publicBookedDays').doc(date);
    await publicRef.set({
      blocked: true,
      reason: reason || 'Vacaciones',
      blockedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Día bloqueado exitosamente' 
    });
  } catch (error) {
    console.error('Error bloqueando día:', error);
    return NextResponse.json({ error: 'Error al bloquear día' }, { status: 500 });
  }
}

// DELETE: Desbloquear un día
export async function DELETE(req) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }
    
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
    }

    // Eliminar de blockedDays
    await adminDb.collection('blockedDays').doc(date).delete();

    // Eliminar de publicBookedDays
    await adminDb.collection('publicBookedDays').doc(date).delete();

    return NextResponse.json({ 
      success: true, 
      message: 'Día desbloqueado exitosamente' 
    });
  } catch (error) {
    console.error('Error desbloqueando día:', error);
    return NextResponse.json({ error: 'Error al desbloquear día' }, { status: 500 });
  }
}
