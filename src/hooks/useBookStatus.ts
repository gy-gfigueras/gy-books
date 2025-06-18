/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import bookStatus from '@/domain/bookStatus';
import { useUser } from '@auth0/nextjs-auth0/client';
import getBookStatus from '@/app/actions/getBookStatus';

interface useBookStatusProps {
  data: bookStatus | null;
  isLoading: boolean;
  error: Error | null;
}

export function useBookStatus(id: string): useBookStatusProps {
  const user = useUser();
  const { data, isLoading, error } = useSWR(
    id ? `/api/auth/books/${id}` : null,
    () => getBookStatus(id),
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
