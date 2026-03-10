import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksListSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(auto-fill, minmax(140px, 1fr))',
        sm: 'repeat(auto-fill, minmax(160px, 1fr))',
        md: 'repeat(auto-fill, minmax(180px, 1fr))',
      },
      gap: { xs: 2, sm: 3, md: 4 },
      width: '100%',
      py: { xs: 1, md: 2 },
      px: { xs: 0.5, md: 1 },
    }}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            borderRadius: '14px',
            width: '100%',
            height: { xs: 210, sm: 240, md: 270 },
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: '80%',
            height: 16,
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '6px',
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: '50%',
            height: 14,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '6px',
          }}
        />
      </Box>
    ))}
  </Box>
);

export default BooksListSkeleton;
