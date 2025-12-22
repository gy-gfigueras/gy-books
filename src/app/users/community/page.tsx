'use client';
import React, { Suspense } from 'react';
import { useFriends } from '@/hooks/useFriends';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { birthStone } from '@/utils/fonts/fonts';
import CustomTitle from '@/app/components/atoms/BookTitle/CustomTitle';

// Hooks
import { useUsersTab } from './hooks/useUsersTab';
import { useUserSearch } from './hooks/useUserSearch';

// Components
import { TabNavigation } from './components/TabNavigation/TabNavigation';
import { FriendsTab } from './components/FriendsTab/FriendsTab';
import { DiscoverTab } from './components/DiscoverTab/DiscoverTab';

const MotionBox = motion(Box);

function FriendsPageContent() {
  const { tab, setTab } = useUsersTab();
  const {
    data,
    isLoading,
    handleDeleteFriend,
    isLoadingDelete,
    setErrorDelete,
    errorDelete,
    isSuccessDelete,
    setIsSuccessDelete,
    count,
  } = useFriends();

  const {
    search,
    setSearch,
    users,
    isAddingFriend,
    successMessage,
    setSuccessMessage,
    handleAddFriend,
  } = useUserSearch();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        pt: 4,
        pb: 4,
      }}
    >
      <CustomTitle
        text="Community"
        size="6rem"
        fontFamily={birthStone.style.fontFamily}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      />

      <TabNavigation tab={tab} friendsCount={count} onTabChange={setTab} />

      {tab === 0 && (
        <DiscoverTab
          search={search}
          users={users}
          isAddingFriend={isAddingFriend}
          successMessage={successMessage}
          onSearchChange={setSearch}
          onAddFriend={handleAddFriend}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {tab === 1 && (
        <FriendsTab
          data={data}
          isLoading={isLoading}
          isLoadingDelete={isLoadingDelete}
          errorDelete={errorDelete}
          isSuccessDelete={isSuccessDelete}
          handleDeleteFriend={handleDeleteFriend}
          setErrorDelete={setErrorDelete}
          setIsSuccessDelete={setIsSuccessDelete}
        />
      )}
    </MotionBox>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
          }}
        >
          <CircularProgress sx={{ color: '#a855f7' }} />
        </Box>
      }
    >
      <FriendsPageContent />
    </Suspense>
  );
}
