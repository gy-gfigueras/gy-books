'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Skeleton,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { EBookStatus } from '@gycoding/nebula';
import { useRouter } from 'next/navigation';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { lora } from '@/utils/fonts/fonts';

interface CurrentlyReadingSectionProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

/**
 * Calcula las páginas leídas basándose en el progreso
 * - Si progress es decimal (0.15) = 15% → regla de 3
 * - Si progress es 1.0 = 100%
 * - Si progress es entero (12) = número de páginas
 */
const calculatePagesRead = (progress: number, totalPages: number): number => {
  if (progress <= 1) {
    // Es un porcentaje (0.15 = 15%)
    return Math.round(progress * totalPages);
  }
  // Es un número de páginas
  return progress;
};

const ReadingBookSkeleton = () => (
  <Box sx={{ mb: 3 }}>
    <Skeleton
      variant="text"
      width={150}
      height={32}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 2 }}
    />
    <Paper
      sx={{
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: { xs: 2, sm: 3 },
        border: '1px solid rgba(147, 51, 234, 0.3)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={{ xs: 90, sm: 100 }}
          height={{ xs: 135, sm: 150 }}
          sx={{ borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Box sx={{ flex: 1, width: '100%' }}>
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={8}
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
        </Box>
      </Box>
    </Paper>
  </Box>
);

export const CurrentlyReadingSection: React.FC<
  CurrentlyReadingSectionProps
> = ({ books, isLoading }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const readingBooks = books.filter((book) => {
    const displayData = getBookDisplayData(book);
    return displayData?.status === EBookStatus.READING;
  });

  useEffect(() => {
    if (readingBooks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % readingBooks.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [readingBooks.length]);

  if (isLoading) {
    return <ReadingBookSkeleton />;
  }

  if (readingBooks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: { xs: 1, sm: 3 },
            border: '1px solid rgba(147, 51, 234, 0.2)',
            textAlign: 'center',
          }}
        >
          <AutoStoriesIcon
            sx={{ fontSize: 64, color: 'rgba(147, 51, 234, 0.5)', mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1,
              fontFamily: lora.style.fontFamily,
            }}
          >
            No books currently reading
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: lora.style.fontFamily,
            }}
          >
            Start reading a book to see your progress here
          </Typography>
        </Box>
      </motion.div>
    );
  }

  const currentBook = readingBooks[currentIndex];
  const displayData = getBookDisplayData(currentBook);

  if (!displayData) return null;

  // Calcular páginas leídas basándose en el tipo de progreso
  const pagesRead = calculatePagesRead(
    displayData.progress,
    displayData.pageCount
  );
  const progressPercentage =
    displayData.pageCount > 0 ? (pagesRead / displayData.pageCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3, p: { xs: 1, sm: 0 } }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: lora.style.fontFamily,

            color: 'white',
            fontWeight: 700,
            mb: 2,
            fontFamily: lora.style.fontFamily,
          }}
        >
          Currently Reading
        </Typography>

        <Paper
          onClick={() => router.push(`/books/${currentBook.id}`)}
          sx={{
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: { xs: 1, sm: 3 },
            border: '1px solid rgba(147, 51, 234, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBook.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 90, sm: 100 },
                    height: { xs: 135, sm: 150 },
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Image
                    src={displayData.coverUrl}
                    alt={displayData.title}
                    fill
                    sizes="(max-width: 600px) 90px, 100px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {displayData.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: lora.style.fontFamily,

                      mb: 2,
                    }}
                  >
                    {displayData.author}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.5,
                        alignItems: 'baseline',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {Math.round(progressPercentage)}% completed
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#9333ea',
                          fontWeight: 600,
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {pagesRead} / {displayData.pageCount}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(147, 51, 234, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background:
                            'linear-gradient(90deg, #9333ea 0%, #c084fc 100%)',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Paper>

        {readingBooks.length > 1 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}
          >
            {readingBooks.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    index === currentIndex
                      ? '#9333ea'
                      : 'rgba(147, 51, 234, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor:
                      index === currentIndex
                        ? '#9333ea'
                        : 'rgba(147, 51, 234, 0.5)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};
