import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('presencial_courses').get();
        const courses = [];
        snapshot.forEach(doc => {
            courses.push({ id: doc.id, ...doc.data() });
        });
        return NextResponse.json({ courses });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
