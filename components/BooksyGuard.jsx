'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function BooksyGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const esReservas = pathname?.startsWith('/reservas');

    const limpiar = () => {
      const contenedorInline = document.getElementById('contenedor-booksy');
      const parking = document.getElementById('booksy-widget-parking');

      const candidatos = document.querySelectorAll('[class*="booksy"], [id*="booksy"]');

      candidatos.forEach((el) => {
        // 1) Nunca tocar el parking ni nada dentro de él (preserva persistencia)
        if (parking && (el === parking || parking.contains(el))) return;

        // 2) En /reservas no tocar nada que esté dentro del contenedor inline
        if (contenedorInline && contenedorInline.contains(el)) return;

        const cls = (el.className || '').toString().toLowerCase();
        const id  = (el.id || '').toLowerCase();
        const txt = (el.textContent || '').toLowerCase();
        const hueleABooksy = cls.includes('booksy') || id.includes('booksy') || txt.includes('booksy');

        const pos = (getComputedStyle(el).position || '').toLowerCase();
        const esFlotante = pos === 'fixed' || cls.includes('floating') || cls.includes('widget-button');

        if (!esReservas) {
          // Fuera de /reservas: elimina SOLO flotantes; NO borres el parking ni widgets guardados
          if (hueleABooksy && esFlotante) el.remove();
        } else {
          // En /reservas: elimina flotantes sueltos (si reaparecen), nunca el inline
          if (esFlotante) el.remove();
        }
      });
    };

    limpiar();
    const id = setInterval(limpiar, 800);
    return () => clearInterval(id);
  }, [pathname]);

  return null;
}
