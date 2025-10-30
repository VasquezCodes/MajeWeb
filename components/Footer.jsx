import React from "react";
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { InstagramIcon, FacebookIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-gradient-to-b from-brand-black via-brand-gray-dark to-brand-black text-brand-gray-light/90 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-pink rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl font-serif font-bold text-brand-white mb-2">
                Maje Nail Spa
              </h3>
              <p className="text-brand-gray-light/70">
                Tu destino de lujo para el cuidado de uñas en Orlando
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <MapPinIcon className="w-5 h-5 text-brand-pink mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-brand-white font-medium">Ubicación</p>
                  <p className="text-brand-gray-light/80">
                    7616 Southland Blvd, Suite 113<br />
                    Orlando, FL 32809
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <EnvelopeIcon className="w-5 h-5 text-brand-pink mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-brand-white font-medium">Email</p>
                  <a 
                    href="mailto:contacto@ejemplo.com" 
                    className="text-brand-gray-light/80 hover:text-brand-pink transition-colors"
                  >
                    contacto@ejemplo.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <PhoneIcon className="w-5 h-5 text-brand-pink mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-brand-white font-medium">Teléfono</p>
                  <a 
                    href="tel:+14075551234" 
                    className="text-brand-gray-light/80 hover:text-brand-pink transition-colors"
                  >
                    (407) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div className="space-y-8">
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-white/10 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-gray/70">
          <p>
            &copy; {new Date().getFullYear()} Maje Nail Spa · Orlando, FL. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#privacidad" className="hover:text-brand-pink transition-colors">
              Política de Privacidad
            </a>
            <a href="#terminos" className="hover:text-brand-pink transition-colors">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}