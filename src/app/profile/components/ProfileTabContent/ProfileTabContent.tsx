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
    // Show skeleton while loading
    if (booksLoading) {
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

    // Transform UserProfileBook[] to HardcoverBook[]
    // Detectar si el libro ya tiene la estructura correcta o si tiene hardcoverBook anidado
    const hardcoverBooks =
      books?.map((book) => {
        // Si el libro YA tiene la estructura correcta (es un HardcoverBook directamente)
        if ('id' in book && 'title' in book && !('hardcoverBook' in book)) {
          return {
            ...book,
            userData: book.userData,
            pageCount: book.pageCount || 0,
          };
        }

        // Si tiene la estructura antigua con hardcoverBook anidado
        if ('hardcoverBook' in book && book.hardcoverBook) {
          return {
            ...book.hardcoverBook,
            userData: book.userData,
            pageCount: book.hardcoverBook.pageCount || 0,
          };
        }

        // Fallback: retornar el libro tal cual
        return book;
      }) || [];

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
          <Stats id={userId} books={hardcoverBooks} booksLoading={false} />
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
