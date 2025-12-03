"use client";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function SmoothScrolling({ children }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 2.0, smoothWheel: true, syncTouch: true }}>
            {children}
        </ReactLenis>
    );
}

export default SmoothScrolling;
