import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function FriendCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '0.875rem 1rem',
        width: '100%',
      }}
    >
      <Skeleton
        variant="circular"
        width={48}
        height={48}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)', flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="55%"
          height={24}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
      </Box>
      <Skeleton
        variant="rectangular"
        width={44}
        height={44}
        sx={{
          bgcolor: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          flexShrink: 0,
        }}
      />
    </Box>
  );
}
