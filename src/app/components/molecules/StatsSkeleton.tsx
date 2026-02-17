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
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '20px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Simula el título */}
          <Skeleton
            variant="text"
            height={40}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              mb: 2,
              borderRadius: 1,
            }}
          />

          {/* Simula el gráfico */}
          <Skeleton
            variant="rectangular"
            sx={{
              flexGrow: 1,
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 2,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
