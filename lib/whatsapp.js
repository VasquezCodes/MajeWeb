// lib/whatsapp.js
// Configuración central de WhatsApp para la landing de captación.
// Todos los CTA salen de acá: cambiar el número en un solo lugar los actualiza todos.

// Formato internacional, solo dígitos, con código de país. +1 (321) 314-5268
export const WHATSAPP_NUMBER = "13213145268";

/**
 * Construye un link wa.me con el mensaje pre-rellenado.
 * @param {string} message - Texto que aparecerá escrito en el chat.
 * @returns {string} URL lista para usar en un <a href>.
 */
export function waLink(message = "") {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Mensajes pre-rellenados por contexto. Cada CTA "sabe" de dónde viene,
 * para que Mariajesus entre a la conversación conociendo el interés.
 * La clave también se usa como `source` en la medición de analytics.
 */
export const WHATSAPP_MESSAGES = {
  general:
    "Hola Mariajesus 👋 Quiero formarme como manicurista profesional. ¿Me cuentas más?",
  hero:
    "Hola Mariajesus 👋 Vi tu página y quiero dar el primer paso para formarme contigo. ¿Me cuentas más?",
  presencial:
    "Hola 👋 Me interesa la Formación Presencial 2026. ¿Me das información?",
  mentoria:
    "Hola 👋 Quiero aplicar a las Mentorías VIP. ¿Cómo funciona?",
  online:
    "Hola 👋 Me interesa el programa online Manicurista CEO. ¿Me cuentas?",
  final:
    "Hola Mariajesus 👋 Estoy lista para dar el primer paso. ¿Me ayudas a elegir mi formación?",
  flotante:
    "Hola Mariajesus 👋 Tengo una duda sobre tus formaciones. ¿Me ayudas?",
};
