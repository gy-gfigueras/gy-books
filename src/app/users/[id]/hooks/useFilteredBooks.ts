import { useMemo } from 'react';
import { Book } from '@gycoding/nebula';
import { EBookStatus } from '@gycoding/nebula';

interface UseFilteredBooksProps {
  books: Book[];
  statusFilter: EBookStatus | null;
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

/**
 * Hook para filtrar y ordenar libros según los criterios seleccionados
 * Optimizado con useMemo para evitar recalcular en cada render
 */
export const useFilteredBooks = ({
  books,
  statusFilter,
  authorFilter,
  seriesFilter,
  ratingFilter,
  search,
  orderBy,
  orderDirection,
}: UseFilteredBooksProps) => {
  // Opciones únicas de autores
  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.author && b.author.name && b.author.name.trim() !== '')
        set.add(b.author.name);
    });
    return Array.from(set).sort();
  }, [books]);

  // Opciones únicas de series
  const seriesOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (
        b.series &&
        b.series.length > 0 &&
        b.series[0]?.name &&
        b.series[0].name.trim() !== ''
      )
        set.add(b.series[0].name);
    });
    return Array.from(set).sort();
  }, [books]);

  // Filtrar y ordenar libros
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const statusOk = !statusFilter || book.status === statusFilter;
      const authorOk =
        !authorFilter || (book.author && book.author.name === authorFilter);
      const seriesOk =
        !seriesFilter ||
        (book.series &&
          book.series.length > 0 &&
          book.series[0]?.name === seriesFilter);
      const ratingOk =
        !ratingFilter ||
        (typeof book.userData?.rating === 'number' &&
          book.userData.rating >= ratingFilter);
      const searchOk =
        !search ||
        (book.title &&
          book.title.toLowerCase().includes(search.toLowerCase())) ||
        (book.author &&
          book.author.name &&
          book.author.name.toLowerCase().includes(search.toLowerCase())) ||
        (book.series &&
          book.series.length > 0 &&
          book.series[0]?.name?.toLowerCase().includes(search.toLowerCase()));
      return statusOk && authorOk && seriesOk && ratingOk && searchOk;
    });

    // Ordenar si hay orderBy
    if (orderBy) {
      result = result.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (orderBy) {
          case 'author':
            aValue = a.author?.name || '';
            bValue = b.author?.name || '';
            break;
          case 'series':
            aValue = a.series?.[0]?.name || '';
            bValue = b.series?.[0]?.name || '';
            break;
          case 'rating':
            aValue =
              typeof a.userData?.rating === 'number' ? a.userData.rating : 0;
            bValue =
              typeof b.userData?.rating === 'number' ? b.userData.rating : 0;
            break;
          case 'title':
            aValue = a.title || '';
            bValue = b.title || '';
            break;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (orderDirection === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        } else {
          if (orderDirection === 'asc') {
            return (aValue as number) - (bValue as number);
          } else {
            return (bValue as number) - (aValue as number);
          }
        }
      });
    }

    return result;
  }, [
    books,
    statusFilter,
    authorFilter,
    seriesFilter,
    ratingFilter,
    search,
    orderBy,
    orderDirection,
  ]);

  return {
    authorOptions,
    seriesOptions,
    filteredBooks,
  };
};
