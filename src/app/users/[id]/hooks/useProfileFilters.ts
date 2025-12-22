import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EBookStatus } from '@gycoding/nebula';

interface FilterState {
  statusFilter: EBookStatus | null;
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

/**
 * Hook para manejar todos los filtros de libros y sincronización con URL
 * Centraliza la lógica de filtrado, ordenamiento y persistencia en query params
 */
export const useProfileFilters = (userId: string) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener valores iniciales del URL
  const urlStatus = searchParams.get('status');
  const urlAuthor = searchParams.get('author');
  const urlSeries = searchParams.get('series');
  const urlRating = searchParams.get('rating');
  const urlSearch = searchParams.get('search') || '';
  const urlOrderBy = searchParams.get('orderBy') || 'rating';
  const urlOrderDirection = searchParams.get('orderDirection') || 'desc';

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<EBookStatus | null>(
    urlStatus && Object.values(EBookStatus).includes(urlStatus as EBookStatus)
      ? (urlStatus as EBookStatus)
      : null
  );
  const [authorFilter, setAuthorFilter] = useState(urlAuthor || '');
  const [seriesFilter, setSeriesFilter] = useState(urlSeries || '');
  const [ratingFilter, setRatingFilter] = useState(
    urlRating ? Number(urlRating) : 0
  );
  const [search, setSearch] = useState(urlSearch);
  const [orderBy, setOrderBy] = useState<string>(urlOrderBy);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(
    urlOrderDirection as 'asc' | 'desc'
  );

  // Actualizar URL con todos los filtros
  const updateUrl = useCallback(
    (filters: Partial<FilterState>) => {
      const paramsUrl = new URLSearchParams(searchParams.toString());

      if (filters.statusFilter) {
        paramsUrl.set('status', filters.statusFilter);
      } else if (filters.statusFilter === null) {
        paramsUrl.delete('status');
      }

      if (filters.authorFilter) {
        paramsUrl.set('author', filters.authorFilter);
      } else if (filters.authorFilter === '') {
        paramsUrl.delete('author');
      }

      if (filters.seriesFilter) {
        paramsUrl.set('series', filters.seriesFilter);
      } else if (filters.seriesFilter === '') {
        paramsUrl.delete('series');
      }

      if (filters.ratingFilter && filters.ratingFilter > 0) {
        paramsUrl.set('rating', String(filters.ratingFilter));
      } else {
        paramsUrl.delete('rating');
      }

      if (filters.search) {
        paramsUrl.set('search', filters.search);
      } else if (filters.search === '') {
        paramsUrl.delete('search');
      }

      if (filters.orderBy) {
        paramsUrl.set('orderBy', filters.orderBy);
      } else {
        paramsUrl.delete('orderBy');
      }

      if (filters.orderDirection) {
        paramsUrl.set('orderDirection', filters.orderDirection);
      } else {
        paramsUrl.delete('orderDirection');
      }

      router.replace(`/users/${userId}?${paramsUrl.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, userId]
  );

  // Handlers individuales
  const handleStatusFilterChange = useCallback(
    (newStatus: EBookStatus | null) => {
      setStatusFilter(newStatus);
      updateUrl({
        statusFilter: newStatus,
        authorFilter,
        seriesFilter,
        ratingFilter,
      });
    },
    [authorFilter, seriesFilter, ratingFilter, updateUrl]
  );

  const handleAuthorFilterChange = useCallback(
    (newAuthor: string) => {
      setAuthorFilter(newAuthor);
      updateUrl({
        statusFilter,
        authorFilter: newAuthor,
        seriesFilter,
        ratingFilter,
      });
    },
    [statusFilter, seriesFilter, ratingFilter, updateUrl]
  );

  const handleSeriesFilterChange = useCallback(
    (newSeries: string) => {
      setSeriesFilter(newSeries);
      updateUrl({
        statusFilter,
        authorFilter,
        seriesFilter: newSeries,
        ratingFilter,
      });
    },
    [statusFilter, authorFilter, ratingFilter, updateUrl]
  );

  const handleRatingFilterChange = useCallback(
    (newRating: number) => {
      setRatingFilter(newRating);
      updateUrl({
        statusFilter,
        authorFilter,
        seriesFilter,
        ratingFilter: newRating,
      });
    },
    [statusFilter, authorFilter, seriesFilter, updateUrl]
  );

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      updateUrl({
        statusFilter,
        authorFilter,
        seriesFilter,
        ratingFilter,
        search: newSearch,
      });
    },
    [statusFilter, authorFilter, seriesFilter, ratingFilter, updateUrl]
  );

  const handleOrderByChange = useCallback(
    (newOrderBy: string) => {
      setOrderBy(newOrderBy);
      updateUrl({
        statusFilter,
        authorFilter,
        seriesFilter,
        ratingFilter,
        search,
        orderBy: newOrderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderDirection,
      updateUrl,
    ]
  );

  const handleOrderDirectionChange = useCallback(
    (newDirection: 'asc' | 'desc') => {
      setOrderDirection(newDirection);
      updateUrl({
        statusFilter,
        authorFilter,
        seriesFilter,
        ratingFilter,
        search,
        orderBy,
        orderDirection: newDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderBy,
      updateUrl,
    ]
  );

  // Sincronizar con cambios del navegador (back/forward)
  useEffect(() => {
    const currentUrlStatus = searchParams.get('status');
    const newStatus =
      currentUrlStatus &&
      Object.values(EBookStatus).includes(currentUrlStatus as EBookStatus)
        ? (currentUrlStatus as EBookStatus)
        : null;
    if (newStatus !== statusFilter) {
      setStatusFilter(newStatus);
    }

    const currentUrlAuthor = searchParams.get('author') || '';
    if (currentUrlAuthor !== authorFilter) {
      setAuthorFilter(currentUrlAuthor);
    }

    const currentUrlSeries = searchParams.get('series') || '';
    if (currentUrlSeries !== seriesFilter) {
      setSeriesFilter(currentUrlSeries);
    }

    const currentUrlRating = searchParams.get('rating');
    const newRating = currentUrlRating ? Number(currentUrlRating) : 0;
    if (newRating !== ratingFilter) {
      setRatingFilter(newRating);
    }

    const currentUrlSearch = searchParams.get('search') || '';
    if (currentUrlSearch !== search) {
      setSearch(currentUrlSearch);
    }
  }, [
    searchParams,
    statusFilter,
    authorFilter,
    seriesFilter,
    ratingFilter,
    search,
  ]);

  return {
    statusFilter,
    authorFilter,
    seriesFilter,
    ratingFilter,
    search,
    orderBy,
    orderDirection,
    handleStatusFilterChange,
    handleAuthorFilterChange,
    handleSeriesFilterChange,
    handleRatingFilterChange,
    handleSearchChange,
    handleOrderByChange,
    handleOrderDirectionChange,
  };
};
