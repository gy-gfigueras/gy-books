'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { EBookStatus } from '@gycoding/nebula';
import { useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';

interface ReadingStatsCardsProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

// Skeleton individual para cada card de stats
const StatCardSkeleton: React.FC<{
  color: string;
  gradient: string;
}> = ({ color, gradient }) => (
  <Paper
    sx={{
      background: gradient,
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: 2.5,
      border: `1px solid ${color}40`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Box>
        <Skeleton
          variant="text"
          width={60}
          height={48}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={24}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 0.5 }}
        />
      </Box>
      <Skeleton
        variant="rounded"
        width={48}
        height={48}
        sx={{
          bgcolor: `${color}30`,
          borderRadius: '12px',
        }}
      />
    </Box>
  </Paper>
);

export const ReadingStatsCards: React.FC<ReadingStatsCardsProps> = ({
  books,
  isLoading,
}) => {
  const router = useRouter();

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const booksRead = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      return displayData?.status === EBookStatus.READ;
    }).length;

    const currentYear = new Date().getFullYear();
    const booksReadThisYear = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      if (displayData?.status !== EBookStatus.READ) return false;

      const finishedAt = book.userData?.finishedAt;
      if (!finishedAt) return false;

      const finishedYear = new Date(finishedAt).getFullYear();
      return finishedYear === currentYear;
    }).length;

    return { totalBooks, booksRead, booksReadThisYear };
  }, [books]);

  const cards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: MenuBookIcon,
      color: '#9333ea',
      gradient:
        'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)',
      onClick: () => router.push('/profile'),
    },
    {
      title: 'Books Read',
      value: stats.booksRead,
      icon: CheckCircleIcon,
      color: '#10b981',
      gradient:
        'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
      onClick: () => router.push('/profile?status=read'),
    },
    {
      title: 'Read in 2025',
      value: stats.booksReadThisYear,
      icon: TrendingUpIcon,
      color: '#f59e0b',
      gradient:
        'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
      onClick: () => router.push('/profile?year=2025'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        mb: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 1,
          fontFamily: lora.style.fontFamily,
        }}
      >
        Reading Stats
      </Typography>

      {isLoading
        ? // Mostrar skeletons mientras carga
          cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCardSkeleton color={card.color} gradient={card.gradient} />
            </motion.div>
          ))
        : // Mostrar datos reales cuando termine de cargar
          cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Paper
                  onClick={card.onClick}
                  sx={{
                    background: card.gradient,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: 1.5,
                    border: `1px solid ${card.color}40`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: `0 12px 24px ${card.color}40`,
                      border: `1px solid ${card.color}60`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          mb: 0.25,
                          fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: `${card.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Icon
                        sx={{
                          color: card.color,
                          fontSize: 24,
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
    </Box>
  );
};
