import { useEffect, useState } from 'react';
import { useBiography } from '@/hooks/useBiography';
import { User } from '@/domain/user.model';

/**
 * Hook de UI para manejar el estado de edición de la biografía en el perfil.
 *
 * Este hook es responsable únicamente de:
 * - Manejar el modo de edición (isEditing)
 * - Mantener el valor temporal durante la edición
 * - Sincronizar con el estado global del usuario
 * - Coordinar las acciones de guardar/cancelar
 *
 * NO maneja la lógica de actualización de datos - eso lo hace useBiography.
 *
 * Patrón de sincronización:
 * 1. El usuario entra en modo edición
 * 2. El valor temporal se inicializa desde el usuario global
 * 3. El usuario modifica el valor temporal
 * 4. Al guardar, se llama a useBiography que hace el optimistic update
 * 5. El usuario global se actualiza automáticamente por SWR
 * 6. Este hook detecta el cambio y se sincroniza
 *
 * Este patrón es reutilizable para otros campos editables.
 */

interface UseProfileBiographyReturn {
  biography: string;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  isUpdatedBiography: boolean;
  isErrorBiography: boolean;
  handleBiographyChange: (newBiography: string) => void;
  handleBiographySave: () => Promise<void>;
  handleEditBiography: () => void;
  handleCancelBiography: () => void;
  setIsUpdatedBiography: (value: boolean) => void;
  setIsErrorBiography: (value: boolean) => void;
}

export function useProfileBiography(
  user: User | null
): UseProfileBiographyReturn {
  const {
    handleUpdateBiography,
    setIsUpdated: setIsUpdatedBiography,
    isLoading: isLoadingBiography,
    isUpdated: isUpdatedBiography,
    isError: isErrorBiography,
    setIsError: setIsErrorBiography,
  } = useBiography();

  // Estado de UI: modo de edición
  const [isEditingBiography, setIsEditingBiography] = useState(false);

  // Estado temporal durante la edición
  const [biography, setBiography] = useState(user?.biography || '');

  /**
   * Sincroniza el estado local con el usuario global.
   * Solo actualiza si NO estamos en modo edición para no sobrescribir
   * lo que el usuario está escribiendo.
   */
  useEffect(() => {
    if (!isEditingBiography && user?.biography !== undefined) {
      setBiography(user.biography);
    }
  }, [user?.biography, isEditingBiography]);

  /**
   * Actualiza el valor temporal durante la edición.
   */
  const handleBiographyChange = (newBiography: string) => {
    setBiography(newBiography);
  };

  /**
   * Guarda la biografía.
   * El optimistic update se maneja en useBiography,
   * aquí solo coordinamos la UI.
   */
  const handleBiographySave = async () => {
    try {
      await handleUpdateBiography(biography || '');
      // Sale del modo edición solo si fue exitoso
      // Si hay error, useBiography setea isError y el usuario puede reintentar
      if (!isErrorBiography) {
        setIsEditingBiography(false);
      }
    } catch (error) {
      // El error ya se maneja en useBiography
      console.error(
        '[useProfileBiography] Error in handleBiographySave:',
        error
      );
    }
  };

  /**
   * Entra en modo edición.
   */
  const handleEditBiography = () => {
    // Sincroniza con el valor actual del usuario antes de editar
    setBiography(user?.biography || '');
    setIsEditingBiography(true);
  };

  /**
   * Cancela la edición y revierte al valor del usuario global.
   */
  const handleCancelBiography = () => {
    setBiography(user?.biography || '');
    setIsEditingBiography(false);
    setIsErrorBiography(false);
  };

  return {
    biography,
    isEditingBiography,
    isLoadingBiography,
    isUpdatedBiography,
    isErrorBiography,
    handleBiographyChange,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsUpdatedBiography,
    setIsErrorBiography,
  };
}
