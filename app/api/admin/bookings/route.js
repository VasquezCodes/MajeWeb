// app/api/admin/bookings/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET: Obtener todas las reservas
export async function GET(req) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

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
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

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

// PUT: Actualizar una reserva
export async function PUT(req) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

    const payload = await req.json();
    const { id, ...updateData } = payload;

    if (!id) {
      return NextResponse.json({ error: 'ID de reserva requerido' }, { status: 400 });
    }

    const bookingRef = adminDb.collection('bookings').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Prepare update object
    const dataToUpdate = {
      updatedAt: new Date(),
    };

    // Map fields securely
    if (updateData.price !== undefined) dataToUpdate.price = parseInt(updateData.price);
    if (updateData.pricePaid !== undefined) dataToUpdate.pricePaid = parseInt(updateData.pricePaid);
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;
    if (updateData.clientName !== undefined) dataToUpdate.clientName = updateData.clientName;
    if (updateData.clientEmail !== undefined) dataToUpdate.clientEmail = updateData.clientEmail;
    if (updateData.clientPhone !== undefined) dataToUpdate.clientPhone = updateData.clientPhone;
    if (updateData.serviceName !== undefined) dataToUpdate.serviceName = updateData.serviceName;

    // Handle nested buyer object for older records or structure consistency
    // If the record uses 'buyer' object, update that too if needed, but manual bookings use top-level client fields usually.
    // Let's check what checking the 'getPaymentStatus' uses: booking.buyer?.name || booking.clientName
    // So updating top level client fields is safer for Manual bookings. 
    // If it's a Stripe booking, it might rely on 'buyer'. Let's update both if 'buyer' exists.

    const currentData = bookingDoc.data();
    if (currentData.buyer) {
      dataToUpdate.buyer = {
        ...currentData.buyer,
        name: updateData.clientName || currentData.buyer.name,
        email: updateData.clientEmail || currentData.buyer.email,
        phone: updateData.clientPhone || currentData.buyer.phone,
      };
    }

    await bookingRef.update(dataToUpdate);

    return NextResponse.json({
      success: true,
      message: 'Reserva actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando reserva:', error);
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}
