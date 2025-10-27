/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-white': '#FFFFFF', // Blanco puro
        'brand-black': '#000000', // Negro absoluto
        'brand-gray-light': '#F5F5F5', // Gris muy claro
        'brand-gray': '#808080', // Gris medio
        'brand-gray-dark': '#404040', // Gris oscuro elegante
        'brand-charcoal': '#2C2C2C', // Carbón sofisticado
        'brand-slate': '#708090', // Pizarra elegante
        'brand-text': '#2C2C2C', // Texto principal (carbón)
        'brand-text-light': '#808080', // Texto secundario (gris medio)
        'brand-accent': '#000000', // Negro como acento principal
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        'serif': ['var(--font-playfair)', 'ui-serif', 'Georgia'],
        'crimson': ['var(--font-crimson)', 'serif'],
      },
      borderRadius: {
        'xl': '1.0rem', // Bordes redondeados más suaves
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
