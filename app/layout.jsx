// app/layout.jsx
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";
import MainLayout from "../components/MainLayout";

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
  metadataBase: new URL('https://majenailspa.com'),
  title: {
    default: "Maje Nail Spa - Orlando, FL | Arte de Uñas y Manicura",
    template: "%s | Maje Nail Spa"
  },
  description:
    "Expertas en arte de uñas, kapping, manicura semipermanente, pedicura y uñas acrílicas en Orlando, FL. Servicio en español e inglés. ¡Reserva tu cita hoy!",
  keywords: [
    "Salón de uñas Orlando",
    "Nail Spa Orlando",
    "Manicura Orlando",
    "Pedicura Orlando",
    "Uñas acrílicas Orlando",
    "Diseño de uñas Orlando",
    "Nail Art Orlando",
    "Spa de uñas hispano Orlando",
    "Maje Nail Spa",
    "Kapping",
    "Manicura semipermanente",
    "Uñas de gel Orlando",
    "Dip powder Orlando"
  ],
  authors: [{ name: "Maje Nail Spa" }],
  creator: "Maje Nail Spa",
  publisher: "Maje Nail Spa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Maje Nail Spa - Orlando, FL | Arte de Uñas y Manicura",
    description: "Tu destino para uñas perfectas en Orlando. Especialistas en Nail Art, Kapping y cuidado de uñas. ¡Visítanos!",
    url: 'https://majenailspa.com',
    siteName: 'Maje Nail Spa',
    images: [
      {
        url: '/hero.JPEG',
        width: 1200,
        height: 630,
        alt: 'Maje Nail Spa Salon',
      },
    ],
    locale: 'es_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Maje Nail Spa - Orlando, FL",
    description: "Expertas en arte de uñas y cuidado personal en Orlando.",
    images: ['/hero.JPEG'],
  },
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
    title: "Maje Spa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

        {/* Script para fix de viewport height en mobile */}
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
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${crimsonText.variable} antialiased bg-brand-white text-brand-text`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
