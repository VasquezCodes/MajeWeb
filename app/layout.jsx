// app/layout.jsx
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";

// Componentes propios
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BooksyGuard from "../components/BooksyGuard"; // opcional: limpia flotantes fuera de /reservas

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
  title: "Maje Nail Spa - Orlando, FL",
  description:
    "Expertas en arte de uñas, kapping, manicura semipermanente y más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* Nada de Script de Booksy aquí; solo en /reservas */}
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${crimsonText.variable} antialiased bg-brand-white text-brand-text`}
      >
        <Navbar />

        <main className="min-h-screen">{children}</main>

        <Footer />

        {/* Mantiene limpio el DOM de cualquier botón flotante de Booksy fuera de /reservas */}
        <BooksyGuard />
      </body>
    </html>
  );
}
