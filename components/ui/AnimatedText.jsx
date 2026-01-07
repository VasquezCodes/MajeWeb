'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function AnimatedText({ text, className = '', duration = 1, stagger = 0.05, start = "top 90%", split = true }) {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        // Safe check for window
        if (typeof window === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger, SplitText);

        const element = containerRef.current;
        if (!element) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        let splitInstance;

        const ctx = gsap.context(() => {
            // Prevent FOUC: Start visible for GSAP (overriding CSS opacity-0)
            gsap.set(element, { autoAlpha: 1 });

            if (split) {
                splitInstance = new SplitText(element, { types: "chars" });

                // Mobile: Simpler animation to avoid lag (no 3D rotation, no scale)
                const mobileAnimation = {
                    duration: duration,
                    opacity: 0,
                    y: 20,
                    scale: 1,
                    rotationX: 0,
                    transformOrigin: "center",
                    ease: "power2.out",
                    stagger: stagger,
                };

                // Desktop: Premium 3D animation
                const desktopAnimation = {
                    duration: duration,
                    opacity: 0,
                    scale: 0,
                    y: 80,
                    rotationX: 180,
                    transformOrigin: "0% 50% -50",
                    ease: "back",
                    stagger: stagger,
                };

                gsap.from(splitInstance.chars, {
                    ...(isMobile ? mobileAnimation : desktopAnimation),
                    scrollTrigger: {
                        trigger: element,
                        start: start,
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                });
            } else {
                // Simple Fade Up for gradient/special text where splitting breaks CSS
                gsap.from(element, {
                    duration: duration,
                    opacity: 0,
                    y: isMobile ? 30 : 50,
                    ease: isMobile ? "power2.out" : "back",
                    scrollTrigger: {
                        trigger: element,
                        start: start,
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        }, element);

        return () => {
            ctx.revert();
            if (splitInstance) splitInstance.revert();
        };
    }, [text, duration, stagger, start, split]);

    return (
        <span ref={containerRef} className={`inline-block opacity-0 ${className}`}>
            {text}
        </span>
    );
}
