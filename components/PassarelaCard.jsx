'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PassarelaCard({
    title,
    subtitle,
    description,
    cta,
    ctaUrl,
    image,
    imagePosition = 'right',
    index = 0,
}) {
    const isImageRight = imagePosition === 'right';

    return (
        <section className="w-full px-4 md:px-6 lg:px-8">
            <Card className="w-full max-w-7xl mx-auto overflow-hidden rounded-3xl shadow-2xl border-brand-black/5 bg-brand-white">
                <div className={`flex flex-col lg:flex-row ${isImageRight ? '' : 'lg:flex-row-reverse'} min-h-[auto] lg:min-h-[70vh]`}>

                    {/* --- IMAGEN --- */}
                    <div className="w-full lg:w-1/2 relative h-[500px] md:h-[60vh] lg:h-auto order-1 lg:order-none p-0">
                        <div className="w-full h-full relative">
                            {ctaUrl ? (
                                <Link href={ctaUrl} className="block w-full h-full relative cursor-pointer group">
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className="object-cover object-center transition-transform duration-[1.5s] hover:scale-105"
                                        priority={index === 0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Gradiente para mobile para transición suave a blanco */}
                                    <div className="lg:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-white to-transparent pointer-events-none" />
                                </Link>
                            ) : (
                                <>
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className="object-cover object-center transition-transform duration-[1.5s] hover:scale-105"
                                        priority={index === 0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Gradiente para mobile para transición suave a blanco */}
                                    <div className="lg:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-white to-transparent" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- TEXTO --- */}
                    <div className="w-full lg:w-1/2 relative bg-brand-white flex flex-col justify-center order-2 lg:order-none">
                        <CardContent className="p-6 sm:p-8 md:p-12 lg:p-20 flex flex-col justify-center h-full">
                            <div className="space-y-6 lg:space-y-8 max-w-xl mx-auto lg:mx-0 w-full">

                                {/* Header Group */}
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-black leading-tight text-balance">
                                        {title}
                                    </h2>
                                    {subtitle && (
                                        <p className="text-xl md:text-2xl text-brand-gray-dark/60 font-serif italic mt-2">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Separador Shadcn */}
                                <Separator className="w-16 bg-brand-black/10 h-[1px]" />

                                <div className="text-brand-gray-dark/80 text-base font-light leading-relaxed space-y-4 font-sans">
                                    {Array.isArray(description) ? (
                                        description.map((p, i) => <p key={i}>{p}</p>)
                                    ) : (
                                        <p>{description}</p>
                                    )}
                                </div>

                                {/* CTA con Shadcn Button - Diseño Premium */}
                                {cta && ctaUrl && (
                                    <div className="pt-8">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="relative w-full md:w-auto h-auto py-4 px-6 md:py-5 md:px-8 border-2 border-brand-black text-brand-black bg-transparent overflow-hidden rounded-2xl group flex items-center justify-center md:justify-between gap-4 md:gap-6 hover:text-brand-white transition-colors duration-500"
                                        >
                                            <Link
                                                href={ctaUrl}
                                                target={ctaUrl.startsWith('http') ? '_blank' : undefined}
                                                rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            >
                                                {/* Fondo animado que se desliza */}
                                                <span className="absolute inset-0 bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                                                <span className="relative z-10 uppercase tracking-[0.12em] md:tracking-[0.15em] text-[11px] md:text-sm font-bold">
                                                    {cta}
                                                </span>
                                                <ArrowRightIcon className="relative z-10 w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </div>

                </div>
            </Card>
        </section>
    );
}
