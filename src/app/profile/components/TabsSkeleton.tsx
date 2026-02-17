import { Box, Skeleton } from '@mui/material';
import React from 'react';

export const TabsSkeleton: React.FC = () => (
  <Box
    sx={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'transparent',
      mb: 4,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        px: 2,
        py: 1,
      }}
    >
      {['Books', 'Hall of Fame', 'Stats', 'Activity'].map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          sx={{
            width: index === 0 ? 60 : index === 1 ? 110 : index === 2 ? 50 : 70,
            height: 32,
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />
      ))}
    </Box>
  </Box>
);

export default TabsSkeleton;
