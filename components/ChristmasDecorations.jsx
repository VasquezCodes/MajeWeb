'use client';

import { useEffect, useState } from 'react';
import '../app/christmas.css';

export default function ChristmasDecorations() {
  const [isChristmasSeason, setIsChristmasSeason] = useState(false);

  useEffect(() => {
    // Verificar si estamos en temporada navideña (Nov 10 - Ene 10)
    const checkChristmasSeason = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-11 (0 = Enero)
      const day = now.getDate();

      // Noviembre 10 (mes 10) hasta Diciembre 31 (mes 11)
      // O Enero 1 (mes 0) hasta Enero 10 (mes 0)
      const isNovemberToDecember = (month === 10 && day >= 10) || month === 11;
      const isEarlyJanuary = month === 0 && day <= 10;

      return isNovemberToDecember || isEarlyJanuary;
    };

    setIsChristmasSeason(checkChristmasSeason());

    // Verificar cada día a medianoche si cambió la temporada
    const checkDaily = setInterval(() => {
      setIsChristmasSeason(checkChristmasSeason());
    }, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(checkDaily);
  }, []);

  // Generar copos de nieve
  const generateSnowflakes = () => {
    const snowflakes = [];
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 25;

    for (let i = 0; i < count; i++) {
      const leftPosition = Math.random() * 100;
      const animationDuration = 10 + Math.random() * 20;
      const animationDelay = Math.random() * 10;
      const fontSize = 0.5 + Math.random() * 1.5;

      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${leftPosition}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
            fontSize: `${fontSize}em`,
          }}
        >
          ❄
        </div>
      );
    }
    return snowflakes;
  };

  if (!isChristmasSeason) return null;

  return (
    <>
      {/* Nieve cayendo - decoración minimalista y elegante */}
      <div className="snow-container" aria-hidden="true">
        {generateSnowflakes()}
      </div>
    </>
  );
}
