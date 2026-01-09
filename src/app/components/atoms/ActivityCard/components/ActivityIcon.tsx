'use client';

import React from 'react';
import { Box } from '@mui/material';
import { ActivityType, getActivityColor } from '@/domain/activity.model';
import {
  Book,
  CheckCircle,
  Star,
  BarChart,
  Bookmark,
  Comment,
  Circle,
} from '@mui/icons-material';

interface ActivityIconProps {
  type: ActivityType;
  size?: number;
}

const iconMap: Record<ActivityType, React.ElementType> = {
  [ActivityType.STARTED]: Book,
  [ActivityType.FINISHED]: CheckCircle,
  [ActivityType.RATED]: Star,
  [ActivityType.PROGRESS]: BarChart,
  [ActivityType.WANT_TO_READ]: Bookmark,
  [ActivityType.REVIEWED]: Comment,
  [ActivityType.OTHER]: Circle,
};

export const ActivityIcon: React.FC<ActivityIconProps> = ({
  type,
  size = 24,
}) => {
  const IconComponent = iconMap[type];
  const color = getActivityColor(type);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 8,
        height: size + 8,
        borderRadius: '50%',
        backgroundColor: `${color}20`,
      }}
    >
      <IconComponent sx={{ fontSize: size, color }} />
    </Box>
  );
};
