// app/api/admin/bookings/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET: Obtener todas las reservas
export async function GET(req) {
  try {
    const bookingsSnapshot = await adminDb.collection('bookings').orderBy('bookingDate', 'asc').get();
    
    const bookings = [];
    bookingsSnapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      });
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error obteniendo bookings:', error);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

// DELETE: Cancelar una reserva
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({ error: 'ID de reserva requerido' }, { status: 400 });
    }

    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    const bookingData = bookingDoc.data();
    const bookingDate = bookingData.bookingDate;

    // Eliminar la reserva
    await bookingRef.delete();

    // Eliminar el día bloqueado en publicBookedDays
    if (bookingDate) {
      const publicDocRef = adminDb.collection('publicBookedDays').doc(bookingDate);
      await publicDocRef.delete();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reserva cancelada exitosamente' 
    });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return NextResponse.json({ error: 'Error al cancelar reserva' }, { status: 500 });
  }
}
