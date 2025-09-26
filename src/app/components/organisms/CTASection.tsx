'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';
import Link from 'next/link';
export const CTASection = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ textAlign: 'center', marginTop: '2rem', position: 'relative' }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0) 70%)',
          zIndex: 0,
        }}
      />
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          marginBottom: '2rem',
          fontWeight: '700',
          position: 'relative',
          fontSize: 40,
          zIndex: 1,
          fontFamily: lora.style.fontFamily,
          letterSpacing: '.05rem',
        }}
      >
        {'Connect with Other Readers'}
      </Typography>
      <Typography
        sx={{
          color: '#FFFFFF80',
          marginBottom: '2.5rem',
          fontSize: '1.4rem',
          lineHeight: 1.6,
          position: 'relative',
          fontFamily: lora.style.fontFamily,
          letterSpacing: '.05rem',
          zIndex: 1,
        }}
      >
        {
          'Discover readers with similar tastes and share your literary experiences.'
        }
      </Typography>
      <Link style={{ textDecoration: 'none' }} href="/users/search">
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: '#9333ea',
            color: 'white',
            padding: '1.2rem 2.5rem',
            fontSize: '1.2rem',
            fontFamily: lora.style.fontFamily,
            fontWeight: 'bold',
            letterSpacing: '.3rem',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              borderColor: '#a855f7',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {'Search Users'}
        </Button>
      </Link>
    </Container>
  );
};
