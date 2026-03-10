import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface ProfileHeaderSkeletonProps {
  canEdit?: boolean;
}

export const ProfileHeaderSkeleton: React.FC<ProfileHeaderSkeletonProps> = ({
  canEdit = true,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      py: 1.5,
      px: 2,
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
    }}
  >
    {/* Avatar — same 50px as collapsed header */}
    <Skeleton
      variant="circular"
      animation="wave"
      sx={{
        width: 50,
        height: 50,
        flexShrink: 0,
        bgcolor: 'rgba(255,255,255,0.05)',
      }}
    />

    {/* Username + chips row */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
      }}
    >
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{
          width: 140,
          height: 22,
          bgcolor: 'rgba(255,255,255,0.06)',
          borderRadius: '8px',
        }}
      />

      {canEdit && (
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: 90,
            height: 28,
            bgcolor: 'rgba(255,255,255,0.04)',
            borderRadius: '100px',
          }}
        />
      )}

      {/* Book count + pages chips */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: 72,
            height: 28,
            bgcolor: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
          }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: 72,
            height: 28,
            bgcolor: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
          }}
        />
      </Box>
    </Box>

    {/* Expand chevron */}
    <Skeleton
      variant="circular"
      animation="wave"
      sx={{
        width: 24,
        height: 24,
        flexShrink: 0,
        bgcolor: 'rgba(255,255,255,0.04)',
      }}
    />
  </Box>
);
