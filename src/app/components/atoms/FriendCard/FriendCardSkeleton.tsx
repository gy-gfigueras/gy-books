import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function FriendCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        gap: '1.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '1rem',
        width: '25%',
        height: '100px',
        minWidth: '400px',
        position: 'relative',
        textDecoration: 'none',
      }}
    >
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)', flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
        />
      </Box>
    </Box>
  );
}
