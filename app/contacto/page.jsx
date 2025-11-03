'use client';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-blue-600 font-crimson mb-6 font-bold">
              Estamos aquí para ayudarte
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-brand-text leading-tight mb-6">
              Contacto
            </h1>
            <p className="text-lg md:text-xl font-crimson text-brand-text-light leading-relaxed">
              Escribinos por WhatsApp o Instagram para consultas y turnos
            </p>
          </div>
        </div>
      </section>

      {/* Contact Buttons */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <div className="space-y-4">
          <a
            href="https://wa.me/13213145268"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-6 px-8 bg-brand-black text-white rounded-full font-black text-lg hover:bg-brand-text transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          <a
            href="https://www.instagram.com/majenailspa/?hl=es-la"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-6 px-8 border-2 border-brand-text text-brand-text rounded-full font-black text-lg hover:bg-brand-black hover:text-white hover:border-brand-black transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-blue-600 font-crimson mb-3">
              Teléfono
            </p>
            <a
              href="tel:+13213145268"
              className="text-xl font-serif font-bold text-brand-text hover:text-blue-600 transition-colors"
            >
              +1 (321) 314-5268
            </a>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-blue-600 font-crimson mb-3">
              Email
            </p>
            <a
              href="mailto:info@majenailspa.com"
              className="text-xl font-serif font-bold text-brand-text hover:text-blue-600 transition-colors break-all"
            >
              info@majenailspa.com
            </a>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-blue-600 font-crimson mb-3">
              Ubicación
            </p>
            <a
              href="https://maps.google.com/?q=7616+Southland+Blvd+Suite+113+Orlando+FL+32809"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-serif font-bold text-brand-text hover:text-blue-600 transition-colors"
            >
              Orlando, Florida
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.8437924815936!2d-81.40936492378955!3d28.433862094563724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e77e5e5e5e5e5e%3A0x5e5e5e5e5e5e5e5e!2s7616%20Southland%20Blvd%20%23113%2C%20Orlando%2C%20FL%2032809!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Maje Nail Spa"
          />
        </div>
      </section>
    </div>
  );
}
