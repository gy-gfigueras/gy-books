'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useRouter } from 'next/navigation';
import { lora } from '@/utils/fonts/fonts';

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    {
      title: 'Browse Books',
      icon: SearchIcon,
      color: '#9333ea',
      onClick: () => router.push('/books'),
    },
    {
      title: 'My Stats',
      icon: BarChartIcon,
      color: '#3b82f6',
      onClick: () => router.push('/profile?tab=2'),
    },
    {
      title: 'Calendar',
      icon: CalendarMonthIcon,
      color: '#10b981',
      onClick: () => router.push('/profile?view=calendar'),
    },
    {
      title: 'Hall of Fame',
      icon: EmojiEventsIcon,
      color: '#fbbf24',
      onClick: () => router.push('/profile?tab=1'),
    },
    {
      title: 'Community',
      icon: PeopleIcon,
      color: '#f59e0b',
      onClick: () => router.push('/users/community'),
    },
    {
      title: 'Timeline',
      icon: TimelineIcon,
      color: '#ef4444',
      onClick: () => router.push('/profile?view=timeline'),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 2,
          fontFamily: lora.style.fontFamily,
        }}
      >
        Quick Actions
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
        }}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paper
                onClick={action.onClick}
                sx={{
                  background: `linear-gradient(135deg, ${action.color}30 0%, ${action.color}10 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: 2,
                  border: `1px solid ${action.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  '&:hover': {
                    boxShadow: `0 8px 16px ${action.color}40`,
                    border: `1px solid ${action.color}60`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: `${action.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Icon sx={{ color: action.color, fontSize: 24 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    fontFamily: lora.style.fontFamily,
                  }}
                >
                  {action.title}
                </Typography>
              </Paper>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};
