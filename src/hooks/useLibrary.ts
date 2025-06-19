/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Book from '@/domain/book.model';
import { Library } from '@/domain/library.model';
import { getBooks } from '@/service/books.service';
import useSWR from 'swr';

interface useLibraryProps {
  data: Book[] | undefined;
  isLoading: boolean;
}

export function useLibrary(): useLibraryProps {
  const {
    data: books,
    isLoading,
    error,
  } = useSWR<Book[]>('/api/auth/books', getBooks);
  return {
    data: books,
    isLoading: isLoading,
  };
}
