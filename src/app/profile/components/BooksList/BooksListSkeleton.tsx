import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksListSkeleton: React.FC = () => (
  <Box
    sx={{
      flex: 1,
      display: {
        xs: 'grid',
        sm: 'grid',
        md: 'flex',
      },
      gridTemplateColumns: {
        xs: '1fr 1fr',
        sm: '1fr 1fr',
        md: 'none',
      },
      flexDirection: { xs: 'unset', md: 'unset' },
      width: '100%',
      flexWrap: { xs: 'unset', md: 'wrap' },
      gap: { xs: 1, sm: 2 },
      overflowY: 'auto',
      maxHeight: '65vh',
      minHeight: 240,
      alignItems: { xs: 'stretch', md: 'start' },
      justifyContent: { xs: 'flex-start', md: 'center' },
      py: { md: 1 },
      background: 'transparent',
    }}
  >
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        sx={{
          minWidth: { xs: 'unset', md: 140 },
          maxWidth: { xs: 'unset', md: 220 },
          width: { xs: '100%', sm: '100%', md: 'auto' },
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: { xs: 'center', md: 'start' },
          alignItems: { xs: 'stretch', md: 'center' },
          px: { xs: 0, sm: 1, md: 0 },
          py: { xs: 0.5, md: 0 },
          height: { xs: 'auto', md: '100%' },
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            borderRadius: '16px',
            width: '100%',
            maxWidth: { xs: 'none', md: 140 },
            height: { xs: '280px', md: 220 },
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
          animation="wave"
        />
      </Box>
    ))}
  </Box>
);

export default BooksListSkeleton;
