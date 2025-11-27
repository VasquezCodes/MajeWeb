'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoBanner() {
    const [promo, setPromo] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculatePromo = () => {
            const now = new Date();
            const year = now.getFullYear();

            // Fechas de configuración (Ajustar según el año real)
            // Black Friday: Jueves 27 Nov - Lunes 1 Dic
            const bfStart = new Date(year, 10, 27, 0, 0, 0); // Mes 10 es Noviembre
            const bfEnd = new Date(year, 11, 1, 23, 59, 59); // Mes 11 es Diciembre

            // Para pruebas: Descomentar para simular fechas
            // const nowTest = new Date(year, 10, 28, 10, 0, 0); // Simular BF

            // USAR FECHA DE PRUEBA SI ESTÁ DESCOMENTADA, SINO USAR FECHA REAL
            const currentDate = now;

            if (currentDate >= bfStart && currentDate <= bfEnd) {
                setPromo({
                    type: 'BF',
                    title: 'BLACK FRIDAY',
                    offer: '20% OFF EN MENTORÍAS + BONUS',
                    bgColor: 'bg-black',
                    textColor: 'text-white',
                    accentColor: 'text-brand-pink',
                    endTime: bfEnd
                });
            } else {
                setPromo(null);
            }
        };

        calculatePromo();
        const timer = setInterval(calculatePromo, 60000); // Chequear cada minuto
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!promo) return;

        const updateTimer = () => {
            const now = new Date();
            const diff = promo.endTime - now;

            if (diff <= 0) {
                setTimeLeft('00h 00m');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${hours}h ${minutes}m`);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 60000);
        return () => clearInterval(timer);
    }, [promo]);

    if (!promo) return null;

    return (
        <div className={`${promo.bgColor} ${promo.textColor} px-4 py-4 md:py-5 text-center relative overflow-hidden z-50 shadow-xl border-b border-white/10`}>
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>

            <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-sm md:text-base font-bold tracking-widest font-sans">

                {/* Title */}
                <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${promo.accentColor} animate-pulse shadow-[0_0_10px_currentColor]`}></span>
                    <span className={`${promo.accentColor} font-black tracking-[0.2em]`}>{promo.title}</span>
                </div>

                <span className="hidden md:inline text-white/30">|</span>

                {/* Offer */}
                <span className="text-white font-medium tracking-wide drop-shadow-md">
                    {promo.offer}
                </span>

                <span className="hidden md:inline text-white/30">|</span>

                {/* Timer Replacement */}
                <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)] animate-pulse">
                    <span className="text-[10px] md:text-xs uppercase tracking-wider font-black text-red-600">
                        ¡POR TIEMPO LIMITADO!
                    </span>
                </div>

                {/* CTA Button */}
                <Link
                    href="/academia#mentorias"
                    onClick={(e) => {
                        if (window.location.pathname === '/academia') {
                            e.preventDefault();
                            const element = document.getElementById('mentorias');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }}
                    className="mt-2 md:mt-0 bg-white text-black px-6 py-2 rounded-full text-xs md:text-sm font-black tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                    VER OFERTAS
                </Link>
            </div>
        </div>
    );
}
