import queryAuthors, {
  AuthorSearchResult,
} from '@/app/actions/book/queryAuthors';
import queryBooks from '@/app/actions/book/queryBooks';
import HardcoverBook from '@/domain/HardcoverBook';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type SearchMode = 'books' | 'authors';

interface UseBooksSearchResult {
  query: string;
  setQuery: (q: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  books: HardcoverBook[];
  authors: AuthorSearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function useBooksSearch(): UseBooksSearchResult {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchMode, setSearchMode] = useState<SearchMode>('books');
  const [books, setBooks] = useState<HardcoverBook[]>([]);
  const [authors, setAuthors] = useState<AuthorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setBooks([]);
        setAuthors([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      setBooks([]);
      setAuthors([]);

      try {
        if (searchMode === 'books') {
          const formData = new FormData();
          formData.append('title', debouncedQuery);
          const result = await queryBooks(formData);
          setBooks(result as HardcoverBook[]);
        } else {
          const result = await queryAuthors(debouncedQuery);
          setAuthors(result);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, searchMode]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    router.replace(`/books?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return {
    query,
    setQuery,
    searchMode,
    setSearchMode,
    books,
    authors,
    isLoading,
    hasSearched,
  };
}
