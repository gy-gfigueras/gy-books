import { lora } from '@/utils/fonts/fonts';
import { Box, Typography, Chip } from '@mui/material';
import { BooksFilter } from '../BooksFilter/BooksFilter';
import { BooksList, ViewType } from '../BooksList/BooksList';
import { BooksListSkeleton } from '../BooksList/BooksListSkeleton';
import { UserProfileBook } from '@/domain/user.model';
import { useState } from 'react';

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
}) {
  const [view, setView] = useState<ViewType>('grid');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Filters Section - Sticky */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#000',
          paddingTop: 4,
          paddingBottom: 2,
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
          view={view}
          onViewChange={setView}
        />
      </Box>

      {/* Books Content - Scrollable */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          paddingRight: { xs: 0, sm: 1 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(147, 51, 234, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #9333ea 0%, #a855f7 100%)',
            borderRadius: '4px',
            '&:hover': {
              background: 'linear-gradient(180deg, #7e22ce 0%, #9333ea 100%)',
            },
          },
        }}
      >
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
          <BooksList books={filteredBooks} hasMore={hasMore} view={view} />
        )}
      </Box>
    </Box>
  );
}
