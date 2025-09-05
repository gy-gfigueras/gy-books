/* eslint-disable react/display-name */
import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { goudi } from '@/utils/fonts/fonts';
import { Activity } from '@/domain/activity.model';
import { BookImage } from '../atoms/BookImage';
import { UUID } from 'crypto';
import { useActivities } from '@/hooks/useActivities';

interface ActivityTabProps {
  id: UUID;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ id }) => {
  const { data: activities, isLoading } = useActivities(id);

  const ActivityItem = React.memo(({ activity }: { activity: Activity }) => (
    <Box
      component="a"
      href={`/books/${activity.bookId}`}
      key={activity.id || activity.bookId}
      role="link"
      aria-label={`Go to book ${activity.bookId}`}
      sx={{
        p: 2,
        mb: 2,
        height: '100px',
        background: 'rgba(35, 35, 35, 0.85)',
        borderRadius: '12px',
        border: '1px solid #FFFFFF30',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        textDecoration: 'none',
        transition: 'background 0.2s',
        '&:hover': { background: 'rgba(60, 60, 60, 0.95)' },
      }}
      tabIndex={0}
    >
      <BookImage bookId={activity.bookId as string} />
      <Typography
        variant="body1"
        sx={{ color: '#fff', fontFamily: goudi.style.fontFamily }}
      >
        {activity.message}
      </Typography>
    </Box>
  ));

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: goudi.style.fontFamily,
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                mb: 2,
                height: '100px',
                background: 'rgba(35, 35, 35, 0.85)',
                borderRadius: '12px',
                border: '1px solid #FFFFFF30',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width={60}
                height={80}
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={18} />
              </Box>
            </Box>
          ))}
        </Box>
      ) : activities && activities.length > 0 ? (
        <Box sx={{ maxHeight: 500, overflowY: 'auto', px: 1 }}>
          {activities.map((activity: Activity) => (
            <ActivityItem
              activity={activity}
              key={activity.id || activity.bookId}
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
          <Typography
            variant="body1"
            sx={{ color: '#fff', fontFamily: goudi.style.fontFamily }}
          >
            No hay actividades disponibles.
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: '#fff',
              opacity: 0.5,
            }}
          >
            💤
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ActivityTab;
