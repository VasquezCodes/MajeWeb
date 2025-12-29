'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { SparklesIcon, UserGroupIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/solid';

// Items del carrusel
const marqueeItems = [
    { icon: SparklesIcon, text: 'Nuevas Inscripciones 2026' },
    { icon: UserGroupIcon, text: 'Clases Grupales Presenciales' },
    { icon: MapPinIcon, text: 'Orlando, FL' },
    { icon: CalendarDaysIcon, text: '¡Cupos Limitados!' },
    { icon: SparklesIcon, text: 'Formación Intensiva' },
    { icon: UserGroupIcon, text: 'Manicura Rusa • Sistema Dual • PolyGel' },
];

export default function InfiniteMarqueeBanner() {
    const containerRef = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const marquee = marqueeRef.current;
            if (!marquee) return;

            // Duplicar contenido para loop infinito
            const items = marquee.querySelectorAll('.marquee-item');
            const totalWidth = Array.from(items).reduce((acc, item) => acc + item.offsetWidth, 0);

            // Animación infinita
            gsap.to(marquee, {
                x: -totalWidth,
                duration: 25,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <Link href="/presencial" className="block">
            <div
                ref={containerRef}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-3 relative overflow-hidden hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 cursor-pointer"
            >
                {/* Decorative blur elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/30 rounded-full blur-xl" />
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                {/* Gradient fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-emerald-600 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-teal-500 to-transparent z-10 pointer-events-none" />

                {/* Marquee container */}
                <div className="relative flex overflow-hidden">
                    <div ref={marqueeRef} className="flex shrink-0">
                        {/* Original items */}
                        {marqueeItems.map((item, index) => (
                            <div
                                key={`original-${index}`}
                                className="marquee-item flex items-center gap-2 px-6 shrink-0"
                            >
                                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-100" />
                                <span className="text-sm sm:text-base font-serif font-bold text-white whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="text-emerald-200/60 mx-2">•</span>
                            </div>
                        ))}
                        {/* Duplicated items for seamless loop */}
                        {marqueeItems.map((item, index) => (
                            <div
                                key={`duplicate-${index}`}
                                className="marquee-item flex items-center gap-2 px-6 shrink-0"
                            >
                                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-100" />
                                <span className="text-sm sm:text-base font-serif font-bold text-white whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="text-emerald-200/60 mx-2">•</span>
                            </div>
                        ))}
                        {/* Third duplication for extra coverage */}
                        {marqueeItems.map((item, index) => (
                            <div
                                key={`triple-${index}`}
                                className="marquee-item flex items-center gap-2 px-6 shrink-0"
                            >
                                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-100" />
                                <span className="text-sm sm:text-base font-serif font-bold text-white whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="text-emerald-200/60 mx-2">•</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
