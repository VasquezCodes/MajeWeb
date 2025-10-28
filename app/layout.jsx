import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Importamos los nuevos componentes
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

export const metadata = {
  title: 'Maje Nail Spa - Orlando, FL',
  description: 'Expertas en arte de uñas, kapping, manicura semipermanente y más.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Script de Booksy cargado globalmente */}
        <Script
          id="booksy-widget"
          src="https://booksy.com/widget/code.js?id=482147&country=us&lang=en"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${crimsonText.variable} antialiased bg-brand-white text-brand-text`}
      >
        {/* Navbar va arriba de todo */}
        <Navbar />
        
        {/* El contenido de cada página irá aquí */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer va abajo de todo */}
        <Footer />
      </body>
    </html>
  );
}