'use client';
import React from 'react';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { Box, Typography } from '@mui/material';
import FriendRequest from '@/app/components/atoms/FriendRequest';
import { goudi } from '@/utils/fonts/fonts';
import AnimatedAlert from '@/app/components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import FriendCardSkeleton from '@/app/components/atoms/FriendCardSkeleton';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { UUID } from 'crypto';

export default function FriendsRequestPage() {
  const { user } = useGyCodingUser();
  const {
    data,
    isLoading,
    isLoadingUsers,
    users,
    friendRequestsWithUsers,
    isLoadingManageRequest,
    errorManageRequest,
    setErrorManageRequest,
    isSuccessManageRequest,
    setIsSuccessManageRequest,
    handleManageRequest,
  } = useFriendRequests(user?.id as UUID);

  console.log('data', data);
  console.log('isLoading', isLoading);
  console.log('isLoadingUsers', isLoadingUsers);
  console.log('users', users);
  console.log('friendRequestsWithUsers', friendRequestsWithUsers);

  const handleOpenErrorAlertClose = () => {
    setErrorManageRequest(false);
  };

  const handleOpenSuccessAlertClose = () => {
    setIsSuccessManageRequest(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            fontFamily: goudi.style.fontFamily,
          }}
        >
          Friends Request
        </Typography>
        {isLoading || isLoadingUsers ? (
          <FriendCardSkeleton />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {friendRequestsWithUsers?.map((requestWithUser) => (
              <FriendRequest
                key={requestWithUser.id}
                user={requestWithUser.user}
                handleManageRequest={handleManageRequest}
                isLoadingManageRequest={isLoadingManageRequest}
                requestId={requestWithUser.id}
              />
            ))}
          </Box>
        )}
        {data?.length === 0 && (
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              fontFamily: goudi.style.fontFamily,
            }}
          >
            No friend requests
          </Typography>
        )}
      </Box>
      <AnimatedAlert
        open={errorManageRequest}
        onClose={handleOpenErrorAlertClose}
        severity={ESeverity.ERROR}
        message="Failed to manage request"
      />
      <AnimatedAlert
        open={isSuccessManageRequest}
        onClose={handleOpenSuccessAlertClose}
        severity={ESeverity.SUCCESS}
        message="Request managed successfully"
      />
    </>
  );
}
