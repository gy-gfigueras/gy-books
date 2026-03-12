import updateHallOfFame from '@/app/actions/book/halloffame/updateHallOfFame';
import { hallOfFame } from '@/domain/hallOfFame.model';
import { useState } from 'react';
import { mutate } from 'swr';

interface useUpdateHallOfFameProps {
  handleUpdateHallOfFame: (
    formData: FormData
  ) => Promise<hallOfFame | undefined>;
  isLoading: boolean;
  isUpdated: boolean;
  isError: boolean;
  setIsUpdated: (isUpdated: boolean) => void;
  setIsError: (isError: boolean) => void;
}

const hallOfFameCacheKey = (userId: string) =>
  `/api/public/accounts/halloffame/${userId}`;

export function useUpdateHallOfFame(userId: string): useUpdateHallOfFameProps {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleUpdateHallOfFame = async (
    formData: FormData
  ): Promise<hallOfFame | undefined> => {
    const quote = formData.get('quote') as string;
    const cacheKey = hallOfFameCacheKey(userId);

    setIsLoading(true);
    setIsError(false);
    setIsUpdated(false);

    // Optimistic update: el usuario ve el cambio de inmediato
    await mutate(
      cacheKey,
      (current: hallOfFame | undefined) =>
        current ? { ...current, quote } : current,
      { revalidate: false }
    );

    try {
      const data = await updateHallOfFame(formData);
      setIsUpdated(true);
      // Sincronizar con el servidor para asegurar consistencia
      await mutate(cacheKey);
      return data as unknown as hallOfFame;
    } catch (error) {
      console.error('Error updating Hall of Fame quote:', error);
      // Rollback: revertir al valor del servidor
      await mutate(cacheKey);
      setIsError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateHallOfFame,
    isLoading,
    isUpdated,
    isError,
    setIsUpdated,
    setIsError,
  };
}
