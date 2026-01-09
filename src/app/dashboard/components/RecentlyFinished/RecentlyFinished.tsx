'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, Rating, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { EBookStatus } from '@gycoding/nebula';
import { useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';

interface RecentlyFinishedProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

// Skeleton individual para cada libro terminado recientemente
const FinishedBookSkeleton: React.FC = () => (
  <Paper
    sx={{
      background:
        'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: 2,
      border: '1px solid rgba(16, 185, 129, 0.3)',
      width: { xs: 120, sm: 160 },
      flexShrink: 0,
    }}
  >
    <Skeleton
      variant="rounded"
      width="100%"
      height={200}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        mb: 1.5,
      }}
    />
    <Skeleton
      variant="text"
      width="100%"
      height={20}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 0.5 }}
    />
    <Skeleton
      variant="text"
      width="80%"
      height={20}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 0.5 }}
    />
    <Skeleton
      variant="text"
      width="60%"
      height={16}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 1 }}
    />
    <Skeleton
      variant="rounded"
      width={90}
      height={18}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
    />
  </Paper>
);

export const RecentlyFinished: React.FC<RecentlyFinishedProps> = ({
  books,
  isLoading,
}) => {
  const router = useRouter();

  const recentlyFinished = useMemo(() => {
    const finishedBooks = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      return (
        displayData?.status === EBookStatus.READ && book.userData?.finishedAt
      );
    });

    return finishedBooks
      .sort((a, b) => {
        const dateA = a.userData?.finishedAt
          ? new Date(a.userData.finishedAt).getTime()
          : 0;
        const dateB = b.userData?.finishedAt
          ? new Date(b.userData.finishedAt).getTime()
          : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [books]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Recently Finished
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(147, 51, 234, 0.1)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(147, 51, 234, 0.5)',
                borderRadius: 4,
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.7)',
                },
              },
            }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FinishedBookSkeleton />
              </motion.div>
            ))}
          </Box>
        </Box>
      </motion.div>
    );
  }

  if (recentlyFinished.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontFamily: lora.style.fontFamily,
          }}
        >
          Recently Finished
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(147, 51, 234, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(147, 51, 234, 0.5)',
              borderRadius: 4,
              '&:hover': {
                background: 'rgba(147, 51, 234, 0.7)',
              },
            },
          }}
        >
          {recentlyFinished.map((book, index) => {
            const displayData = getBookDisplayData(book);
            if (!displayData) return null;

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Paper
                  onClick={() => router.push(`/books/${book.id}`)}
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: 2,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: { xs: 120, sm: 160 },
                    flexShrink: 0,
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 200,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      mb: 1.5,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Image
                      src={displayData.coverUrl}
                      alt={displayData.title}
                      fill
                      sizes="(max-width: 600px) 120px, 160px"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.4em',
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {displayData.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'block',
                      mb: 1,
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: lora.style.fontFamily,
                    }}
                  >
                    {displayData.author}
                  </Typography>

                  {displayData.rating > 0 && (
                    <Rating
                      value={displayData.rating}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#fbbf24',
                        },
                        '& .MuiRating-icon': {
                          fontSize: { xs: '1rem', sm: '1.2rem' },
                        },
                      }}
                    />
                  )}
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
};
