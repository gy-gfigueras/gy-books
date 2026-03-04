'use client';

import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton/ProfileSkeleton';
import { ProfileLayout } from '@/app/profile/components/ProfileLayout/ProfileLayout';
import { useProfilePage } from '@/app/profile/hooks/useProfilePage';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { UserProfileSkeleton } from './components/UserProfileSkeleton/UserProfileSkeleton';

function UserProfileContent() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading } = useAccountsUser(userId);
  const profilePage = useProfilePage({ userId, basePath: `/users/${userId}` });

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
    <ProfileLayout user={user} basePath={`/users/${userId}`} {...profilePage} />
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  );
}
