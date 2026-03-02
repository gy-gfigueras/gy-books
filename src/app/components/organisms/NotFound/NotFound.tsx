'use client';

import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import Link from 'next/link';
import LottieAnimation from '@/app/components/atoms/LottieAnimation/LottieAnimation';
import animationData from '@/../public/lottie/404.json';

const Container = styled(Box)(() => ({
  //   minHeight: '100vh',
  backgroundColor: '#0A0A0A',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  padding: '2rem',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at center, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const AnimationWrapper = styled(Box)(() => ({
  width: '100%',
  maxWidth: '420px',
  position: 'relative',
  zIndex: 1,
}));

const Title = styled(Typography)(() => ({
  color: '#ededed',
  fontWeight: 700,
  position: 'relative',
  zIndex: 1,
}));

const Subtitle = styled(Typography)(() => ({
  color: 'rgba(237, 237, 237, 0.6)',
  maxWidth: '380px',
  position: 'relative',
  zIndex: 1,
}));

const BackButton = styled(Button)(() => ({
  backgroundColor: '#9333ea',
  color: '#fff',
  textTransform: 'none',
  fontSize: '1rem',
  padding: '0.6rem 2rem',
  borderRadius: '8px',
  position: 'relative',
  zIndex: 1,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#7e22ce',
  },
}));

const NotFound: React.FC = () => {
  return (
    <Container>
      <AnimationWrapper>
        <LottieAnimation
          animationData={animationData}
          loop
          autoplay
          style={{ width: '100%', height: 'auto' }}
        />
      </AnimationWrapper>

      <Title variant="h4">Page Not Found</Title>

      <Subtitle variant="body1">
        It seems this page has been lost among the pages of a book...
      </Subtitle>

      <BackButton component={Link} href="/" variant="contained">
        Back to Home
      </BackButton>
    </Container>
  );
};

export default NotFound;
