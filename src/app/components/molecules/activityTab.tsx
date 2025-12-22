/* eslint-disable react/display-name */
import {
  Activity,
  ActivityType,
  cleanMessage,
  extractProgress,
  extractRating,
  getActivityColor,
  getActivityType,
} from '@/domain/activity.model';
import type HardcoverBook from '@/domain/HardcoverBook';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import { useActivities } from '@/hooks/useActivities';
import { lora } from '@/utils/fonts/fonts';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
import { Box, Skeleton, Typography } from '@mui/material';
import { UUID } from 'crypto';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface ActivityTabProps {
  id: UUID;
}

// Helper function to get icon component
const getActivityIconComponent = (type: ActivityType) => {
  switch (type) {
    case ActivityType.STARTED:
      return BookIcon;
    case ActivityType.FINISHED:
      return CheckCircleIcon;
    case ActivityType.RATED:
      return StarIcon;
    case ActivityType.PROGRESS:
      return BarChartIcon;
    case ActivityType.WANT_TO_READ:
      return BookmarkIcon;
    case ActivityType.OTHER:
      return CircleIcon;
  }
};

// Progress Badge Component
const ProgressBadge: React.FC<{ progress: number }> = ({ progress }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.5,
      borderRadius: '8px',
      background:
        'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
      border: '1px solid rgba(147, 51, 234, 0.4)',
      color: '#c084fc',
    }}
  >
    <BarChartIcon sx={{ fontSize: 14 }} />
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        fontFamily: lora.style.fontFamily,
      }}
    >
      {progress}%
    </Typography>
  </Box>
);

// Rating Badge Component
const RatingBadge: React.FC<{ rating: number }> = ({ rating }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.5,
      borderRadius: '6px',
      background: 'rgba(255, 193, 7, 0.2)',
      color: '#FFC107',
    }}
  >
    <StarIcon sx={{ fontSize: 14 }} />
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        fontFamily: lora.style.fontFamily,
      }}
    >
      {rating.toFixed(1)}
    </Typography>
  </Box>
);

const ActivityTab: React.FC<ActivityTabProps> = ({ id }) => {
  const { data: activities, isLoading, uniqueBookIds } = useActivities(id);
  const { data: books } = useHardcoverBatch(uniqueBookIds);

  // Crear un mapa de bookId -> imagen para acceso rápido
  const booksMap = useMemo(() => {
    if (!books) return new Map<string, string>();
    return new Map(
      books.map((book: HardcoverBook) => {
        const imageUrl = book.cover?.url || '/placeholder-book.png';
        return [String(book.id), imageUrl];
      })
    );
  }, [books]);

  // Mover ActivityItem fuera y memoizarlo con useCallback
  const ActivityItem = React.useCallback(
    ({ activity, index }: { activity: Activity; index: number }) => {
      const bookImage = activity.bookId ? booksMap.get(activity.bookId) : null;
      const activityType = getActivityType(activity.message);
      const ActivityIconComponent = getActivityIconComponent(activityType);
      const activityColor = getActivityColor(activityType);
      const progress = extractProgress(activity.message);
      const rating = extractRating(activity.message);
      const displayMessage = cleanMessage(activity.message);

      return (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.05,
            ease: [0.4, 0, 0.2, 1],
          }}
          component="a"
          href={`/books/${activity.bookId}`}
          role="link"
          aria-label={`Go to book ${activity.bookId}`}
          sx={{
            p: 1.5,
            mb: 2,
            background:
              'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow:
              '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(147, 51, 234, 0.15)',
            '&:hover': {
              background:
                'linear-gradient(145deg, rgba(147, 51, 234, 0.18) 0%, rgba(168, 85, 247, 0.12) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow:
                '0 8px 16px rgba(147, 51, 234, 0.25), 0 4px 8px rgba(0, 0, 0, 0.3)',
            },
          }}
          tabIndex={0}
        >
          {/* Book Cover */}
          <Box
            sx={{
              position: 'relative',
              width: 70,
              height: 100,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
            }}
          >
            {!bookImage && (
              <Skeleton
                variant="rectangular"
                width={70}
                height={100}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: 1,
                }}
              />
            )}
            {bookImage && (
              <Box
                component="img"
                src={bookImage}
                alt="Book cover"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>

          {/* Activity Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'flex-start',
              textAlign: 'left',
              justifyContent: 'center',
            }}
          >
            {/* Activity Icon and Date */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 0.75,
              }}
            >
              <ActivityIconComponent
                sx={{
                  fontSize: 14,
                  color: activityColor,
                }}
              />
              {activity.formattedDate && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#AAAAAA',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 12,
                  }}
                >
                  {activity.formattedDate}
                </Typography>
              )}
            </Box>

            {/* Activity Message */}
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {displayMessage}
            </Typography>

            {/* Progress or Rating Badge */}
            {progress !== null && <ProgressBadge progress={progress} />}
            {rating !== null && <RatingBadge rating={rating} />}
          </Box>
        </MotionBox>
      );
    },
    [booksMap]
  );

  const SkeletonActivityItem = React.memo(() => (
    <Box
      sx={{
        p: 1.5,
        mb: 2,
        background:
          'linear-gradient(145deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      {/* Cover Skeleton */}
      <Skeleton
        variant="rectangular"
        width={60}
        height={90}
        sx={{ borderRadius: 1, flexShrink: 0 }}
      />

      {/* Content Skeleton */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Icon and Date Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width={80} height={12} />
        </Box>

        {/* Message Skeleton */}
        <Skeleton variant="text" width="100%" height={14} />
        <Skeleton variant="text" width="80%" height={14} />

        {/* Badge Skeleton */}
        <Skeleton
          variant="rectangular"
          width={60}
          height={24}
          sx={{ borderRadius: '6px' }}
        />
      </Box>
    </Box>
  ));

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: lora.style.fontFamily,
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          {[...Array(5)].map((_, i) => (
            <SkeletonActivityItem key={i} />
          ))}
        </Box>
      ) : activities && activities.length > 0 ? (
        <Box
          sx={{
            maxHeight: '70vh',
            overflowY: 'auto',
            px: 1,
            scrollbarColor: '#9333ea transparent',
            '&::-webkit-scrollbar': { width: 8 },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(147, 51, 234, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
              borderRadius: 4,
            },
          }}
        >
          {activities.map((activity: Activity, index: number) => (
            <ActivityItem
              activity={activity}
              index={index}
              key={`${activity.bookId || 'activity'}-${index}-${activity.date ? new Date(activity.date).getTime() : Date.now()}`}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              fontSize: 80,
              background: 'linear-gradient(135deg, #8C54FF, #B388FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🕐
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
              }}
            >
              No Activity Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#AAAAAA',
                fontFamily: lora.style.fontFamily,
              }}
            >
              Your reading activities will appear here
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ActivityTab;
