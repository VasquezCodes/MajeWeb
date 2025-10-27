import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Importamos los iconos que usaremos
import { 
  AcademicCapIcon, 
  PencilSquareIcon, 
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';

// --- Datos de Ejemplo para los Productos ---
const products = [
  {
    id: 1,
    title: "Kit Básico de Manicura",
    description:
      "Todo lo necesario para comenzar con manicura profesional: esmaltes, herramientas y guías de aprendizaje.",
    imageUrl:
      "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=960&q=80",
    tags: ["Herramientas básicas", "Esmaltes premium", "Guía incluida"],
    price: 89.99,
    originalPrice: 120.00,
    inStock: true,
  },
  {
    title: "Sistema Dual Profesional",
    description:
      "Kit completo para construcción de uñas con técnica de moldes duales, incluye moldes, líquidos y pinceles.",
    imageUrl:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=960&q=80",
    tags: ["Esculpidas premium", "Moldes incluidos", "Profesional"],
    price: 149.99,
    originalPrice: 180.00,
    inStock: true,
  },
  {
    title: "Productos Spa para Pedicura",
    description:
      "Línea completa de productos para tratamientos spa: exfoliantes, cremas y aceites esenciales.",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=960&q=80",
    tags: ["Tratamientos spa", "Aceites esenciales", "Exfoliantes"],
    price: 79.99,
    originalPrice: 99.00,
    inStock: true,
  },
  {
    title: "Set de Marketing Digital",
    description:
      "Herramientas y plantillas para promocionar tu negocio de uñas: flyers, posts para redes y estrategias.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80",
    tags: ["Marketing digital", "Plantillas", "Estrategias"],
    price: 59.99,
    originalPrice: 80.00,
    inStock: false,
  },
];

const stats = [
  {
    value: "500+",
    label: "Productos vendidos",
  },
  {
    value: "50+",
    label: "Productos únicos",
  },
  {
    value: "4.8/5",
    label: "Calificación promedio",
  },
];

// --- Datos para la sección "Cómo Comprar" ---
const steps = [
  {
    icon: PencilSquareIcon,
    title: "Paso 1: Elige tus Productos",
    description: "Navega por nuestra tienda y agrega los productos que necesitas a tu carrito. Revisa las descripciones y precios."
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: "Paso 2: Revisa tu Carrito",
    description: "Verifica los items en tu carrito, ajusta cantidades si es necesario y procede al checkout cuando estés listo."
  },
  {
    icon: CalendarDaysIcon,
    title: "Paso 3: Completa tu Compra",
    description: "Ingresa tus datos de envío y pago. Procesamos tu orden de forma segura y te enviamos la confirmación."
  }
];

// --- Componente Principal de la Página ---

export default function TiendaPage() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="space-y-24 md:space-y-32 mb-24 md:mb-32">

      {/* === Sección 1: Hero de Tienda === */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-light via-white to-brand-pink-light" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-gray/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Texto del Hero */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-text shadow-sm">
              Tienda Online
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold text-brand-text tracking-tight">
              Productos premium para <span className="text-brand-pink">tu negocio</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-text-light max-w-xl mx-auto lg:mx-0">
              Descubre nuestra selección curada de productos profesionales para manicura, pedicura y spa. Calidad premium a precios accesibles.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-pink px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-brand-pink/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink/90"
              >
                Ver Productos
              </Link>
              <Link
                href="#proceso"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-text/20 px-8 py-4 text-lg font-semibold text-brand-text transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-text"
              >
                Cómo Comprar
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l-2 border-brand-pink/40 pl-6 text-left">
                  <dt className="text-3xl font-bold text-brand-text">{stat.value}</dt>
                  <dd className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-text-light">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Imagen del Hero */}
          <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-lg">
            <div className="absolute inset-0 -translate-x-6 translate-y-8 rounded-[2.5rem] bg-gradient-to-br from-brand-pink/50 via-white/30 to-brand-gray-light/60 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/60">
              <Image
                src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=900&q=80"
                alt="Mentoría personalizada de uñas de lujo"
                width={900}
                height={1100}
                className="h-[420px] w-full object-cover"
                priority
              />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-text-light">
                  Experiencia VIP
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-text">
                  Acompañamiento personalizado y protocolos exclusivos para artistas de alto nivel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Sección 2: Lista de Productos === */}
      <section id="productos" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center">
          <h2 className="text-sm font-semibold text-brand-pink uppercase tracking-widest">
            Nuestra Tienda
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-bold text-brand-text">
            Productos Profesionales
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product, index) => (
            <div key={product.title} className={`group relative rounded-[2rem] bg-gradient-to-br from-brand-gray-light via-white to-brand-pink-light p-[1px] animate-fadeInUp`} style={{ animationDelay: `${index * 200}ms` }}>
              <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-1px)] bg-white/90 shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  {!product.inStock && (
                    <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Agotado
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Oferta
                    </span>
                  )}
                </div>
                <div className="flex flex-grow flex-col gap-6 p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-text">{product.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-brand-text-light">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-brand-gray-light/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm font-medium text-brand-text-light">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-brand-pink">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-brand-text-light line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="h-2 w-2 rounded-full bg-current"></span>
                      {product.inStock ? 'En stock' : 'Agotado'}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-base font-semibold shadow-lg transition-all duration-300 ${
                        product.inStock
                          ? 'bg-brand-pink text-white shadow-brand-pink/30 hover:-translate-y-0.5 hover:bg-brand-pink/90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                    <Link
                      href="#"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-brand-text/15 px-6 py-3 text-base font-semibold text-brand-text transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-text"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Sección 3: Cómo Comprar === */}
      <section id="proceso" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-10 -top-10 h-40 rounded-full bg-brand-gray-light/70 blur-3xl" />
        <div className="text-center">
          <h2 className="text-sm font-semibold text-brand-pink uppercase tracking-widest">
            Compra Segura
          </h2>
          <p className="mt-3 text-3xl md:text-4xl font-bold text-brand-text">
            Proceso Simple y Rápido
          </p>
        </div>

        <div className="mt-16 rounded-[2.5rem] bg-white/90 p-10 shadow-2xl ring-1 ring-brand-gray-light/60 backdrop-blur">
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-[17%] top-12 hidden h-[2px] w-[66%] -translate-x-1/2 bg-gradient-to-r from-brand-pink/30 via-brand-gray/20 to-brand-pink/30 md:block" />
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center rounded-2xl border border-brand-gray-light/70 bg-white/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeInUp"
                style={{ animationDelay: `${(index + 2) * 300}ms` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink text-white shadow-lg">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-gray-light/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-text">
                  Paso {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-brand-text">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-brand-text-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Sección 4: CTA Final === */}
      <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-pink via-brand-gray-light to-white p-[1px] shadow-2xl">
          <div className="relative rounded-[2.5rem] bg-white/95 px-10 py-14 text-center backdrop-blur">
            <div className="absolute -right-20 -top-10 h-44 w-44 rounded-full bg-brand-pink/20 blur-3xl" />
            <div className="absolute -left-24 -bottom-12 h-52 w-52 rounded-full bg-brand-gray/10 blur-3xl" />
            <span className="inline-flex items-center justify-center rounded-full border border-brand-text/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-text">
              Carrito Inteligente
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-brand-text">
              ¿Listo para equipar tu negocio?
            </h2>
            <p className="mt-4 text-lg text-brand-text-light">
              Agrega tus productos favoritos al carrito y completa tu compra en minutos. Envío rápido y seguro.
            </p>
            <div className="mt-6 text-center">
              <p className="text-sm text-brand-text-light">
                Items en carrito: <span className="font-semibold text-brand-pink">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </p>
              <p className="text-lg font-bold text-brand-text">
                Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-pink px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-pink/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink/90"
              >
                Seguir Comprando
              </Link>
              <button
                onClick={() => alert('Checkout próximamente con Stripe')}
                disabled={cart.length === 0}
                className={`inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  cart.length > 0
                    ? 'bg-brand-text text-white shadow-brand-text/30 hover:bg-brand-text/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Icon */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink text-white shadow-xl shadow-brand-pink/30 transition-all duration-300 hover:scale-110">
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-text text-xs font-bold text-white">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>
      )}

    </div>
  );
}