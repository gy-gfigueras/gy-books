/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';

interface useFeedProps {
  data: feedActivity[];
  isLoading: boolean;
  error: Error | null;
}

export function useBook(id: string): useFeedProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/auth/books/activity` : null,
    () => fetchBookById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data as feedActivity[],
    isLoading,
    error,
  };
}
