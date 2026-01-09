/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { User } from '@/domain/user.model';
import { useFriends } from '@/hooks/useFriends';
import { RootState } from '@/store';
import { ESeverity } from '@/utils/constants/ESeverity';
import { Box, Container, Typography } from '@mui/material';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import AnimatedAlert from '../components/atoms/Alert/Alert';
import ProfileSkeleton from '../components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { ProfilePageSkeleton } from './components/ProfilePageSkeleton';

// Hooks
import { useProfileBiography } from './hooks/useProfileBiography';
import { useProfileFilters } from './hooks/useProfileFilters';
import { useProfileTabs } from './hooks/useProfileTabs';
import useMergedBooksIncremental from '@/hooks/books/useMergedBooksIncremental';
import { useSearchParams } from 'next/navigation';

// Components
import { BooksTab } from './components/BooksTab/BooksTab';
import { ProfileNavigation } from './components/ProfileNavigation/ProfileNavigation';
import { ProfileTabContent } from './components/ProfileTabContent/ProfileTabContent';
import { CompactBooksFilter } from './components/BooksFilter/CompactBooksFilter';
import { ViewType } from './components/BooksList/BooksList';

// Helpers
import { ProfileBookHelpers } from './utils/profileHelpers';

function ProfilePageContent() {
  const user = useSelector(
    (state: RootState) => state.user.profile
  ) as User | null;
  const isLoading = !user;
  const searchParams = useSearchParams();

  const { tab, setTab } = useProfileTabs();
  const [view, setView] = React.useState<ViewType>('grid');

  // Handle view query param
  React.useEffect(() => {
    const viewParam = searchParams.get('view');
    if (
      viewParam &&
      ['grid', 'list', 'timeline', 'calendar'].includes(viewParam)
    ) {
      setView(viewParam as ViewType);
    }
  }, [searchParams]);

  const { count: friendsCount, isLoading: isLoadingFriends } = useFriends();
  const filters = useProfileFilters();
  const {
    data: books,
    isLoading: loading,
    isDone,
  } = useMergedBooksIncremental(user?.id as string, 50);
  const hasMore = !isDone;

  const {
    biography,
    isEditingBiography,
    isLoadingBiography,
    isUpdatedBiography,
    isErrorBiography,
    handleBiographyChange,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsUpdatedBiography,
    setIsErrorBiography,
  } = useProfileBiography(user);

  // Generar opciones de filtros desde los libros
  const filterOptions = React.useMemo(() => {
    return ProfileBookHelpers.generateFilterOptions(books);
  }, [books]);

  // Filtrar y ordenar libros
  const filteredBooks = React.useMemo(() => {
    const filtered = ProfileBookHelpers.filterBooks(books, filters);
    return ProfileBookHelpers.sortBooks(
      filtered,
      filters.orderBy,
      filters.orderDirection
    );
  }, [books, filters]);

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>No hay usuario logueado</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 0 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 64px)',
        height: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        paddingTop: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%' },
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <ProfileHeader
          user={user}
          friendsCount={friendsCount}
          isLoadingFriends={isLoadingFriends}
          onEditProfile={handleEditBiography}
          biography={biography}
          isEditingBiography={isEditingBiography}
          isLoadingBiography={isLoadingBiography}
          onBiographyChange={handleBiographyChange}
          onBiographySave={handleBiographySave}
          onBiographyCancel={handleCancelBiography}
          books={books}
          isLoadingBooks={loading}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            mt: 0,
            minHeight: 0,
          }}
        >
          <ProfileNavigation
            activeTab={tab}
            onTabChange={setTab}
            booksCount={books?.length || 0}
            hallOfFameCount={
              books?.filter((b) => b.userData?.hallOfFame)?.length || 0
            }
          >
            {tab === 0 && (
              <CompactBooksFilter
                statusOptions={filterOptions.statusOptions}
                statusFilter={filters.status}
                authorOptions={filterOptions.authorOptions}
                seriesOptions={filterOptions.seriesOptions}
                authorFilter={filters.author}
                seriesFilter={filters.series}
                ratingFilter={filters.rating}
                search={filters.search}
                onStatusChange={filters.handleStatusFilterChange}
                onAuthorChange={filters.handleAuthorFilterChange}
                onSeriesChange={filters.handleSeriesFilterChange}
                onRatingChange={filters.handleRatingFilterChange}
                onSearchChange={filters.handleSearchChange}
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onOrderByChange={filters.handleOrderByChange}
                onOrderDirectionChange={filters.handleOrderDirectionChange}
                view={view}
                onViewChange={setView}
                isOwnProfile={true}
              />
            )}
          </ProfileNavigation>
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ProfileTabContent
              tab={tab}
              userId={user.id}
              books={books}
              booksLoading={loading}
            >
              <BooksTab
                books={books}
                filteredBooks={filteredBooks}
                loading={loading}
                hasMore={hasMore}
                filterOptions={filterOptions}
                filters={filters}
                view={view}
                onViewChange={setView}
              />
            </ProfileTabContent>
          </Box>
        </Box>
      </Box>
      <AnimatedAlert
        open={isUpdatedBiography}
        onClose={() => setIsUpdatedBiography(false)}
        message="Biography updated successfully"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorBiography}
        onClose={() => setIsErrorBiography(false)}
        message="Error updating biography"
        severity={ESeverity.ERROR}
      />
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
