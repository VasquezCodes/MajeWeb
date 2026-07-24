// components/MainLayout.jsx
// Componente cliente que renderiza el layout principal condicionalmente
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BooksyGuard from "./BooksyGuard";

import PromoBanner from "./PromoBanner";
import { Analytics } from "@vercel/analytics/next";
// import SmoothScrolling from "./SmoothScrolling"; // Deshabilitado temporalmente para debug

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");
    const isAdmin = pathname?.startsWith("/admin");
    // La landing de captación (/) trae su propio header/footer minimal y NO debe
    // enlazar al lado de ventas, así que se renderiza sin el chrome global.
    const isLanding = pathname === "/";

    // Si estamos en /studio, /admin o la landing, renderizar solo el contenido sin layout de ventas
    if (isStudio || isAdmin || isLanding) {
        return <>{children}</>;
    }

    return (
        <>


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

