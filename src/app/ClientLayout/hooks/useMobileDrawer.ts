import { useState } from 'react';

/**
 * Hook para manejar el estado del drawer móvil
 */
export const useMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggle,
    close,
  };
};
