/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { Rating } from '@/domain/rating.model';
import getBookRating from '@/service/rating.service';

interface useBookRatingProps {
  data: Rating | null;
  isLoading: boolean;
  error: Error | null;
}

export function useRating(id: string): useBookRatingProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/auth/rating/${id}` : null,
    getBookRating,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || null,
    isLoading,
    error,
  };
}
