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
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover object-top transition-transform duration-[1.5s] hover:scale-105"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Gradiente para mobile para transición suave a blanco */}
                            <div className="lg:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-white to-transparent" />
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

                                {/* CTA con Shadcn Button */}
                                {cta && ctaUrl && (
                                    <div className="pt-6">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full md:w-auto h-auto py-4 px-6 border-brand-black/10 text-brand-black hover:bg-brand-black hover:text-brand-white transition-all duration-300 rounded-xl group justify-between gap-6"
                                        >
                                            <Link
                                                href={ctaUrl}
                                                target={ctaUrl.startsWith('http') ? '_blank' : undefined}
                                                rel={ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            >
                                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold truncate">
                                                    {cta}
                                                </span>
                                                <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
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
