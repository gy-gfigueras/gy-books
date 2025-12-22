import type { Variants } from 'framer-motion';

/**
 * Hook personalizado para obtener las variantes de animación de Framer Motion
 * reutilizables en toda la aplicación
 */
export const useAnimations = () => {
  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  };

  const containerStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemFadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const backgroundGradient: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  return {
    fadeInUp,
    fadeIn,
    scaleIn,
    containerStagger,
    itemFadeInUp,
    backgroundGradient,
  };
};
