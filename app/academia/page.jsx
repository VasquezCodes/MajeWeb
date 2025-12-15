// app/academia/page.jsx - Server Component wrapper
// Importamos el componente cliente que contiene toda la lógica
// Por ahora usa datos hardcodeados, pero está listo para integrar Sanity cuando se decida

import AcademiaPageClient from './AcademiaPageClient';

// Revalidar cada 60 segundos cuando se integre Sanity
export const revalidate = 60;

export const metadata = {
    title: 'Academia',
    description: 'Mentorías VIP de técnicas de uñas profesionales. Aprende Manicura Rusa, Builder Gel, Dual System, Poly Gel y más.',
};

export default async function AcademiaPage() {
    // TODO: En el futuro, obtener datos de Sanity aquí
    // const courses = await client.fetch(coursesQuery);
    // const testimonials = await client.fetch(testimonialsQuery);
    // const faqs = await client.fetch(faqsQuery);

    // Por ahora, el componente cliente usa sus propios datos hardcodeados
    // Cuando estés lista para migrar completamente, descomentar las líneas de arriba
    // y pasar los props: <AcademiaPageClient courses={courses} testimonials={testimonials} faqs={faqs} />

    return <AcademiaPageClient />;
}
