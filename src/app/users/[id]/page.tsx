'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { birthStone } from '@/utils/fonts/fonts';

export default function UserProfile() {
  const params = useParams();
  console.log(params);
  /*   const { data: user, isLoading } = useUserProfile(params.id as string);
   */

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        padding: '2rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '2rem',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: birthStone.style.fontFamily,
        }}
      >
        USER PROFILE
      </Typography>
    </Box>
  );
}
