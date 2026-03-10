'use client';

import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileLayout } from '@/app/profile/components/ProfileLayout/ProfileLayout';
import { useProfilePage } from '@/app/profile/hooks/useProfilePage';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { UserProfileSkeleton } from './components/UserProfileSkeleton/UserProfileSkeleton';
import { useAddFriend } from './hooks/useAddFriend';

function UserProfileContent() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading } = useAccountsUser(userId);
  const profilePage = useProfilePage({ userId, basePath: `/users/${userId}` });
  const {
    isFriend,
    isAdding,
    isSuccess,
    isError,
    handleAddFriend,
    setIsSuccess,
    setIsError,
  } = useAddFriend(userId);

  if (isLoading) return <UserProfileSkeleton />;

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>User not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <ProfileLayout
        user={user}
        basePath={`/users/${userId}`}
        {...profilePage}
        visitorProps={{
          isFriend,
          isAddingFriend: isAdding,
          onAddFriend: handleAddFriend,
        }}
      />
      <AnimatedAlert
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        message="Friend request sent!"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isError}
        onClose={() => setIsError(false)}
        message="Could not send friend request. Try again."
        severity={ESeverity.ERROR}
      />
    </>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  );
}
