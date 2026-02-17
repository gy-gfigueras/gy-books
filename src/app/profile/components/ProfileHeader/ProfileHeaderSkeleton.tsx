import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface ProfileHeaderSkeletonProps {
  canEdit?: boolean;
  isExpanded?: boolean;
}

export const ProfileHeaderSkeleton: React.FC<ProfileHeaderSkeletonProps> = ({
  canEdit = true,
  isExpanded = false,
}) => {
  if (!isExpanded) {
    // Versión colapsada - similar a ProfileHeader colapsado
    return (
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
        {/* Avatar pequeño 50px */}
        <Skeleton
          variant="circular"
          sx={{
            width: 50,
            height: 50,
            flexShrink: 0,
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />

        {/* Username + chips */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Username skeleton */}
          <Skeleton
            variant="text"
            sx={{
              width: 150,
              height: 28,
              bgcolor: 'rgba(255, 255, 255, 0.04)',
            }}
          />

          {/* Friends chip skeleton */}
          {canEdit && (
            <Skeleton
              variant="rounded"
              width={120}
              height={32}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
              }}
            />
          )}

          {/* Stats skeletons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton
              variant="rounded"
              width={80}
              height={28}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
              }}
            />
            <Skeleton
              variant="rounded"
              width={80}
              height={28}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
              }}
            />
          </Box>
        </Box>

        {/* Icono expandir */}
        <Skeleton
          variant="circular"
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />
      </Box>
    );
  }

  // Versión expandida - diseño completo
  return (
    <Box
      sx={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        p: 3,
      }}
    >
      {/* Botón colapsar */}
      <Skeleton
        variant="circular"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 32,
          height: 32,
          bgcolor: 'rgba(255, 255, 255, 0.04)',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 },
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        {/* Avatar grande */}
        <Skeleton
          variant="circular"
          sx={{
            width: { xs: 120, md: 160 },
            height: { xs: 120, md: 160 },
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            border: '3px solid rgba(255, 255, 255, 0.08)',
          }}
        />

        {/* Info section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: { xs: 'center', md: 'flex-start' },
            width: { xs: '100%', md: 'auto' },
          }}
        >
          {/* Username + Friends */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Skeleton
              variant="text"
              sx={{
                width: 200,
                height: { xs: 36, md: 48 },
                bgcolor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
            {canEdit && (
              <Skeleton
                variant="rounded"
                width={120}
                height={32}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '16px',
                }}
              />
            )}
          </Box>

          {/* Biography skeleton */}
          <Skeleton
            variant="rectangular"
            sx={{
              width: { xs: '100%', md: 500 },
              height: 80,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.03)',
            }}
          />

          {/* Stats skeletons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Skeleton
              variant="rounded"
              width={100}
              height={36}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
              }}
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={36}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
              }}
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={36}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
              }}
            />
          </Box>
        </Box>

        {/* Edit buttons */}
        {canEdit && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{
                width: { xs: 140, md: 160 },
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }}
            />
            <Skeleton
              variant="rounded"
              sx={{
                width: { xs: 140, md: 160 },
                height: 40,
                borderRadius: '10px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
