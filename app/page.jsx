import LandingClient from "../components/LandingClient";

// Landing de captación a WhatsApp (público: manicuristas que buscan formación).
// Server component: define la metadata y renderiza el cliente con las animaciones.
export const metadata = {
  title: {
    absolute:
      "Formación profesional en uñas para manicuristas | Majé Nails Academy",
  },
  description:
    "Formación de alto nivel para manicuristas que quieren dominar la Manicura Rusa High Level, trabajar con estructura y cobrar lo que valen. Presencial en Orlando, mentorías VIP y programa online. Escríbenos por WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "De manicurista a experta · Majé Nails Academy",
    description:
      "Formación de alto nivel para manicuristas que no se conforman con lo básico. Estructura, criterio y acabados que fidelizan.",
    url: "/",
    siteName: "Majé Nails Academy",
    images: [
      {
        url: "/nuevasImg/nuevoHero.jpg",
        width: 1200,
        height: 800,
        alt: "Mariajesus Matos · Majé Nails Academy",
      },
    ],
    locale: "es_US",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingClient />;
}
