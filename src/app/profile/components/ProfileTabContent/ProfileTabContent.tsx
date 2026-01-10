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
    console.log('[ProfileTabContent] Tab 2 - Stats tab rendering with:', {
      booksLoading,
      booksCount: books?.length || 0,
      userId,
      firstBook: books?.[0],
      booksStructure: books?.slice(0, 2),
    });

    // Show skeleton while loading
    if (booksLoading) {
      console.log(
        '[ProfileTabContent] Tab 2 - Showing skeleton (booksLoading=true)'
      );
      return (
        <Box
          sx={{
            mt: 4,
            color: '#FFFFFF',
            fontFamily: lora.style.fontFamily,
            textAlign: 'center',
          }}
        >
          <StatsSkeleton />
        </Box>
      );
    }

    // Books are already HardcoverBook[] from useMergedBooksIncremental
    // No need for complex transformation logic
    console.log(
      '[ProfileTabContent] Tab 2 - Passing books directly to Stats:',
      books?.length || 0,
      'books'
    );

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
          <Stats id={userId} books={books} booksLoading={false} />
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
