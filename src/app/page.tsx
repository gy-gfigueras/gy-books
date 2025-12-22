'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { Hero } from './components/organisms/Hero';
import { FeaturesGrid } from './components/organisms/FeaturesGrid';
import { CTASection } from './components/organisms/CTASection';
import { Footer } from './components/organisms/Footer';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 6, sm: 8, md: 10 },
        }}
      >
        <Hero />
        <FeaturesGrid />
        <CTASection />
      </Container>
      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
}
