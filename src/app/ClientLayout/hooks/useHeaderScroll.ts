import { useState, useEffect, useRef } from 'react';

/**
 * Hook para detectar el scroll y aplicar estilos al header.
 *
 * Optimizado con requestAnimationFrame para evitar disparar setState
 * en cada pixel de scroll. Solo actualiza cuando cruza el umbral.
 *
 * @returns scrolled - true si el usuario ha scrolleado más de 20px
 */
export const useHeaderScroll = () => {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => {
            // Solo actualiza si el estado cambió (cruce de umbral)
            if (prev !== isScrolled) return isScrolled;
            return prev;
          });
          ticking.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrolled };
};
