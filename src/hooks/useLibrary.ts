/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Library } from '@/domain/library.model';
import { Rating } from '@/domain/rating.model';
import useSWR from 'swr';
import { getLibrary } from '@/service/library.service';

interface useLibraryProps {
  data: Library | undefined;
  isLoading: boolean;
}

export function useLibrary(): useLibraryProps {
  const {
    data: library,
    isLoading,
    error,
  } = useSWR<Library>('/api/auth/rating', getLibrary);

  return {
    data: library,
    isLoading: isLoading,
  };
}
