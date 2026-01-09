import React from 'react';
import { UUID } from 'crypto';
import { useStats } from '@/hooks/useStats';
import { useStatsFromBooks } from '@/hooks/useStatsFromBooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthorsBarChart from '../molecules/AuthorsBarChart';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import DonutChart from '../molecules/DonutChart';
import PageCountKPI from '../molecules/PageCountKPI';
import RatingStats from '../molecules/RatingStats';
import { lora } from '@/utils/fonts/fonts';
import StatsSkeleton from '../molecules/StatsSkeleton';
import type HardcoverBook from '@/domain/HardcoverBook';

const MotionBox = motion(Box);

interface StatsComponentProps {
  id: UUID;
  books?: HardcoverBook[];
  booksLoading?: boolean;
}

/**
 * Componente de estadísticas optimizado.
 *
 * Calcula stats de dos formas (en orden de prioridad):
 * 1. Si recibe `books` como prop, calcula stats en memoria (rápido)
 * 2. Si no, usa el hook `useStats` tradicional (fetch al backend)
 *
 * También integra Redux para cachear stats del usuario actual.
 */
export default function StatsComponent({
  id,
  books,
  booksLoading = false,
}: StatsComponentProps) {
  const storedStats = useSelector((state: RootState) => state.stats);
  const isCurrentUser = storedStats.userId === id.toString();

  // Hook de stats desde libros (si están disponibles)
  const statsFromBooks = useStatsFromBooks(books, booksLoading);

  // Hook de stats desde API (fallback) - SOLO si books NO se pasó como prop
  // Si books es undefined, hacer fetch. Si es array (vacío o no), usar statsFromBooks
  const shouldFetchFromAPI = books === undefined;
  const statsFromAPI = useStats(shouldFetchFromAPI ? id : null);

  // Decidir qué fuente usar (prioridad: Redux > books prop > API)
  const data =
    isCurrentUser && storedStats.data
      ? storedStats.data
      : books !== undefined
        ? statsFromBooks.data
        : statsFromAPI.data;

  const isLoading =
    isCurrentUser && storedStats.data
      ? storedStats.isLoading
      : books !== undefined
        ? statsFromBooks.isLoading || booksLoading
        : statsFromAPI.isLoading;

  const error =
    isCurrentUser && storedStats.data
      ? storedStats.error
        ? new Error(storedStats.error)
        : null
      : books !== undefined
        ? statsFromBooks.error
        : statsFromAPI.error;

  // Mostrar skeleton SOLO cuando está cargando
  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 100, 100, 0.8)',
            fontFamily: lora.style.fontFamily,
            fontSize: 18,
          }}
        >
          Error loading statistics: {error.message}
        </Typography>
      </Box>
    );
  }

  // Verificar que tengamos datos válidos
  const hasValidData =
    data &&
    (data.totalBooks > 0 ||
      Object.keys(data.authors || {}).length > 0 ||
      Object.keys(data.bookStatus || {}).length > 0);

  if (!hasValidData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: 18,
          }}
        >
          No statistics available yet. Start adding books to your library!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row ',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {data.authors && Object.keys(data.authors).length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          sx={{
            width: '500px',
            height: '400px',
            background:
              'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            flexDirection: 'column',
            gap: 1,
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
          }}
        >
          <Typography
            sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
            variant="h4"
          >
            Authors read
          </Typography>
          <AuthorsBarChart authors={data?.authors} />
        </MotionBox>
      )}
      {data.bookStatus && Object.keys(data.bookStatus).length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          sx={{
            width: '500px',
            height: '400px',
            background:
              'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            flexDirection: 'column',
            gap: 1,
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
          }}
        >
          <Typography
            sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
            variant="h4"
          >
            Book status
          </Typography>
          <DonutChart bookStatus={data?.bookStatus} />
        </MotionBox>
      )}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        sx={{
          width: '500px',
          height: '400px',
          background:
            'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
          boxShadow:
            '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Page Count
        </Typography>
        <PageCountKPI
          totalPages={data?.totalPages || 0}
          wantToReadPages={data?.wantToReadPages || 0}
          bookStatus={data?.bookStatus || {}}
          fontFamily={lora.style.fontFamily}
        />
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        sx={{
          width: '500px',
          height: '400px',
          background:
            'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
          boxShadow:
            '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Rating Stats
        </Typography>
        <RatingStats
          ratings={
            data?.ratings || {
              distribution: {},
              averageRating: 0,
              totalRatedBooks: 0,
            }
          }
          fontFamily={lora.style.fontFamily}
        />
      </MotionBox>
    </Box>
  );
}
