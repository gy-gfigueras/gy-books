import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface ProfileHeaderSkeletonProps {
  canEdit?: boolean;
}

export const ProfileHeaderSkeleton: React.FC<ProfileHeaderSkeletonProps> = ({
  canEdit = true,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 2, md: 6 },
      minHeight: { xs: 0, md: 200 },
      width: '100%',
      px: { xs: 1, md: 0 },
      py: { xs: 2, md: 0 },
      alignItems: { xs: 'center', md: 'flex-start' },
      boxSizing: 'border-box',
    }}
  >
    <Box
      sx={{
        width: { xs: 90, sm: 120, md: 160 },
        height: { xs: 90, sm: 120, md: 160 },
        alignSelf: { xs: 'center', md: 'flex-start' },
      }}
    >
      <Skeleton
        variant="circular"
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </Box>
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 2,
        width: { xs: '100%', md: 'auto' },
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Skeleton
          variant="text"
          sx={{
            width: { xs: 180, md: 220 },
            height: { xs: 40, sm: 44, md: 56 },
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Skeleton
          variant="text"
          sx={{
            width: { xs: 140, md: 180 },
            height: { xs: 20, md: 28 },
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>
      {/* Friends count only if canEdit */}
      {canEdit && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            marginTop: '-10px',
          }}
        >
          <Skeleton
            variant="text"
            sx={{
              width: 100,
              height: { xs: 20, md: 24 },
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        </Box>
      )}
      {/* Biography skeleton */}
      <Box sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}>
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: 75,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
        />
      </Box>
    </Box>
    {/* Edit buttons only if canEdit */}
    {canEdit && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: 2, md: 1 },
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-end' },
          mx: { xs: 'auto', md: 0 },
          mt: { xs: 2, md: 0 },
          width: { xs: '100%', md: 'auto' },
          height: '100%',
          position: { xs: 'static', md: 'relative' },
          marginTop: { xs: 0, md: '42px' },
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: '50%', md: '200px' },
            height: { xs: 36, md: 40 },
            borderRadius: '8px',
            bgcolor: 'rgba(140, 84, 255, 0.2)',
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: '50%', md: '200px' },
            height: { xs: 36, md: 40 },
            borderRadius: '8px',
            bgcolor: 'rgba(140, 84, 255, 0.2)',
          }}
        />
      </Box>
    )}
  </Box>
);
