import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * POST /api/booking/seed-services
 * Header: x-seed-secret: <tu_secreto>
 */
export async function POST(req) {
  const secret = req.headers.get('x-seed-secret');
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = [
    { id: 'mentoria-rusa',     title: 'Mentoría: Manicura Rusa',             priceCents: 25000, durationMin: 180, active: true },
    { id: 'mentoria-dual',     title: 'Mentoría: Sistema Dual',              priceCents: 35000, durationMin: 240, active: true },
    { id: 'mentoria-marketing',title: 'Mentoría: Marketing de Belleza',      priceCents: 20000, durationMin: 120, active: true },
    { id: 'mentoria-spa',      title: 'Mentoría: Manicura y Pedicura Spa',   priceCents: 30000, durationMin: 300, active: true },
  ];

  for (const s of services) {
    await setDoc(doc(db, 'services', s.id), s, { merge: true });
  }

  return NextResponse.json({ ok: true, count: services.length });
}
