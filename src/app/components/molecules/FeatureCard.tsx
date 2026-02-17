'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactElement<SvgIconComponent>;
}

export const FeatureCard = ({
  title,
  description,
  features,
  icon,
}: FeatureCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(35, 35, 35, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '2.5rem',
        borderRadius: '24px',
        height: '100%',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          backgroundColor: 'rgba(35, 35, 35, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
        zIndex: 40,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            padding: '1rem',
            borderRadius: '16px',
            marginRight: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(147, 51, 234, 0.2)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box sx={{ color: '#9333ea', fontSize: 32 }}>{icon}</Box>
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: '700',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{ color: '#FFFFFF80', marginBottom: '1.5rem', lineHeight: 1.6 }}
      >
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              color: '#FFFFFF60',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#FFFFFF',
                transform: 'translateX(5px)',
              },
            }}
          >
            <Chip
              label={feature}
              sx={{
                backgroundColor: 'transparent',
                border: '1px solid #9333ea',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '16px',
                fontWeight: 'bold',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
