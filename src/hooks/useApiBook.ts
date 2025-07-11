/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { ApiBook } from '@/domain/apiBook.model';
import getApiBook from '@/app/actions/book/fetchApiBook';

interface useApiBookProps {
  data: ApiBook | null;
  isLoading: boolean;
  error: Error | null;
}

export function useApiBook(id: string): useApiBookProps {
  const { data, isLoading, error } = useSWR(id ? id : null, getApiBook, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    data: data || null,
    isLoading,
    error,
  };
}
