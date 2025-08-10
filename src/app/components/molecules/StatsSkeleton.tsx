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
            backgroundColor: '#121212',
            borderRadius: '10px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {/* Simula el título */}
          <Skeleton
            variant="text"
            height={40}
            sx={{ bgcolor: '#333', mb: 2, borderRadius: 1 }}
          />

          {/* Simula el gráfico */}
          <Skeleton
            variant="rectangular"
            sx={{ flexGrow: 1, bgcolor: '#333', borderRadius: 2 }}
          />
        </Box>
      ))}
    </Box>
  );
}
