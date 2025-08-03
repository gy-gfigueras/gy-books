/* eslint-disable @typescript-eslint/no-unused-vars */
import updateHallOfFame from '@/app/actions/book/halloffame/updateHallOfFame';
import { hallOfFame } from '@/domain/hallOfFame.model';
import updateQuote from '@/app/actions/book/halloffame/updateHallOfFame';
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

export function useUpdateHallOfFame(): useUpdateHallOfFameProps {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleUpdateHallOfFame = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const data = await updateHallOfFame(formData);
      setIsUpdated(true);
      mutate('/api/public/accounts/halloffame');
      return data as unknown as hallOfFame;
    } catch (error) {
      setIsError(true);
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
