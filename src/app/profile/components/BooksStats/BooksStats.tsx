'use client';
import { UserProfileBook } from '@/domain/user.model';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface BooksStatsProps {
  books: UserProfileBook[];
}

interface StatItemProps {
  icon: React.ReactElement;
  label: string;
  count: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, count, color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
      border: `1px solid ${color}30`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      '&:hover': {
        transform: 'scale(1.05)',
        background: `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`,
        border: `1px solid ${color}50`,
        boxShadow: `0 4px 12px ${color}25`,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        '& svg': {
          fontSize: '1.1rem',
          filter: 'none',
        },
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: lora.style.fontFamily,
        fontSize: '0.85rem',
        fontWeight: 500,
        mr: 0.5,
      }}
    >
      {label}:
    </Typography>
    <Typography
      sx={{
        color: '#FFFFFF',
        fontFamily: lora.style.fontFamily,
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textShadow: 'none',
      }}
    >
      {count}
    </Typography>
  </Box>
);

export const BooksStats: React.FC<BooksStatsProps> = ({ books }) => {
  const readingCount = books.filter(
    (book) => book.userData?.status === EBookStatus.READING
  ).length;

  const readCount = books.filter(
    (book) => book.userData?.status === EBookStatus.READ
  ).length;

  const wantToReadCount = books.filter(
    (book) => book.userData?.status === EBookStatus.WANT_TO_READ
  ).length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        px: { xs: 0.5, md: 1 },
        py: 1,
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '16px',
      }}
    >
      <StatItem
        icon={<MenuBookIcon />}
        label="Reading"
        count={readingCount}
        color="#a855f7"
      />
      <StatItem
        icon={<CheckCircleIcon />}
        label="Read"
        count={readCount}
        color="#a855f7"
      />
      <StatItem
        icon={<BookmarkIcon />}
        label="Want to Read"
        count={wantToReadCount}
        color="#a855f7"
      />
    </Box>
  );
};
