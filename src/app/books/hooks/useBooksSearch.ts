import queryBooks from '@/app/actions/book/queryBooks';
import HardcoverBook from '@/domain/HardcoverBook';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseBooksSearchResult {
  query: string;
  setQuery: (q: string) => void;
  books: HardcoverBook[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function useBooksSearch(): UseBooksSearchResult {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState<HardcoverBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedQuery.trim()) {
        setBooks([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const formData = new FormData();
        formData.append('title', debouncedQuery);
        const result = await queryBooks(formData);
        setBooks(result as HardcoverBook[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    router.replace(`/books?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return { query, setQuery, books, isLoading, hasSearched };
}
