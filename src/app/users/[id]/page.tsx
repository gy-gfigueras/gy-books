'use client';

import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileHeader } from '@/app/profile/components/ProfileHeader/ProfileHeader';
import { ProfileNavigation } from '@/app/profile/components/ProfileNavigation/ProfileNavigation';
import { CompactBooksFilter } from '@/app/profile/components/BooksFilter/CompactBooksFilter';
import { ProfileTabContent } from '@/app/profile/components/ProfileTabContent/ProfileTabContent';
import { BooksTab } from '@/app/profile/components/BooksTab/BooksTab';
import { ViewType } from '@/app/profile/components/BooksList/BooksList';
import useMergedBooksIncremental from '@/hooks/books/useMergedBooksIncremental';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import { useProfileFilters } from '@/app/profile/hooks/useProfileFilters';
import { ProfileBookHelpers } from '@/app/profile/utils/profileHelpers';
import { Box, Container, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import React from 'react';
import { UserProfileSkeleton } from './components/UserProfileSkeleton/UserProfileSkeleton';

function ProfilePageContent() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading } = useAccountsUser(userId);
  const [tab, setTab] = React.useState(0);
  const [view, setView] = React.useState<ViewType>('grid');

  // Books data
  const {
    data: books = [],
    isLoading: loading,
    isDone,
  } = useMergedBooksIncremental(params.id as UUID, 50);
  const hasMore = !isDone;

  // Filters
  const filters = useProfileFilters();

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

  // Loading state
  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  // No user found
  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>No user logged in</Typography>
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
          friendsCount={0}
          isLoadingFriends={false}
          onEditProfile={() => {}}
          biography={user.biography || ''}
          isEditingBiography={false}
          isLoadingBiography={false}
          onBiographyChange={() => {}}
          onBiographySave={() => {}}
          onBiographyCancel={() => {}}
          canEdit={false}
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
                isOwnProfile={false}
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
              userId={user.id as UUID}
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
