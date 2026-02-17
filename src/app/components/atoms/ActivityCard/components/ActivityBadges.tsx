'use client';

import {
  Activity,
  extractProgress,
  extractRating,
  extractReview,
} from '@/domain/activity.model';
import { BarChart, Comment, Star } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';
import React from 'react';

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
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            color: '#c084fc',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#c084fc',
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
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            color: '#a855f7',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#a855f7',
            },
          }}
        />
      )}
    </Box>
  );
};
