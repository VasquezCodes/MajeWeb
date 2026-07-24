"use client";

import SmoothScrolling from "./SmoothScrolling";
import LandingHeader from "./landing/LandingHeader";
import LandingSections from "./landing/LandingSections";
import FloatingWhatsApp from "./landing/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

// Cliente de la landing de captación. Trae su propio chrome (header/footer) y
// scroll suave (Lenis, solo desktop). No enlaza al lado de ventas.
export default function LandingClient() {
  return (
    <SmoothScrolling>
      <LandingHeader />
      <main className="bg-spa-cream overflow-x-hidden">
        <LandingSections />
      </main>
      <FloatingWhatsApp />
      <Analytics />
    </SmoothScrolling>
  );
}
