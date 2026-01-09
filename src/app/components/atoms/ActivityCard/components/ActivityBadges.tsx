'use client';

import React from 'react';
import { Box, Chip } from '@mui/material';
import { BarChart, Star, Comment } from '@mui/icons-material';
import {
  Activity,
  extractProgress,
  extractRating,
  extractReview,
} from '@/domain/activity.model';

interface ActivityBadgesProps {
  activity: Activity;
}

export const ActivityBadges: React.FC<ActivityBadgesProps> = ({ activity }) => {
  const progress = extractProgress(activity.message);
  const rating = extractRating(activity.message);
  const review = extractReview(activity.message);

  const hasBadges = progress !== null || rating !== null || review !== null;

  if (!hasBadges) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {progress !== null && (
        <Chip
          icon={<BarChart sx={{ fontSize: 16 }} />}
          label={`${progress}%`}
          size="small"
          sx={{
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            color: '#9333ea',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#9333ea',
            },
          }}
        />
      )}

      {rating !== null && (
        <Chip
          icon={<Star sx={{ fontSize: 16 }} />}
          label={`${rating} stars`}
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            color: '#FFC107',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#FFC107',
            },
          }}
        />
      )}

      {review !== null && (
        <Chip
          icon={<Comment sx={{ fontSize: 16 }} />}
          label="Review"
          size="small"
          sx={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#10B981',
            },
          }}
        />
      )}
    </Box>
  );
};
