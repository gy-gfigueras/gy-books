'use client';

import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

interface StatCardProps {
  title: string;
  delay?: number;
  children: React.ReactNode;
}

const cardSx = {
  width: { xs: '100%', sm: '460px', md: '500px' },
  minHeight: '400px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 2,
  flexDirection: 'column',
  gap: 1,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
};

const StatCard: React.FC<StatCardProps> = ({ title, delay = 0, children }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    sx={cardSx}
  >
    <Typography
      sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
      variant="h4"
    >
      {title}
    </Typography>
    {children}
  </MotionBox>
);

export default StatCard;
