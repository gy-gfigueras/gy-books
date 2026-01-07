import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import { UserProfileBook } from '@/domain/user.model';

interface BooksStatsDisplayProps {
  books: UserProfileBook[];
  compact?: boolean;
}

export const BooksStatsDisplay: React.FC<BooksStatsDisplayProps> = ({
  books,
  compact = false,
}) => {
  const readCount = books.filter(
    (b) => b.userData?.status === EBookStatus.READ
  ).length;
  const readingCount = books.filter(
    (b) => b.userData?.status === EBookStatus.READING
  ).length;
  const wantToReadCount = books.filter(
    (b) => b.userData?.status === EBookStatus.WANT_TO_READ
  ).length;

  if (compact) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
          <Typography
            sx={{
              color: '#10b981',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {readCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MenuBookIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
          <Typography
            sx={{
              color: '#3b82f6',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {readingCount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BookmarkIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
          <Typography
            sx={{
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {wantToReadCount}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        mt: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          Read:
        </Typography>
        <Typography
          sx={{
            color: '#10b981',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {readCount}
        </Typography>
      </Box>

      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <MenuBookIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          Reading:
        </Typography>
        <Typography
          sx={{
            color: '#3b82f6',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {readingCount}
        </Typography>
      </Box>

      <Box sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <BookmarkIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          Want to Read:
        </Typography>
        <Typography
          sx={{
            color: '#f59e0b',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {wantToReadCount}
        </Typography>
      </Box>
    </Box>
  );
};
