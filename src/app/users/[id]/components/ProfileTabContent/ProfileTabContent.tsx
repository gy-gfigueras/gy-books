import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';
import { UUID } from 'crypto';
import { Book } from '@gycoding/nebula';

const ActivityTab = React.lazy(
  () => import('@/app/components/molecules/activityTab')
);
const HallOfFame = React.lazy(
  () => import('@/app/components/molecules/HallOfFame')
);
const Stats = React.lazy(() => import('@/app/components/organisms/Stats'));

interface ProfileTabContentProps {
  activeTab: number;
  userId: UUID;
  books: Book[];
  booksLoading: boolean;
  booksTabContent: React.ReactNode;
}

/**
 * Renderiza el contenido de cada tab del perfil
 * Usa lazy loading para optimizar carga
 */
export const ProfileTabContent = ({
  activeTab,
  userId,
  books,
  booksLoading,
  booksTabContent,
}: ProfileTabContentProps) => {
  // Tab 0: Books (rendered outside to avoid lazy loading)
  if (activeTab === 0) {
    return <>{booksTabContent}</>;
  }

  // Tab 1: Hall of Fame
  if (activeTab === 1) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#fff',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <HallOfFame userId={userId} />
        </Suspense>
      </Box>
    );
  }

  // Tab 2: Stats
  if (activeTab === 2) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#FFFFFF',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <Stats id={userId} books={books} booksLoading={booksLoading} />
        </Suspense>
      </Box>
    );
  }

  // Tab 3: Activity
  if (activeTab === 3) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#FFFFFF',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          <ActivityTab id={userId} />
        </Suspense>
      </Box>
    );
  }

  return null;
};
