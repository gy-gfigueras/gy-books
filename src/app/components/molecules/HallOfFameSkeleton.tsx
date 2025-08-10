import { Box, Skeleton } from '@mui/material';
import React from 'react';
export function HallOfFameSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: '#1A1A1A',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        userSelect: 'none',
      }}
    >
      {/* Skeleton for carousel container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 320,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          px: 4,
        }}
      >
        {/* Simulate 5 books in carousel */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              borderRadius: '12px',
              position: i === 2 ? 'relative' : 'absolute', // center one relative, others absolute
              width: i === 2 ? 180 : 130,
              height: i === 2 ? 260 : 190,
              opacity: i === 2 ? 1 : 0.6,
              transform: i === 2 ? 'scale(1)' : 'scale(0.85)',
              zIndex: i === 2 ? 1 : 0,
              boxShadow:
                i === 2
                  ? '0 12px 25px rgba(0,0,0,0.6)'
                  : '0 6px 12px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </Box>

      {/* Skeleton for quote input */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={72}
        sx={{
          maxWidth: '800px',
          borderRadius: '12px',
          bgcolor: '#232323',
          border: '2px solid #FFFFFF30',
        }}
      />
    </Box>
  );
}
