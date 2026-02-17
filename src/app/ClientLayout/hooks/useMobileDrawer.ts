import { useState, useCallback } from 'react';

/**
 * Hook para manejar el estado del drawer móvil.
 *
 * Handlers memoizados con useCallback para que MobileDrawer
 * (envuelto en React.memo) no se re-renderice innecesariamente.
 */
export const useMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    close,
  };
};
