// components/MainLayout.jsx
// Componente cliente que renderiza el layout principal condicionalmente
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BooksyGuard from "./BooksyGuard";
import ChristmasDecorations from "./ChristmasDecorations";
import PromoBanner from "./PromoBanner";
import { Analytics } from "@vercel/analytics/next";
// import SmoothScrolling from "./SmoothScrolling"; // Deshabilitado temporalmente para debug

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");

    // Si estamos en /studio, renderizar solo el contenido sin layout
    if (isStudio) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Decoraciones navideñas (Nov 10 - Ene 10) */}
            <ChristmasDecorations />

            <Navbar />

            {/* Banner de Ofertas (Solo visible en fechas configuradas) */}
            <PromoBanner />

            <main className="min-h-screen-mobile">{children}</main>

            <Footer />

            {/* Mantiene limpio el DOM de cualquier botón flotante de Booksy fuera de /reservas */}
            <BooksyGuard />
            <Analytics />
        </>
    );
}

