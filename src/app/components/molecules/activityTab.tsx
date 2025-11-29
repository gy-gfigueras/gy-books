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
import Image from 'next/image';
import React, { useMemo } from 'react';

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
      borderRadius: '6px',
      background: 'rgba(140, 84, 255, 0.2)',
      color: '#8C54FF',
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
  const { data: books, isLoading: booksLoading } =
    useHardcoverBatch(uniqueBookIds);

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

  const ActivityItem = React.memo(({ activity }: { activity: Activity }) => {
    const bookImage = activity.bookId ? booksMap.get(activity.bookId) : null;
    const activityType = getActivityType(activity.message);
    const ActivityIconComponent = getActivityIconComponent(activityType);
    const activityColor = getActivityColor(activityType);
    const progress = extractProgress(activity.message);
    const rating = extractRating(activity.message);
    const displayMessage = cleanMessage(activity.message);

    return (
      <Box
        component="a"
        href={`/books/${activity.bookId}`}
        key={activity.bookId}
        role="link"
        aria-label={`Go to book ${activity.bookId}`}
        sx={{
          p: 1.5,
          mb: 2,
          background: 'rgba(35, 35, 35, 0.85)',
          borderRadius: '12px',
          border: '1px solid #FFFFFF30',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            background: 'rgba(60, 60, 60, 0.95)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
          },
        }}
        tabIndex={0}
      >
        {/* Book Cover */}
        {booksLoading || !bookImage ? (
          <Skeleton
            variant="rectangular"
            width={60}
            height={90}
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: 70,
              height: 100,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Image
              src={bookImage}
              alt="Book cover"
              fill
              sizes="60px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}

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
      </Box>
    );
  });

  const SkeletonActivityItem = React.memo(() => (
    <Box
      sx={{
        p: 1.5,
        mb: 2,
        background: 'rgba(35, 35, 35, 0.85)',
        borderRadius: '12px',
        border: '1px solid #FFFFFF30',
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
            scrollbarColor: ' #8C54FF transparent',
          }}
        >
          {activities.map((activity: Activity, index: number) => (
            <ActivityItem
              activity={activity}
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
