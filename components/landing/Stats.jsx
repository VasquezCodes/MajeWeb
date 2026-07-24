"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "./data";

function useCountUp(target, run, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    // Respetar usuarios con movimiento reducido: mostrar el número final directo
    // (vía rAF para no llamar a setState de forma síncrona dentro del effect).
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return value;
}

function Stat({ stat, run }) {
  const value = useCountUp(stat.value, run);
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="font-display text-5xl sm:text-6xl md:text-7xl text-spa-espresso leading-none tabular-nums">
        {stat.prefix}
        {value}
        {stat.suffix}
      </div>
      <div className="mt-3 text-xs sm:text-sm uppercase tracking-[0.2em] text-spa-mocha/70 max-w-[14ch]">
        {stat.label}
      </div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Credenciales"
      className="border-y border-spa-espresso/10 bg-spa-cream"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-3 divide-x divide-spa-espresso/10">
        {STATS.map((stat) => (
          <Stat key={stat.label} stat={stat} run={run} />
        ))}
      </div>
    </section>
  );
}
