"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { waLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

// Botón flotante de WhatsApp, siempre accesible. Aparece tras pasar el hero.
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    try {
      track("whatsapp_click", { source: "flotante" });
    } catch {
      /* noop */
    }
  };

  return (
    <a
      href={waLink(WHATSAPP_MESSAGES.flotante)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Escríbenos por WhatsApp"
      className={`fixed z-50 bottom-5 right-5 flex items-center justify-center w-14 h-14 rounded-full bg-spa-espresso text-spa-cream shadow-xl shadow-black/20 transition-all duration-500 hover:scale-110 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-spa-clay animate-ping opacity-20" />
      <WhatsAppIcon className="w-7 h-7 relative text-whatsapp" />
    </a>
  );
}
