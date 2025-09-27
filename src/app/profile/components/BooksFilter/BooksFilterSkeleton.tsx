import React from 'react';
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';

export const BooksFilterSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: 48,
            borderRadius: '16px',
            bgcolor: 'rgba(140, 84, 255, 0.2)',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'flex-start',
        gap: { xs: 1, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1, md: 2 },
        mb: 2,
        borderRadius: '10px',
        minHeight: 48,
        maxWidth: { xs: '100%', md: 1000 },
        mx: 'auto',
      }}
    >
      {/* Search input skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          flex: 2,
          height: 40,
          borderRadius: '16px',
          minWidth: 110,
          bgcolor: 'rgba(45, 45, 45, 0.95)',
          mb: { xs: 1, sm: 0 },
        }}
      />
      {/* Rating filter skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          flex: 1,
          height: 40,
          borderRadius: '10px',
          minWidth: 110,
          bgcolor: 'rgba(45, 45, 45, 0.95)',
        }}
      />
      {/* Status filter skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          flex: 1,
          height: 40,
          borderRadius: '10px',
          minWidth: 110,
          bgcolor: 'rgba(45, 45, 45, 0.95)',
        }}
      />
      {/* Author filter skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          flex: 1,
          height: 40,
          borderRadius: '10px',
          minWidth: 110,
          bgcolor: 'rgba(45, 45, 45, 0.95)',
        }}
      />
      {/* Series filter skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          flex: 1,
          height: 40,
          borderRadius: '10px',
          minWidth: 110,
          bgcolor: 'rgba(45, 45, 45, 0.95)',
        }}
      />
      {/* Order button skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: 55,
          height: 40,
          borderRadius: '10px',
          bgcolor: 'rgba(45, 45, 45, 0.95)',
        }}
      />
    </Box>
  );
};

export default BooksFilterSkeleton;
