// app/layout.jsx
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";

// Componentes propios
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BooksyGuard from "../components/BooksyGuard"; // opcional: limpia flotantes fuera de /reservas
import ChristmasDecorations from "../components/ChristmasDecorations"; // Decoraciones navideñas automáticas

import PromoBanner from "../components/PromoBanner"; // Banner de ofertas (BF/CM)

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#DA8695",
};

export const metadata = {
  title: "Maje Nail Spa - Orlando, FL",
  description:
    "Expertas en arte de uñas, kapping, manicura semipermanente y más.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Script para fix de viewport height en mobile - debe estar en head para ejecutarse antes del render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setVH() {
                  let vh = window.innerHeight * 0.01;
                  document.documentElement.style.setProperty('--vh', vh + 'px');
                }

                setVH();
                window.addEventListener('resize', setVH);
                window.addEventListener('orientationchange', setVH);
              })();
            `,
          }}
        />
      </head>
      {/* Nada de Script de Booksy aquí; solo en /reservas */}
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${crimsonText.variable} antialiased bg-brand-white text-brand-text`}
      >
        {/* Decoraciones navideñas (Nov 10 - Ene 10) */}
        <ChristmasDecorations />

        <Navbar />

        {/* Banner de Ofertas (Solo visible en fechas configuradas) */}
        <PromoBanner />

        <main className="min-h-screen-mobile">{children}</main>

        <Footer />

        {/* Mantiene limpio el DOM de cualquier botón flotante de Booksy fuera de /reservas */}
        <BooksyGuard />
      </body>
    </html>
  );
}
