import { useState, useCallback } from 'react';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { UUID } from 'crypto';

/**
 * Hook para manejar el panel de solicitudes de amistad.
 * Centraliza la lógica de apertura/cierre y manejo de estados.
 *
 * Optimizaciones:
 * - Eliminado `useFriendRequestsCount` (dato duplicado: useFriendRequests ya devuelve count)
 * - Handlers memoizados con useCallback para evitar re-renders en componentes hijos
 * - El toggle/close NO depende de datos async: el panel se abre/cierra inmediatamente
 */
export const useFriendRequestsPanel = (userId: UUID | undefined) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading: isLoadingRequests,
    isLoadingUsers,
    friendRequestsWithUsers,
    isLoadingManageRequest,
    errorManageRequest,
    setErrorManageRequest,
    isSuccessManageRequest,
    setIsSuccessManageRequest,
    handleManageRequest,
    count,
  } = useFriendRequests(userId as UUID);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCloseErrorAlert = useCallback(() => {
    setErrorManageRequest(false);
  }, [setErrorManageRequest]);

  const handleCloseSuccessAlert = useCallback(() => {
    setIsSuccessManageRequest(false);
  }, [setIsSuccessManageRequest]);

  return {
    isOpen,
    count,
    toggle,
    close,
    isLoadingRequests,
    isLoadingUsers,
    friendRequestsWithUsers,
    isLoadingManageRequest,
    errorManageRequest,
    isSuccessManageRequest,
    handleManageRequest,
    handleCloseErrorAlert,
    handleCloseSuccessAlert,
  };
};
