import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { BooksFilter } from '../BooksFilter/BooksFilter';
import { BooksList } from '../BooksList/BooksList';
import { BooksListSkeleton } from '../BooksList/BooksListSkeleton';
import { UserProfileBook } from '@/domain/user.model';

interface BooksTabProps {
  books: UserProfileBook[];
  filteredBooks: UserProfileBook[];
  loading: boolean;
  hasMore: boolean;
  filterOptions: {
    statusOptions: string[];
    authorOptions: string[];
    seriesOptions: string[];
  };
  filters: {
    status: string;
    author: string;
    series: string;
    rating: number | null;
    search: string;
    orderBy: string;
    orderDirection: 'asc' | 'desc';
    handleStatusFilterChange: (status: string) => void;
    handleAuthorFilterChange: (author: string) => void;
    handleSeriesFilterChange: (series: string) => void;
    handleRatingFilterChange: (rating: number | null) => void;
    handleSearchChange: (search: string) => void;
    handleOrderByChange: (orderBy: string) => void;
    handleOrderDirectionChange: (direction: 'asc' | 'desc') => void;
  };
}

export function BooksTab({
  books,
  filteredBooks,
  loading,
  hasMore,
  filterOptions,
  filters,
}: BooksTabProps) {
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
        statusOptions={filterOptions.statusOptions}
        statusFilter={filters.status}
        authorOptions={filterOptions.authorOptions}
        seriesOptions={filterOptions.seriesOptions}
        authorFilter={filters.author}
        seriesFilter={filters.series}
        ratingFilter={filters.rating}
        search={filters.search}
        onStatusChange={filters.handleStatusFilterChange}
        onAuthorChange={filters.handleAuthorFilterChange}
        onSeriesChange={filters.handleSeriesFilterChange}
        onRatingChange={filters.handleRatingFilterChange}
        onSearchChange={filters.handleSearchChange}
        orderBy={filters.orderBy}
        orderDirection={filters.orderDirection}
        onOrderByChange={filters.handleOrderByChange}
        onOrderDirectionChange={filters.handleOrderDirectionChange}
      />

      {loading && books.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 60,
            width: '100%',
          }}
        >
          <BooksListSkeleton />
        </Box>
      ) : books.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
            width: '100%',
          }}
        >
          <Typography
            sx={{ font: lora.style.fontFamily }}
            color="white"
            variant="h6"
          >
            You don&apos;t have any books in your library yet
          </Typography>
        </Box>
      ) : (
        <BooksList books={filteredBooks} hasMore={hasMore} />
      )}
    </Box>
  );
}
