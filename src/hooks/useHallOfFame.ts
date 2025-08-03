import useSWR from 'swr';
import { hallOfFame } from '@/domain/hallOfFame.model';
import fetchHallOfFame from '@/app/actions/book/halloffame/fetchHallOfFame';
import Book from '@/domain/book.model';

interface useHallOfFameProps {
  data: hallOfFame | null;
  isLoading: boolean;
  error: Error | null;
  quote: string;
  books?: Book[];
}

export function useHallOfFame(userId: string): useHallOfFameProps {
  const { data, isLoading, error } = useSWR(
    `/api/public/accounts/halloffame/${userId}`,
    () => fetchHallOfFame(userId)
  );

  console.log(data);

  const quote = data?.quote || '';
  const books = data?.books || [];
  console.log(data);

  return {
    data: data || null,
    isLoading,
    error,
    quote,
    books,
  };
}
