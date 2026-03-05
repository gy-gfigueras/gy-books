'use client';

import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { BooksEmptyState } from './components/BooksEmptyState/BooksEmptyState';
import { BooksFilters } from './components/BooksFilters/BooksFilters';
import { BooksGrid } from './components/BooksGrid/BooksGrid';
import { BooksSearchBar } from './components/BooksSearchBar/BooksSearchBar';
import { useBooksFilters } from './hooks/useBooksFilters';
import { useBooksSearch } from './hooks/useBooksSearch';

const MotionBox = motion(Box);

const HERO_GLOW_SX = {
  position: 'absolute' as const,
  borderRadius: '50%',
  filter: 'blur(80px)',
  pointerEvents: 'none',
};

function BooksHero({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 7, md: 10 },
        pb: { xs: 3, sm: 5, md: 9 },
        gap: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Eyebrow label */}
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          px: 2,
          py: 0.5,
          borderRadius: '100px',
          border: '1px solid rgba(147,51,234,0.3)',
          background: 'rgba(147,51,234,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: '#c084fc',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Book Discovery
        </Typography>
      </MotionBox>

      {/* Main title */}
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ textAlign: 'center', px: 2 }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '2.8rem', sm: '4.5rem', md: '6rem', lg: '7.5rem' },
            lineHeight: 1,
            fontWeight: 700,
            background:
              'linear-gradient(135deg, #ffffff 20%, #c084fc 60%, #818cf8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            paddingBottom: 2,
          }}
        >
          Library
        </Typography>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            color: 'rgba(255,255,255,0.4)',
            mt: { xs: 0.5, md: 1 },
            letterSpacing: '0.02em',
          }}
        >
          Search millions of books, authors &amp; series
        </Typography>
      </MotionBox>

      {/* Search bar */}
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ width: '100%', mt: { xs: 1, sm: 2 } }}
      >
        <BooksSearchBar value={query} onChange={onQueryChange} />
      </MotionBox>
    </Box>
  );
}

function BooksContent() {
  const { query, setQuery, books, isLoading, hasSearched } = useBooksSearch();
  const {
    filters,
    filteredBooks,
    filterOptions,
    activeFiltersCount,
    setAuthor,
    setSeries,
    setSortBy,
    resetFilters,
  } = useBooksFilters(books);

  const showResults = isLoading || filteredBooks.length > 0;
  const showEmpty = !isLoading && hasSearched && filteredBooks.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      {/* Background glows */}
      <Box
        sx={{
          ...HERO_GLOW_SX,
          top: '0%',
          left: '10%',
          width: 600,
          height: 500,
          background:
            'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          ...HERO_GLOW_SX,
          top: '5%',
          right: '5%',
          width: 500,
          height: 450,
          background:
            'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <BooksHero query={query} onQueryChange={setQuery} />

      {/* Results section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', xl: '1400px' },
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {(hasSearched || isLoading) && (
          <BooksFilters
            filters={filters}
            filterOptions={filterOptions}
            activeFiltersCount={activeFiltersCount}
            resultsCount={filteredBooks.length}
            onAuthorChange={setAuthor}
            onSeriesChange={setSeries}
            onSortByChange={setSortBy}
            onReset={resetFilters}
          />
        )}

        {showResults && (
          <BooksGrid books={filteredBooks} isLoading={isLoading} />
        )}
        {showEmpty && (
          <BooksEmptyState
            hasSearched={hasSearched}
            hasActiveFilters={activeFiltersCount > 0}
            onResetFilters={resetFilters}
          />
        )}
        {!hasSearched && !isLoading && (
          <BooksEmptyState
            hasSearched={false}
            hasActiveFilters={false}
            onResetFilters={resetFilters}
          />
        )}
      </Box>
    </Box>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={<Box sx={{ minHeight: '100vh', bgcolor: '#0A0A0A' }} />}
    >
      <BooksContent />
    </Suspense>
  );
}
