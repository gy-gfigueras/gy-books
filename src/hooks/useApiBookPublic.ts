/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { ApiBook } from '@/domain/apiBook.model';
import getApiBookPublic from '@/app/actions/book/fetchApiBookPublic';

interface useApiBookPublicProps {
  data: ApiBook | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (
    data?: ApiBook | null,
    options?: { revalidate?: boolean }
  ) => Promise<ApiBook | null | undefined>;
}

export function useApiBookPublic(id: string): useApiBookPublicProps {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/public/book/${id}`,
    () => getApiBookPublic(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || null,
    isLoading,
    error,
    mutate,
  };
}
