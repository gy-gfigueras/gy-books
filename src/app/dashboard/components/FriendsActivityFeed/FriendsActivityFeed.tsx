/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ActivityBadges } from '@/app/components/atoms/ActivityCard/components/ActivityBadges';
import { ActivityIcon } from '@/app/components/atoms/ActivityCard/components/ActivityIcon';
import { UserAvatar } from '@/app/components/atoms/UserAvatar';
import { getActivityType } from '@/domain/activity.model';
import { FriendActivity } from '@/hooks/activities/useFriendsActivityFeed';
import { lora } from '@/utils/fonts/fonts';
import { AutoStories } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

const MotionBox = motion(Box);

const getActivityLabel = (type: string): string => {
  const labels: Record<string, string> = {
    started: 'Started Reading',
    finished: 'Finished',
    rated: 'Rated',
    progress: 'Progress Update',
    want_to_read: 'Want to Read',
    reviewed: 'Reviewed',
    other: 'Activity',
  };
  return labels[type] || 'Activity';
};

const FriendActivityItem: React.FC<{
  activity: any;
  bookCoverUrl?: string;
  index: number;
  onActivityClick: (bookId?: string) => void;
}> = ({ activity, index, onActivityClick }) => {
  const activityType = getActivityType(activity.message);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => onActivityClick(activity.bookId)}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 3,
        background:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
        },
      }}
    >
      {/* Header: Friend Info + Activity Type */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {/* Avatar con skeleton si está cargando */}
        {activity.userPicture === null && !activity.username ? (
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            animation="wave"
            sx={{
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
            }}
          />
        ) : (
          <UserAvatar
            src={activity.userPicture}
            alt={activity.username || 'User'}
            size={32}
            sx={{
              border: '2px solid rgba(59, 130, 246, 0.3)',
            }}
          />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Username con skeleton si está cargando */}
          {!activity.username ? (
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              animation="wave"
              sx={{
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                mb: 0.3,
              }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fff',
                lineHeight: 1.2,
              }}
            >
              {activity.username}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: lora.style.fontFamily,
            }}
          >
            {activity.formattedDate}
          </Typography>
        </Box>

        {/* Activity Type Icon */}
        <ActivityIcon type={activityType} size={20} />
      </Box>

      {/* Activity Type Label */}
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'rgba(59, 130, 246, 0.9)',
          mb: 0.5,
          fontFamily: lora.style.fontFamily,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {getActivityLabel(activityType)}
      </Typography>

      {/* Activity Message */}
      <Typography
        sx={{
          fontFamily: lora.style.fontFamily,
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.6,
          mb: 1.5,
        }}
      >
        {activity.message}
      </Typography>

      {/* Activity Badges */}
      <ActivityBadges activity={activity} />
    </MotionBox>
  );
};

const SkeletonItem: React.FC = () => (
  <Box
    sx={{
      mb: 2,
      p: 2,
      borderRadius: 3,
      background:
        'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    }}
  >
    {/* Header: Avatar + Info + Icon */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 1.5,
      }}
    >
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width={100}
          height={16}
          sx={{ mb: 0.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Skeleton
          variant="text"
          width={70}
          height={14}
          sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}
        />
      </Box>
      <Skeleton
        variant="circular"
        width={28}
        height={28}
        sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}
      />
    </Box>

    {/* Activity Type Label */}
    <Skeleton
      variant="text"
      width={120}
      height={14}
      sx={{ mb: 0.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
    />

    {/* Message */}
    <Skeleton
      variant="text"
      width="100%"
      height={16}
      sx={{ mb: 0.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
    />
    <Skeleton
      variant="text"
      width="80%"
      height={16}
      sx={{ mb: 1.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
    />

    {/* Badges */}
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton
        variant="rounded"
        width={60}
        height={24}
        sx={{ borderRadius: 3, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
      />
    </Box>
  </Box>
);

const EmptyState: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 4,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
      }}
    >
      <AutoStories sx={{ fontSize: 40, color: '#3b82f6' }} />
    </Box>
    <Typography
      variant="h6"
      sx={{
        fontFamily: lora.style.fontFamily,
        color: 'rgba(255, 255, 255, 0.7)',
        mb: 1,
        fontSize: '1.1rem',
        fontWeight: 600,
      }}
    >
      No friend activities yet
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: lora.style.fontFamily,
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.9rem',
        maxWidth: 300,
      }}
    >
      Add friends to see their reading activities here
    </Typography>
  </Box>
);

interface FriendsActivityFeedProps {
  activities: FriendActivity[];
  isLoading: boolean;
}

export const FriendsActivityFeed: React.FC<FriendsActivityFeedProps> = ({
  activities,
  isLoading,
}) => {
  const router = useRouter();

  const handleActivityClick = (bookId?: string) => {
    if (bookId) {
      router.push(`/books/${bookId}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <SkeletonItem key={i} />
        ))}
      </Box>
    );
  }

  // Empty state
  if (!activities || activities.length === 0) {
    return <EmptyState />;
  }

  // Content
  return (
    <>
      <AnimatePresence>
        {activities.map((activity, index) => (
          <FriendActivityItem
            key={`${activity.userId}-${activity.date}-${index}`}
            activity={activity}
            index={index}
            onActivityClick={handleActivityClick}
          />
        ))}
      </AnimatePresence>
    </>
  );
};
