import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function StatsSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {[0, 1].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: '500px',
            height: '400px',
            background:
              'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '20px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
          }}
        >
          {/* Simula el título */}
          <Skeleton
            variant="text"
            height={40}
            sx={{ bgcolor: 'rgba(147, 51, 234, 0.25)', mb: 2, borderRadius: 1 }}
          />

          {/* Simula el gráfico */}
          <Skeleton
            variant="rectangular"
            sx={{
              flexGrow: 1,
              bgcolor: 'rgba(147, 51, 234, 0.2)',
              borderRadius: 2,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
