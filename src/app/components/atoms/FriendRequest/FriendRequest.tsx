import React from 'react';
import { lora } from '@/utils/fonts/fonts';
import { User } from '@/domain/friend.model';
import { Box, Typography, IconButton } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { ECommands } from '@/utils/constants/ECommands';
import Image from 'next/image';

interface FriendRequestProps {
  user: User | null;
  handleManageRequest: (requestId: string, command: ECommands) => Promise<void>;
  isLoadingManageRequest: (requestId: string) => boolean;
  requestId: string;
}

export default function FriendRequest({
  user,
  handleManageRequest,
  isLoadingManageRequest,
  requestId,
}: FriendRequestProps) {
  const isThisRequestLoading = isLoadingManageRequest(requestId);

  return (
    <Box
      component="a"
      href={`/users/${user?.id}`}
      key={user?.id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        gap: '1.5rem',
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '16px',
        padding: '1rem',
        width: { xs: '100%', md: '100%' },
        height: '100px',
        minWidth: { xs: '200px', md: '400px' },
        position: 'relative',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid rgba(147, 51, 234, 0.4)',
          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
        },
      }}
    >
      <Image
        src={user?.picture || ''}
        style={{
          width: 'auto',
          height: '100%',
          aspectRatio: '1/1',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        alt={user?.username || ''}
        width={100}
        height={100}
      />
      <Typography
        sx={{
          letterSpacing: '0.1rem',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: 16, md: 20 },
        }}
      >
        {user?.username || ''}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: '1rem',
          gap: '.2rem',
        }}
      >
        <IconButton
          sx={{ color: 'lightgreen' }}
          onClick={(e) => {
            e.preventDefault();
            handleManageRequest(requestId, ECommands.ACCEPT);
          }}
          disabled={isThisRequestLoading}
        >
          <Check />
        </IconButton>
        <IconButton
          sx={{ color: 'red' }}
          onClick={(e) => {
            e.preventDefault();
            handleManageRequest(requestId, ECommands.DENY);
          }}
          disabled={isThisRequestLoading}
        >
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
}
