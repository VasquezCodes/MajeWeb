'use client';

import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function PresencialPromoBadge() {
    return (
        <Link
            href="/presencial"
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-brand-black text-brand-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-brand-pink/30 hover:border-brand-pink"
        >
            {/* Icono con animación */}
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span>
            </span>

            {/* Texto */}
            <span className="text-xs md:text-sm font-bold tracking-wide">
                <span className="text-brand-pink">2026</span>
                <span className="mx-1.5 text-brand-gray-light/50">|</span>
                <span>Clases Presenciales</span>
                <span className="mx-1.5 text-brand-gray-light/50">|</span>
                <span className="text-brand-gray-light">Orlando, FL 🇺🇸</span>
            </span>

            {/* Arrow que aparece en hover */}
            <SparklesIcon className="h-4 w-4 text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    );
}
