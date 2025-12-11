"use client";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useState } from "react";

function SmoothScrolling({ children }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Detectar si es desktop (ancho > 768px)
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        // Chequear al montar
        checkIsDesktop();

        // Escuchar cambios de tamaño
        window.addEventListener("resize", checkIsDesktop);

        return () => {
            window.removeEventListener("resize", checkIsDesktop);
        };
    }, []);

    // Si no es desktop, renderizar children sin Lenis (scroll nativo)
    if (!isDesktop) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 2.0,
                smoothWheel: true,
                // Prevenir Lenis en elementos con data-lenis-prevent o con overflow scroll
                prevent: (node) => {
                    // Permitir scroll nativo en modales y elementos con overflow
                    if (node.hasAttribute('data-lenis-prevent')) return true;
                    if (node.closest('[data-lenis-prevent]')) return true;

                    // Detectar elementos con overflow scroll/auto
                    const style = getComputedStyle(node);
                    const overflowY = style.overflowY;
                    if (overflowY === 'scroll' || overflowY === 'auto') {
                        // Si el contenido es más alto que el contenedor, prevenir Lenis
                        if (node.scrollHeight > node.clientHeight) {
                            return true;
                        }
                    }
                    return false;
                }
            }}
        >
            {children}
        </ReactLenis>
    );
}

export default SmoothScrolling;
