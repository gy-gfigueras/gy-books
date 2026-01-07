'use client';

import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileHeader } from '@/app/profile/components/ProfileHeader/ProfileHeader';
import useMergedBooksIncremental from '@/hooks/books/useMergedBooksIncremental';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import { EBookStatus } from '@gycoding/nebula';
import { Box, Container, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useProfileFilters } from './hooks/useProfileFilters';
import { useProfileTabs } from './hooks/useProfileTabs';
import { useFilteredBooks } from './hooks/useFilteredBooks';
import { ProfileTabsNavigation } from './components/ProfileTabsNavigation/ProfileTabsNavigation';
import { BooksTab } from './components/BooksTab/BooksTab';
import { ProfileTabContent } from './components/ProfileTabContent/ProfileTabContent';
import { UserProfileSkeleton } from './components/UserProfileSkeleton/UserProfileSkeleton';

function ProfilePageContent() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading } = useAccountsUser(userId);

  // Custom hooks
  const filters = useProfileFilters(userId);
  const { activeTab, handleTabChange } = useProfileTabs();

  // Books data
  const {
    data: books = [],
    isLoading: loading,
    isDone,
  } = useMergedBooksIncremental(params.id as UUID, 50);
  const hasMore = !isDone;

  // Filtered books and options
  const { authorOptions, seriesOptions, filteredBooks } = useFilteredBooks({
    books,
    statusFilter: filters.statusFilter,
    authorFilter: filters.authorFilter,
    seriesFilter: filters.seriesFilter,
    ratingFilter: filters.ratingFilter,
    search: filters.search,
    orderBy: filters.orderBy,
    orderDirection: filters.orderDirection,
  });

  const statusOptions = [
    { label: 'Reading', value: EBookStatus.READING },
    { label: 'Read', value: EBookStatus.READ },
    { label: 'Want to read', value: EBookStatus.WANT_TO_READ },
  ];

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

  // Books tab content
  const booksTabContent = (
    <BooksTab
      filteredBooks={filteredBooks}
      hasMore={hasMore}
      statusOptions={statusOptions}
      statusFilter={filters.statusFilter}
      authorOptions={authorOptions}
      seriesOptions={seriesOptions}
      authorFilter={filters.authorFilter}
      seriesFilter={filters.seriesFilter}
      ratingFilter={filters.ratingFilter}
      search={filters.search}
      orderBy={filters.orderBy}
      orderDirection={filters.orderDirection}
      onStatusChange={filters.handleStatusFilterChange}
      onAuthorChange={filters.handleAuthorFilterChange}
      onSeriesChange={filters.handleSeriesFilterChange}
      onRatingChange={filters.handleRatingFilterChange}
      onSearchChange={filters.handleSearchChange}
      onOrderByChange={filters.handleOrderByChange}
      onOrderDirectionChange={filters.handleOrderDirectionChange}
    />
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 6 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        borderRadius: 0,
        boxShadow: 'none',
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
        }}
      >
        {/* Profile Header */}
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

        {/* Tabs Navigation and Content */}
        <Box sx={{ mt: 6 }}>
          <ProfileTabsNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <ProfileTabContent
            activeTab={activeTab}
            userId={user.id as UUID}
            books={books}
            booksLoading={loading}
            booksTabContent={booksTabContent}
          />
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
