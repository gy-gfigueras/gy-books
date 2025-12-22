import { Box } from '@mui/material';
import { BooksFilter } from '@/app/profile/components/BooksFilter/BooksFilter';
import { BooksList } from '@/app/profile/components/BooksList/BooksList';
import { EBookStatus, Book } from '@gycoding/nebula';

interface BooksTabProps {
  filteredBooks: Book[];
  hasMore: boolean;
  statusOptions: { label: string; value: EBookStatus }[];
  statusFilter: EBookStatus | null;
  authorOptions: string[];
  seriesOptions: string[];
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  onStatusChange: (status: EBookStatus | null) => void;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: string) => void;
  onRatingChange: (rating: number) => void;
  onSearchChange: (search: string) => void;
  onOrderByChange: (orderBy: string) => void;
  onOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}

/**
 * Tab de libros con filtros y lista
 * Contiene BooksFilter y BooksList components
 */
export const BooksTab = ({
  filteredBooks,
  hasMore,
  statusOptions,
  statusFilter,
  authorOptions,
  seriesOptions,
  authorFilter,
  seriesFilter,
  ratingFilter,
  search,
  orderBy,
  orderDirection,
  onStatusChange,
  onAuthorChange,
  onSeriesChange,
  onRatingChange,
  onSearchChange,
  onOrderByChange,
  onOrderDirectionChange,
}: BooksTabProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 4,
        width: '100%',
      }}
    >
      <BooksFilter
        statusOptions={statusOptions}
        statusFilter={statusFilter}
        authorOptions={authorOptions}
        seriesOptions={seriesOptions}
        authorFilter={authorFilter}
        seriesFilter={seriesFilter}
        ratingFilter={ratingFilter}
        search={search}
        onStatusChange={onStatusChange}
        onAuthorChange={onAuthorChange}
        onSeriesChange={onSeriesChange}
        onRatingChange={onRatingChange}
        onSearchChange={onSearchChange}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onOrderByChange={onOrderByChange}
        onOrderDirectionChange={onOrderDirectionChange}
      />
      <BooksList books={filteredBooks} hasMore={hasMore} />
    </Box>
  );
};
