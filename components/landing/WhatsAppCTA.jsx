"use client";

import { track } from "@vercel/analytics";
import { waLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

/**
 * Botón/enlace de WhatsApp reutilizable.
 * - `messageKey`: clave de WHATSAPP_MESSAGES (también se usa como `source` en analytics).
 * - `variant`: estilo visual.
 * - El verde de WhatsApp se reserva al ícono (concepto monocromo).
 */
const VARIANTS = {
  // Espresso sólido sobre fondo claro (CTA principal)
  solid:
    "bg-spa-espresso text-spa-cream hover:bg-spa-espresso/90 border border-spa-espresso",
  // Crema sólido sobre fondo oscuro (CTA en bloques espresso)
  light:
    "bg-spa-cream text-spa-espresso hover:bg-spa-sand border border-spa-cream",
  // Contorno sobre claro
  outline:
    "bg-transparent text-spa-espresso hover:bg-spa-espresso hover:text-spa-cream border border-spa-espresso",
  // Contorno sobre oscuro (hero dark)
  "outline-light":
    "bg-transparent text-spa-cream hover:bg-spa-cream hover:text-spa-taupe-dark border border-spa-cream/70",
};

const SIZES = {
  sm: "px-5 py-2.5 text-sm gap-2",
  md: "px-7 py-3.5 text-[15px] gap-2.5",
  lg: "px-9 py-5 text-base gap-3",
};

export default function WhatsAppCTA({
  messageKey = "general",
  children = "Escríbeme por WhatsApp",
  variant = "solid",
  size = "md",
  className = "",
  showIcon = true,
  greenIcon = true,
}) {
  const message = WHATSAPP_MESSAGES[messageKey] || WHATSAPP_MESSAGES.general;

  const handleClick = () => {
    try {
      track("whatsapp_click", { source: messageKey });
    } catch {
      /* analytics no disponible: no romper el flujo del usuario */
    }
  };

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center font-semibold uppercase tracking-wide rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {showIcon && (
        <WhatsAppIcon
          className={`w-[1.15em] h-[1.15em] transition-transform duration-300 group-hover:rotate-[8deg] ${
            greenIcon ? "text-whatsapp" : ""
          }`}
        />
      )}
      <span>{children}</span>
    </a>
  );
}
