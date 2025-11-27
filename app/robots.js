export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Ejemplo: bloquear rutas de administración si existen
        },
        sitemap: 'https://majenailspa.com/sitemap.xml', // Reemplazar con el dominio real
    };
}
