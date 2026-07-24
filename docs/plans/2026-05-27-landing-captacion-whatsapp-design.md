# Landing de captación a WhatsApp — Diseño

**Fecha:** 2026-05-27
**Proyecto:** majeWeb (Maje Nails / Maje Nails Academy)
**Autor:** Mariajesus Matos (negocio) · diseño asistido

---

## 1. Contexto y problema

La home actual mezcla dos públicos (formación para manicuristas + servicios de spa) y
muestra precios. Resultado: *"los clientes entran, ven el precio y se van"* sin que medie
una conversación. Queremos cambiar eso.

**Objetivo:** reemplazar por completo la front page por una **landing de captación** cuyo
único trabajo es convertir tráfico (principalmente de Instagram) en **conversaciones de
WhatsApp** con manicuristas interesadas en **formación de alto ticket**.

**Inspiración:** anyinails.com (academia de uñas premium, estructura de lead-gen).

## 2. Decisiones validadas (brainstorming)

| Tema | Decisión |
|------|----------|
| Público #1 | Manicuristas que buscan **formación** (alto ticket). Spa/productos quedan fuera de la landing. |
| Captación | **Click-to-chat directo** a WhatsApp (`wa.me`) con mensaje pre-rellenado por contexto. Sin formularios. |
| Separación | **Misma web, sin enlaces**: landing en `/`; el lado de ventas sigue existiendo por URL directa pero no se enlaza desde la landing. Cambio mínimo de infraestructura. |
| Estética | **Minimalista alto contraste** (blanco/negro), tipografía display **Anton**, cuerpo Inter. |
| Acento | **Monocromo puro**: el único color es el verde de WhatsApp `#25D366` (solo en el ícono). |
| Programas | **Híbrido**: un CTA dominante + sección con los 3 formatos, cada uno con su botón WhatsApp. **Sin precios** en toda la landing. |

**Prueba social disponible (real):** años de experiencia, nº de alumnas, testimonios.
Mientras tanto se usan **datos MOCK** marcados con `[MOCK]` para reemplazar al final.

## 3. Concepto creativo (frontend-design)

> **"Editorial monocromo — el mundo en blanco y negro donde el verde es la única puerta."**

Titulares Anton colosales en negro sobre blanco; fotografía editorial full-bleed de
Mariajesus en B&N; paleta estrictamente monocroma donde el verde de WhatsApp es el único
color de la experiencia, haciendo que cada CTA se sienta como la única salida iluminada.
Scroll suave (Lenis) + revelado tipográfico por `clip-path`/máscara, sensación de "pasar
páginas de una revista de moda".

## 4. Arquitectura técnica

- **Chrome propio de la landing.** `MainLayout` deja de renderizar el `Navbar`/`Footer` de
  ventas en la ruta `/` exacta (igual que ya hace con `/studio` y `/admin`). La landing trae
  su propio header minimal (logo + WhatsApp) y footer minimal (WhatsApp + Instagram + legal),
  **sin enlaces a ventas**.
- **Páginas de venta intactas.** `/presencial`, `/academia`, `/productos`, `/reservas`,
  `/contacto`, `/galeria`, checkout y `/admin` conservan su layout y siguen accesibles por URL.
- **SEO/metadata.** `app/page.jsx` pasa a *server component* que exporta `metadata` propia
  (formación de uñas) y renderiza `LandingClient` (cliente, con animaciones).
- **Código viejo** (`page.jsx` actual + `PassarelaCard`) se elimina.

## 5. Estructura de la landing (orden)

1. Header minimal sticky (logo + WhatsApp)
2. Hero (foto editorial + titular Anton + CTA WhatsApp)
3. Barra de credenciales (`+8 años` · `+500 alumnas` · `Presencial + Online`) con count-up
4. El dolor (le habla a la manicurista)
5. La transformación (qué logra)
6. Quién es Mariajesus (autoridad / marca personal)
7. Programas — híbrido (Presencial 2026 destacado, Mentorías VIP, Online CEO), sin precio
8. Portafolio (marquee + grid de trabajos)
9. Testimonios (3 reseñas 5★ `[MOCK]`)
10. FAQ corta (objeciones)
11. CTA final (bloque oscuro full-width)
12. Footer minimal (sin enlaces a ventas)
13. Botón WhatsApp flotante (siempre presente)

## 6. Captación WhatsApp + medición

- `lib/whatsapp.js`: número central (`[MOCK]`) + helper `waLink(msg)` + mensajes por contexto.
- Mensajes distintos por sección/programa (hero, presencial, VIP, online, final).
- Medición con `@vercel/analytics`: evento `whatsapp_click` con `{ source }`.
- Futuro opcional: Meta Pixel `Contact` (requiere Pixel ID; preparado pero desactivado).

## 7. Sistema visual (tokens)

- **Color:** monocromo con escala `neutral` nativa de Tailwind + `black`/`white`.
  `#25D366` reservado al ícono de WhatsApp.
- **Tipografía:** display **Anton** (`--font-anton`, `font-display`), cuerpo Inter.
- **Layout:** contenedor máx. ~1280px, mucho aire (`py-24/32`), líneas *hairline* (negro 10%),
  esquinas casi rectas, CTAs *pill*.

## 8. Movimiento

- Lenis (scroll suave) re-activado **solo en la landing**.
- GSAP ScrollTrigger para reveals por sección + count-up de credenciales.
- Hero con clip/mask reveal del titular + parallax sutil de la foto.
- Marquee infinito en portafolio (`InfiniteMarqueeBanner` como referencia).
- `prefers-reduced-motion` respetado; solo se animan `transform`/`opacity`; sin layout shift.

## 9. Calidad / verificación

- Mobile-first (360–414px), Lighthouse 90+ objetivo, LCP en hero (`priority`).
- Accesibilidad: contraste, foco visible, `alt`, jerarquía semántica.
- WhatsApp links abren app en móvil / web en desktop con mensaje correcto.
- Sin regresiones en el lado de ventas; sin warnings de hidratación.

## 10. Pendiente del cliente (reemplazar MOCK)

- Número real de WhatsApp.
- Cifras reales (años, alumnas).
- Testimonios reales (texto + nombre, o capturas/video).
- (Opcional) Meta Pixel ID.
