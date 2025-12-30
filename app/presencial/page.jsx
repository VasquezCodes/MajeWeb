'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MorphText } from '@/components/ui/MorphText';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { CheckIcon, ArrowRightIcon, CreditCardIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function PresencialPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'presencial_courses'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by startDate
            coursesData.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
            setCourses(coursesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Open payment options modal
    const openPaymentOptions = (course) => {
        setSelectedCourse(course);
        setShowPaymentModal(true);
    };

    // Handle full payment
    const handleFullPayment = async (courseId) => {
        setProcessing(courseId);
        try {
            const response = await fetch('/api/presencial/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar pago');
            }

            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            alert(error.message);
            setProcessing(null);
        }
    };

    // Handle 30% reservation payment
    const handleReservationPayment = async (courseId) => {
        setProcessing(courseId);
        try {
            const response = await fetch('/api/presencial/checkout-reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar reserva');
            }

            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            alert(error.message);
            setProcessing(null);
        }
    };

    // Legacy handler for backwards compatibility (now opens modal)
    const handleBooking = (course) => {
        openPaymentOptions(course);
    };

    if (loading) {
        return (
            <div className="flex h-[100svh] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // fallback images mapping in case DB isn't updated instantly for the user's session
    const getImage = (course) => {
        // Enforce the new images based on ID if the DB one is old or missing
        if (course.id.includes('manicura')) return '/carruselMaje/manicuraRusa.jpg';
        if (course.id.includes('dual')) return '/carruselMaje/sistemaDual.jpg';
        if (course.id.includes('poly')) return '/carruselMaje/polyGel.jpg';
        return course.image || '/placeholder.jpg';
    };

    return (
        <div className="min-h-[100svh] bg-brand-white text-zinc-900 pb-20 font-sans">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-zinc-900 text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat opacity-5"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-6">
                    <Badge variant="outline" className="px-4 py-1 text-xs md:text-sm border-white/20 text-white/80 uppercase tracking-[0.2em] font-sans">
                        Formación Experta
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-6">
                        <AnimatedText text="Clases Grupales" className="inline-block" /> <span className="italic text-white/80">2026</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-300 font-light leading-relaxed">
                        Entrenamientos intensivos diseñados para perfeccionar tu técnica en un ambiente profesional y exclusivo.
                    </p>
                </div>
            </section>

            <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-24">
                {courses.map((course, index) => {
                    const isFull = course.enrolled >= course.capacity;
                    const spotsLeft = course.capacity - course.enrolled;
                    const isImageRight = index % 2 === 0; // Alternate layout
                    const courseImage = getImage(course);

                    return (
                        <section key={course.id} className="w-full px-4 md:px-6 lg:px-8">
                            <Card className="w-full max-w-7xl mx-auto overflow-hidden rounded-3xl shadow-xl border-zinc-100 bg-white">
                                <div className={`flex flex-col lg:flex-row ${isImageRight ? '' : 'lg:flex-row-reverse'} min-h-[auto] lg:min-h-[70vh]`}>

                                    {/* --- IMAGEN --- */}
                                    <div className="w-full lg:w-1/2 relative h-[400px] md:h-[50vh] lg:h-auto order-1 lg:order-none">
                                        <Image
                                            src={courseImage}
                                            alt={course.title}
                                            fill
                                            className="object-cover object-center transition-transform duration-[1.5s] hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                            <Badge className="bg-white/90 text-zinc-900 backdrop-blur-sm shadow-sm border border-zinc-200/50 text-xs font-bold px-3 py-1">
                                                {course.dates}
                                            </Badge>
                                            {isFull && <Badge variant="destructive">SOLD OUT</Badge>}
                                            {!isFull && spotsLeft <= 5 && <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">¡Últimos cupos!</Badge>}
                                        </div>
                                    </div>

                                    {/* --- CONTENIDO --- */}
                                    <div className="w-full lg:w-1/2 relative bg-white flex flex-col justify-center order-2 lg:order-none">
                                        <CardContent className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full space-y-8">

                                            <div className="space-y-4">
                                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 leading-tight">
                                                    {course.title}
                                                </h2>
                                                {course.subtitle && (
                                                    <p className="text-xl text-zinc-500 font-serif italic">
                                                        {course.subtitle}
                                                    </p>
                                                )}
                                            </div>

                                            <Separator className="w-20 bg-zinc-200 h-[2px]" />

                                            <div className="grid grid-cols-2 gap-6 text-sm md:text-base font-light text-zinc-600">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Inversión</span>
                                                    <span className="text-2xl font-serif text-zinc-900">${course.price / 100} USD</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Duración</span>
                                                    <span>2 Días Intensivos</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-zinc-600">
                                                    <CheckIcon className="h-5 w-5 text-zinc-900" />
                                                    <span>Capacidad exclusiva: <MorphText className="inline-block w-48 h-auto align-middle" /></span>
                                                </div>
                                                <div className="flex items-center gap-3 text-zinc-600">
                                                    <CheckIcon className="h-5 w-5 text-zinc-900" />
                                                    <span>Incluye Kit Profesional de Inicio</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-zinc-600">
                                                    <CheckIcon className="h-5 w-5 text-zinc-900" />
                                                    <span>Certificación Internacional</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Button
                                                    className="h-14 px-8 text-base font-bold uppercase tracking-widest bg-zinc-900 hover:bg-black text-white shadow-lg w-full sm:w-auto"
                                                    onClick={() => handleBooking(course)}
                                                    disabled={isFull || processing === course.id}
                                                >
                                                    {processing === course.id ? 'Procesando...' : isFull ? 'Lista de Espera' : 'Reservar Cupo'}
                                                </Button>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="h-14 px-8 text-base font-bold uppercase tracking-widest border-zinc-200 hover:bg-zinc-50 text-zinc-900 w-full sm:w-auto">
                                                            Ver Temario
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto font-sans">
                                                        <DialogHeader>
                                                            <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                                                <Badge variant="outline" className="font-mono">{course.dates}</Badge>
                                                                <span className="text-xs uppercase tracking-widest">Presencial</span>
                                                            </div>
                                                            <DialogTitle className="text-3xl font-serif font-bold italic">{course.title}</DialogTitle>
                                                        </DialogHeader>

                                                        <div className="mt-6 space-y-8">
                                                            {course.syllabus ? (
                                                                course.syllabus.map((module, idx) => (
                                                                    <div key={idx} className="space-y-3">
                                                                        <h4 className="font-serif text-lg font-bold text-zinc-900 flex items-center gap-3 border-b border-zinc-100 pb-2">
                                                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs">
                                                                                {idx + 1}
                                                                            </span>
                                                                            {module.title}
                                                                        </h4>
                                                                        <ul className="grid grid-cols-1 gap-2 pl-2">
                                                                            {module.items.map((item, i) => (
                                                                                <li key={i} className="text-zinc-600 flex items-start gap-2 text-sm">
                                                                                    <span className="text-zinc-300 mt-1">•</span>
                                                                                    {item}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-center text-zinc-500 py-8">Detalles del temario pronto.</p>
                                                            )}

                                                            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 mt-8">
                                                                <h5 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-zinc-900">
                                                                    Incluye
                                                                </h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-zinc-600 text-sm">
                                                                    {[
                                                                        "Modalidad teórico - práctica",
                                                                        "Corrección en vivo",
                                                                        "Soporte post-curso (1 mes)",
                                                                        "Guías digitales de proveedores",
                                                                        "Guía teórica completa",
                                                                        "E-book de marketing",
                                                                        "Kit de práctica profesional",
                                                                        "Certificado de participación",
                                                                        "Almuerzo incluido"
                                                                    ].map((item, i) => (
                                                                        <div key={i} className="flex items-center gap-2">
                                                                            <CheckIcon className="h-3 w-3 text-zinc-900" />
                                                                            <span>{item}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-4 z-20">
                                                            <Button
                                                                className="w-full h-12 text-base font-bold uppercase"
                                                                onClick={() => handleBooking(course)}
                                                                disabled={isFull || processing === course.id}
                                                            >
                                                                {processing === course.id ? 'Procesando...' : isFull ? 'Sold Out' : `Reservar Cupo - $${course.price / 100} USD`}
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardContent>
                                    </div>

                                </div>
                            </Card>
                        </section>
                    );
                })}
            </div>

            {/* === Imagen Final === */}
            <section className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl">
                        <Image
                            src="/carruselMaje/2312_8.jpg"
                            alt="Maje Nails Academy - Formación Profesional"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 896px"
                        />
                    </div>
                </div>
            </section>

            {/* === Modal de Opciones de Pago === */}
            <Dialog open={showPaymentModal} onOpenChange={(open) => {
                setShowPaymentModal(open);
                if (!open) {
                    setSelectedCourse(null);
                    setProcessing(null);
                }
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 rounded-3xl focus:outline-none [&>button]:hidden">
                    {selectedCourse && (() => {
                        const rawPrice = selectedCourse.price / 100;
                        const rawRes = rawPrice * 0.3;
                        const rawRem = rawPrice * 0.7;

                        const priceUSD = rawPrice % 1 === 0 ? rawPrice.toFixed(0) : rawPrice.toFixed(2);
                        const reservationUSD = rawRes % 1 === 0 ? rawRes.toFixed(0) : rawRes.toFixed(2);
                        const remainingUSD = rawRem % 1 === 0 ? rawRem.toFixed(0) : rawRem.toFixed(2);

                        return (
                            <div className="relative">
                                {/* Header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-zinc-900 text-white">
                                    <div className="flex-1 pr-4">
                                        <DialogTitle className="text-xl font-bold text-white mb-1">
                                            Elige tu forma de pago
                                        </DialogTitle>
                                        <DialogDescription className="text-sm text-zinc-300">
                                            {selectedCourse.title}
                                        </DialogDescription>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-white" />
                                    </button>
                                </div>

                                {/* Contenido */}
                                <div className="p-6 space-y-4">
                                    {/* Info del curso */}
                                    <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                                        <p className="text-sm text-zinc-500 mb-1">Fecha</p>
                                        <p className="text-lg font-bold text-zinc-900">{selectedCourse.dates?.replace('-', ' y ')}</p>
                                        <p className="text-2xl font-bold text-zinc-900 mt-2">Total: ${priceUSD} USD</p>
                                    </div>

                                    {/* Opción 1: Pago Completo */}
                                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                                <CreditCardIcon className="h-5 w-5 text-zinc-700" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-serif font-bold text-zinc-900 mb-1">
                                                    Pago Completo
                                                </h4>
                                                <p className="text-sm text-zinc-600 mb-2">
                                                    Paga el monto total ahora. <strong>Aceptamos Afterpay y Klarna.</strong>
                                                </p>
                                                <div className="text-2xl font-serif font-bold text-zinc-900">
                                                    ${priceUSD} USD
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleFullPayment(selectedCourse.id)}
                                            disabled={processing === selectedCourse.id}
                                            className="w-full h-12 bg-zinc-900 hover:bg-black text-white font-bold uppercase tracking-widest"
                                        >
                                            {processing === selectedCourse.id ? 'Procesando...' : 'Pagar Completo'}
                                        </Button>
                                    </div>

                                    {/* Opción 2: Reserva 30% */}
                                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                                <CalendarDaysIcon className="h-5 w-5 text-zinc-700" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-serif font-bold text-zinc-900 mb-1">
                                                    Reserva tu Cupo
                                                </h4>
                                                <p className="text-sm text-zinc-600 mb-2">
                                                    Asegura tu lugar con el <strong>30% del total</strong>. El saldo restante <strong>(${remainingUSD} USD)</strong> se debe abonar 3 días antes de la clase. Se te comunicará por interno.
                                                </p>
                                                <div className="text-2xl font-serif font-bold text-zinc-900">
                                                    ${reservationUSD} USD
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-1 italic">
                                                    * El saldo pendiente se abona 3 días antes
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleReservationPayment(selectedCourse.id)}
                                            disabled={processing === selectedCourse.id}
                                            className="w-full h-12 bg-zinc-900 hover:bg-black text-white font-bold uppercase tracking-widest"
                                        >
                                            {processing === selectedCourse.id ? 'Procesando...' : 'Reservar con 30%'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
