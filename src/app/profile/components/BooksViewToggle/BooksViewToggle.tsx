'use client';
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export type ViewType = 'grid' | 'list' | 'timeline' | 'calendar';

interface BooksViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const BooksViewToggle: React.FC<BooksViewToggleProps> = ({
  view,
  onViewChange,
}) => {
  const views: { type: ViewType; icon: React.ReactElement; label: string }[] = [
    { type: 'grid', icon: <GridViewIcon />, label: 'Grid View' },
    { type: 'list', icon: <ViewListIcon />, label: 'List View' },
    { type: 'timeline', icon: <TimelineIcon />, label: 'Timeline View' },
    { type: 'calendar', icon: <CalendarMonthIcon />, label: 'Calendar View' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        borderRadius: '12px',
        padding: '4px',
        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
      }}
    >
      {views.map((viewOption) => {
        const isActive = view === viewOption.type;
        return (
          <Tooltip key={viewOption.type} title={viewOption.label} arrow>
            <Box sx={{ position: 'relative' }}>
              {isActive && (
                <MotionBox
                  layoutId="activeViewBackground"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={() => onViewChange(viewOption.type)}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 36,
                  height: 36,
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: '#fff',
                    transform: isActive ? 'scale(1.05)' : 'scale(1.1)',
                  },
                  '& svg': {
                    fontSize: '1.25rem',
                    filter: isActive
                      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                      : 'none',
                  },
                }}
              >
                {viewOption.icon}
              </IconButton>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};
