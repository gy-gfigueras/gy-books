import { useState, useCallback, useRef } from 'react';
import { useBiography } from '@/hooks/useBiography';
import { User } from '@/domain/user.model';

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

  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [localBiography, setLocalBiography] = useState('');

  // Usamos un ref para saber si estamos en modo edición sin causar re-renders
  const isEditingRef = useRef(false);

  const handleBiographyChange = useCallback((newBiography: string) => {
    setLocalBiography(newBiography);
  }, []);

  const handleBiographySave = useCallback(async () => {
    try {
      await handleUpdateBiography(localBiography);
      if (!isErrorBiography) {
        isEditingRef.current = false;
        setIsEditingBiography(false);
      }
    } catch (error) {
      console.error('[useProfileBiography] Error saving biography:', error);
    }
  }, [localBiography, handleUpdateBiography, isErrorBiography]);

  const handleEditBiography = useCallback(() => {
    const initialValue = user?.biography || '';
    setLocalBiography(initialValue);
    isEditingRef.current = true;
    setIsEditingBiography(true);
  }, [user?.biography]);

  const handleCancelBiography = useCallback(() => {
    isEditingRef.current = false;
    setIsEditingBiography(false);
    setIsErrorBiography(false);
  }, [setIsErrorBiography]);

  // Devolvemos el valor correcto según el modo
  // Durante la edición: localBiography
  // Fuera de edición: user?.biography
  const biography = isEditingBiography ? localBiography : user?.biography || '';

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
