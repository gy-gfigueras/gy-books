import { Box, Skeleton } from '@mui/material';
import React from 'react';
export function HallOfFameSkeleton() {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(126, 34, 206, 0.1) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        userSelect: 'none',
        boxShadow:
          '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
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
          bgcolor: 'rgba(147, 51, 234, 0.15)',
          border: '2px solid rgba(147, 51, 234, 0.3)',
        }}
      />
    </Box>
  );
}
