import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
    try {
        // 1. Manicura Rusa High level: 21-22 Febrero (was 18-19)
        await adminDb.collection('presencial_courses').doc('manicura-rusa-feb-18').update({
            startDate: '2026-02-21',
            dates: 'FEBRERO 21-22'
        });

        // 2. Sistema Gel dual pro: 28-29 Marzo (Same date, ensuring consistency)
        await adminDb.collection('presencial_courses').doc('sistema-dual-mar-28').update({
            startDate: '2026-03-28',
            dates: 'MARZO 28-29'
        });

        // 3. Poly gel Level up: 18-19 Abril (was 17-18)
        await adminDb.collection('presencial_courses').doc('polygel-abr-17').update({
            startDate: '2026-04-18',
            dates: 'ABRIL 18-19'
        });

        return NextResponse.json({ success: true, message: 'Dates updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
