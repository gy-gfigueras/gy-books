import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksListSkeleton: React.FC = () => (
  <Box sx={{ width: '100%', mb: 2 }}>
    {/* Skeleton para filtros */}
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1, md: 2 },
        mb: 2,
        borderRadius: '12px',
        minHeight: 48,
        maxWidth: { xs: '100%', md: 700 },
        mx: 'auto',
      }}
    >
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{ borderRadius: 2, width: '100%', height: 40, flex: 1 }}
        />
      ))}
    </Box>
    {/* Skeleton para lista de libros */}
    <Box
      sx={{
        flex: 1,
        display: {
          xs: 'grid',
          sm: 'grid',
          md: 'flex',
        },
        gridTemplateColumns: {
          xs: 'repeat(auto-fit, minmax(140px, 1fr))', // Se ajusta automáticamente: 1 o 2 columnas
          sm: 'repeat(auto-fit, minmax(160px, 1fr))', // Mínimo 160px por columna en tablet
          md: 'none',
        },
        flexWrap: { xs: 'unset', md: 'wrap' },
        gap: { xs: '8px', sm: '12px', md: 2 },
        overflowY: 'auto',
        maxHeight: '65vh',
        minHeight: 240,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: { xs: 'center', md: 'center' },
        py: { md: 1 },
        px: { xs: '4px', sm: '8px', md: 0 },
        background: 'transparent',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: '16px',
              width: '100%',
              maxWidth: { xs: 'none', md: 140 },
              height: { xs: '280px', md: 220 }, // Altura ajustada para móvil
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
            animation="wave"
          />
        </Box>
      ))}
    </Box>
  </Box>
);
