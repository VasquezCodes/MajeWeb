
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function PresencialPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        // Subscription to real-time updates
        const q = query(collection(db, 'presencial_courses'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort manually if needed, or use orderBy in query (requires index potentially)
            // Sorting by startDate (ISO)
            coursesData.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
            setCourses(coursesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleBooking = async (courseId) => {
        setProcessing(courseId);
        try {
            const response = await fetch('/api/presencial/checkout', {
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
            alert(error.message); // Using alert or toast if configured
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 pb-20 font-lato">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10 text-center">
                    <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-zinc-400 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-sans">
                        Mentoria Exclusiva
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent font-serif italic">
                        Formación Presencial <span className="not-italic">2026</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-lato font-light">
                        Perfecciona tu técnica con nuestros cursos intensivos en grupos reducidos.
                        <br className="hidden md:block" /> Atención personalizada y práctica intensiva garantizada.
                    </p>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            </section>

            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {courses.map((course) => {
                        const isFull = course.enrolled >= course.capacity;
                        const spotsLeft = course.capacity - course.enrolled;

                        return (
                            <Card key={course.id} className="relative group hover:shadow-2xl transition-all duration-500 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm flex flex-col overflow-hidden">
                                <div className="h-64 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    {course.image ? (
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                                            <span className="text-4xl filter grayscale opacity-20">💅</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <Badge variant="secondary" className="font-mono bg-white/90 dark:bg-black/90 text-zinc-900 dark:text-white backdrop-blur-sm self-start shadow-sm border border-zinc-200/50">
                                            {course.dates}
                                        </Badge>
                                        {isFull && <Badge variant="destructive" className="shadow-sm self-start">AGOTADO</Badge>}
                                        {!isFull && spotsLeft <= 3 && <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-0 self-start">¡Últimos {spotsLeft} cupos!</Badge>}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-2xl font-bold text-white font-serif tracking-wide leading-tight drop-shadow-md">
                                            {course.title}
                                        </h3>
                                        {course.subtitle && (
                                            <p className="text-zinc-200 text-sm font-medium mt-1 drop-shadow font-sans">
                                                {course.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <CardContent className="space-y-6 flex-grow pt-6">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl font-serif font-medium tracking-tight text-zinc-900 dark:text-white">$800</span>
                                        <span className="text-zinc-500 text-sm font-bold uppercase tracking-wider font-sans">USD</span>
                                    </div>

                                    <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                                <CheckIcon className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="font-lato">Capacidad máxima <strong className="text-zinc-900 dark:text-zinc-200">10 alumnas</strong></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                                <CheckIcon className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="font-lato">2 días de formación intensiva</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                                <CheckIcon className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="font-lato">Incluye kit de inicio profesional</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                                <CheckIcon className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="font-lato">Certificación internacional</span>
                                        </li>
                                    </ul>
                                </CardContent>

                                <CardFooter className="pb-6 pt-0 grid grid-cols-2 gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full h-12 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-sans tracking-wide uppercase text-xs font-semibold">
                                                Ver Contenido
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto font-lato">
                                            <DialogHeader>
                                                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                                    <Badge variant="outline" className="font-sans">{course.dates}</Badge>
                                                    <span className="text-xs font-mono uppercase">Presencial</span>
                                                </div>
                                                <DialogTitle className="text-3xl font-serif font-bold italic">{course.title}</DialogTitle>
                                                {course.subtitle && (
                                                    <DialogDescription className="text-lg font-medium text-primary font-sans">
                                                        {course.subtitle}
                                                    </DialogDescription>
                                                )}
                                            </DialogHeader>

                                            <div className="mt-6 space-y-8">
                                                {course.syllabus ? (
                                                    course.syllabus.map((module, idx) => (
                                                        <div key={idx} className="space-y-4">
                                                            <h4 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3 border-b pb-2 border-zinc-100 dark:border-zinc-800">
                                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-sans">
                                                                    {idx + 1}
                                                                </span>
                                                                {module.title}
                                                            </h4>
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pl-2">
                                                                {module.items.map((item, i) => (
                                                                    <li key={i} className="text-zinc-600 dark:text-zinc-400 flex items-start gap-2 text-sm leading-relaxed">
                                                                        <span className="text-primary/60 mt-1.5">•</span>
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
                                                        <p>El contenido detallado estará disponible pronto.</p>
                                                    </div>
                                                )}

                                                <div className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-8 shadow-sm">
                                                    <h5 className="font-serif font-bold mb-4 flex items-center gap-2 text-xl text-zinc-900 dark:text-white">
                                                        <span className="bg-primary/10 p-1.5 rounded-full text-primary">
                                                            <CheckIcon className="h-5 w-5" />
                                                        </span>
                                                        ¿Qué incluye tu inscripción?
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-700 dark:text-zinc-300">
                                                        {[
                                                            "Modalidad teórico - práctica",
                                                            "Corrección en vivo durante la clase",
                                                            "Correcciones personalizadas (1 mes vía chat)",
                                                            "Soporte vía chat durante ese mes",
                                                            "Guías digitales de herramientas y proveedores",
                                                            "Guía teórica completa",
                                                            "E-book de marketing",
                                                            "Kit de práctica profesional",
                                                            "Certificado de participación",
                                                            "Almuerzo incluido"
                                                        ].map((item, index) => (
                                                            <div key={index} className="flex items-start gap-3 bg-white dark:bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                                                                <CheckIcon className="h-4 w-4 text-primary mt-0.5" />
                                                                <span className="text-sm font-medium">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="sticky bottom-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md pt-4 pb-2 border-t mt-6 z-20">
                                                <Button
                                                    className="w-full h-14 text-lg font-serif italic shadow-xl bg-zinc-900 hover:bg-black text-white"
                                                    onClick={() => handleBooking(course.id)}
                                                    disabled={isFull || processing === course.id}
                                                >
                                                    {processing === course.id ? 'Procesando...' : isFull ? 'Sold Out' : `Reservar Cupo - $800 USD`}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        className="w-full h-12 text-sm font-bold tracking-widest uppercase shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
                                        size="lg"
                                        onClick={() => handleBooking(course.id)}
                                        disabled={isFull || processing === course.id}
                                    >
                                        {processing === course.id ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                                Procesando...
                                            </span>
                                        ) : isFull ? (
                                            'Sold Out'
                                        ) : (
                                            'Reservar'
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
