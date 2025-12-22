import { lora } from '@/utils/fonts/fonts';
import { Box, CircularProgress } from '@mui/material';
import React, { Suspense } from 'react';
import { HallOfFameSkeleton } from '../../../components/molecules/HallOfFameSkeleton';
import StatsSkeleton from '../../../components/molecules/StatsSkeleton';
import { UserProfileBook } from '@/domain/user.model';

const Stats = React.lazy(() => import('../../../components/organisms/Stats'));
const HallOfFame = React.lazy(
  () => import('../../../components/molecules/HallOfFame')
);
const ActivityTab = React.lazy(
  () => import('../../../components/molecules/activityTab')
);

interface ProfileTabContentProps {
  tab: number;
  userId: string;
  books: UserProfileBook[];
  booksLoading: boolean;
  children?: React.ReactNode;
}

export function ProfileTabContent({
  tab,
  userId,
  books,
  booksLoading,
  children,
}: ProfileTabContentProps) {
  if (tab === 0 && children) {
    return <>{children}</>;
  }

  if (tab === 1) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#fff',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<HallOfFameSkeleton />}>
          <HallOfFame userId={userId} />
        </Suspense>
      </Box>
    );
  }

  if (tab === 2) {
    return (
      <Box
        sx={{
          mt: 4,
          color: '#FFFFFF',
          fontFamily: lora.style.fontFamily,
          textAlign: 'center',
        }}
      >
        <Suspense fallback={<StatsSkeleton />}>
          <Stats id={userId} books={books} booksLoading={booksLoading} />
        </Suspense>
      </Box>
    );
  }

  if (tab === 3) {
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
}
