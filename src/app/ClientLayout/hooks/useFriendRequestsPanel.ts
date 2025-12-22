import { useState } from 'react';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useFriendRequestsCount } from '@/hooks/useFriendRequestsCount';
import { UUID } from 'crypto';

/**
 * Hook para manejar el panel de solicitudes de amistad
 * Centraliza la lógica de apertura/cierre y manejo de estados
 */
export const useFriendRequestsPanel = (userId: UUID | undefined) => {
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useFriendRequestsCount(userId as UUID);

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
  } = useFriendRequests(userId as UUID);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleCloseErrorAlert = () => {
    setErrorManageRequest(false);
  };

  const handleCloseSuccessAlert = () => {
    setIsSuccessManageRequest(false);
  };

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
