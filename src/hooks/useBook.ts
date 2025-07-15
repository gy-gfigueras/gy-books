/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import Book from '@/domain/book.model';
import fetchBookById from '@/app/actions/book/fetchBookById';

interface useBookProps {
  data: Book | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useBook(id: string): useBookProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/books/${id}` : null,
    () => fetchBookById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );
  console.log(data);

  return {
    data,
    isLoading,
    error,
  };
}
