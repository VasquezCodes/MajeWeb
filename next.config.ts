/** @type {import('next').NextConfig} */
const nextConfig = {
  // Añade esta sección de "images"
  images: {
    // Tamaños de dispositivo para generar imágenes responsivas de alta calidad
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Tamaños adicionales para imágenes más pequeñas
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Calidad por defecto más alta para imágenes premium
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Dejo este también por si volvemos a usar placeholders
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Sanity CDN para imágenes del CMS
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
