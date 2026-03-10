import { Box, Skeleton } from '@mui/material';

const offsetsX = [-134, -67, 0, 67, 134];
const sizes = [
  { w: 118, h: 172 },
  { w: 118, h: 172 },
  { w: 172, h: 250 },
  { w: 118, h: 172 },
  { w: 118, h: 172 },
];
const opacities = [0.25, 0.38, 1, 0.38, 0.25];

export function HallOfFameSkeleton() {
  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,158,11,0.14)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.75rem',
        userSelect: 'none',
      }}
    >
      {/* Header skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Skeleton
          variant="text"
          width={180}
          height={36}
          sx={{ bgcolor: 'rgba(245,158,11,0.08)', borderRadius: '8px' }}
        />
        <Skeleton
          variant="text"
          width={80}
          height={16}
          sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}
        />
      </Box>

      {/* Carousel skeleton */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 295,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          px: 6,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              borderRadius: '14px',
              position: 'absolute',
              width: sizes[i].w,
              height: sizes[i].h,
              opacity: opacities[i],
              transform: `translateX(${offsetsX[i]}px)`,
              zIndex: i === 2 ? 3 : 1,
              bgcolor: 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </Box>

      {/* Title skeleton */}
      <Skeleton
        variant="text"
        width="45%"
        height={24}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}
      />

      {/* Dot indicators skeleton */}
      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={i === 0 ? 22 : 7}
            height={7}
            sx={{
              borderRadius: '100px',
              bgcolor:
                i === 0 ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </Box>

      {/* Quote skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          width: '100%',
          maxWidth: '680px',
          px: 4,
        }}
      >
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
        />
        <Skeleton
          variant="text"
          width="55%"
          height={20}
          sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}
        />
      </Box>
    </Box>
  );
}
