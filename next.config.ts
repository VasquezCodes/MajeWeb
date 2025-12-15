/** @type {import('next').NextConfig} */
const nextConfig = {
  // Añade esta sección de "images"
  images: {
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
