import React from 'react';
import { goudi } from '@/utils/fonts/fonts';
import { Friend } from '@/domain/friend.model';
import { Box, Avatar, Typography } from '@mui/material';

export default function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Box
      component="a"
      href={`/users/${friend.id}`}
      key={friend.id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        gap: '1.5rem',
        backgroundColor: '#232323',
        borderRadius: '16px',
        padding: '1rem',
        width: { xs: '90%', md: '25%' },
        height: '100px',
        minWidth: { xs: '200px', md: '400px' },
        position: 'relative',
        textDecoration: 'none',
      }}
    >
      <Avatar
        src={friend.picture}
        sx={{
          width: 'auto',
          height: '100%',
          aspectRatio: '1/1',
        }}
      />
      <Typography
        sx={{
          fontSize: '22px',
          letterSpacing: '0.1rem',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: goudi.style.fontFamily,
        }}
      >
        {friend.username}
      </Typography>
    </Box>
  );
}
