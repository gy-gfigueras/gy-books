import HardcoverBook from '@/domain/HardcoverBook';
import { useMemo, useState } from 'react';

export type BooksSortBy =
  | 'relevance'
  | 'rating_desc'
  | 'title_asc'
  | 'title_desc';
export type BooksSeriesFilter = 'all' | 'series_only' | 'standalone';

export interface BooksFiltersState {
  author: string;
  series: BooksSeriesFilter;
  sortBy: BooksSortBy;
}

export interface BooksFilterOptions {
  authorOptions: string[];
}

export interface UseBooksFiltersResult {
  filters: BooksFiltersState;
  filteredBooks: HardcoverBook[];
  filterOptions: BooksFilterOptions;
  activeFiltersCount: number;
  setAuthor: (author: string) => void;
  setSeries: (series: BooksSeriesFilter) => void;
  setSortBy: (sortBy: BooksSortBy) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: BooksFiltersState = {
  author: '',
  series: 'all',
  sortBy: 'relevance',
};

export function useBooksFilters(books: HardcoverBook[]): UseBooksFiltersResult {
  const [filters, setFilters] = useState<BooksFiltersState>(DEFAULT_FILTERS);

  const filterOptions = useMemo<BooksFilterOptions>(() => {
    const authors = Array.from(
      new Set(books.map((b) => b.author?.name).filter(Boolean))
    ).sort() as string[];

    return { authorOptions: authors };
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (filters.author) {
      result = result.filter((b) => b.author?.name === filters.author);
    }

    if (filters.series === 'series_only') {
      result = result.filter((b) => b.series && b.series.length > 0);
    } else if (filters.series === 'standalone') {
      result = result.filter((b) => !b.series || b.series.length === 0);
    }

    if (filters.sortBy === 'rating_desc') {
      result = result.sort(
        (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
      );
    } else if (filters.sortBy === 'title_asc') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'title_desc') {
      result = result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [books, filters]);

  const activeFiltersCount = [
    filters.author !== '',
    filters.series !== 'all',
    filters.sortBy !== 'relevance',
  ].filter(Boolean).length;

  const setAuthor = (author: string) => setFilters((f) => ({ ...f, author }));
  const setSeries = (series: BooksSeriesFilter) =>
    setFilters((f) => ({ ...f, series }));
  const setSortBy = (sortBy: BooksSortBy) =>
    setFilters((f) => ({ ...f, sortBy }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    filters,
    filteredBooks,
    filterOptions,
    activeFiltersCount,
    setAuthor,
    setSeries,
    setSortBy,
    resetFilters,
  };
}
