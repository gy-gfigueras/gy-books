'use client';

import HardcoverBook from '@/domain/HardcoverBook';
import { Box, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCard } from '@/app/components/atoms/BookCard/BookCard';

const MotionBox = motion(Box);

const GRID_SX = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  gap: { xs: '8px', sm: '12px', md: '14px' },
  alignItems: 'stretch',
};

interface BooksGridProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

function BookCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '10px', md: '16px' },
        p: { xs: '10px', sm: '12px', md: '16px' },
        background: 'rgba(255,255,255,0.03)',
        borderRadius: { xs: '16px', md: '20px' },
        border: '1px solid rgba(255,255,255,0.06)',
        height: '100%',
        minHeight: { xs: '86px', md: '106px' },
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: { xs: '64px', sm: '80px', md: '104px' },
          flexShrink: 0,
          alignSelf: 'stretch',
          borderRadius: { xs: '10px', md: '12px' },
          bgcolor: 'rgba(255,255,255,0.06)',
        }}
      />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          sx={{ bgcolor: 'rgba(255,255,255,0.07)' }}
        />
        <Skeleton
          variant="text"
          width="45%"
          height={16}
          sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
        />
        <Skeleton
          variant="text"
          width="30%"
          height={14}
          sx={{ bgcolor: 'rgba(255,255,255,0.03)', mt: 0.5 }}
        />
      </Box>
    </Box>
  );
}

export const BooksGrid: React.FC<BooksGridProps> = ({ books, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={GRID_SX}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 6px)',
                lg: 'calc(33.333% - 10px)',
              },
              flexShrink: 0,
            }}
          >
            <BookCardSkeleton />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={GRID_SX}>
      <AnimatePresence mode="popLayout">
        {books.map((book, index) => (
          <MotionBox
            key={book.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.22,
              delay: Math.min(index * 0.035, 0.28),
            }}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 6px)',
                lg: 'calc(33.333% - 10px)',
              },
              flexShrink: 0,
            }}
          >
            <BookCard book={book} />
          </MotionBox>
        ))}
      </AnimatePresence>
    </Box>
  );
};
