import { useState, useEffect } from 'react';

/**
 * Hook para detectar el scroll y aplicar estilos al header
 * @returns scrolled - true si el usuario ha scrolleado más de 20px
 */
export const useHeaderScroll = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrolled };
};
