import { Friend } from '@/domain/friend.model';
import { lora } from '@/utils/fonts/fonts';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;
const MotionIconButton = motion(IconButton);

interface FriendCardProps {
  friend: Friend;
  isDeleteLoading: boolean;
  handleDeleteFriend: (userId: string) => Promise<void>;
}

export default function FriendCard({
  friend,
  isDeleteLoading,
  handleDeleteFriend,
}: FriendCardProps) {
  return (
    <MotionBox
      component="a"
      href={`/users/${friend.id}`}
      key={friend.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '0.875rem 1rem',
        width: '100%',
        textDecoration: 'none',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: '50%',
          border: '1.5px solid rgba(147, 51, 234, 0.3)',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={friend.picture}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          alt={friend.username}
          width={48}
          height={48}
        />
      </Box>
      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          letterSpacing: '0.05rem',
          fontWeight: 600,
          color: 'white',
          fontFamily: lora.style.fontFamily,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {friend.username}
      </Typography>
      <MotionIconButton
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        loading={isDeleteLoading}
        sx={{
          flexShrink: 0,
          width: '44px',
          height: '44px',
          background:
            'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          right: '1rem',
          color: '#ff5353',
          transition: 'all 0.3s ease',
          '&:hover': {
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.2) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          },
        }}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          event.preventDefault();
          handleDeleteFriend(friend.id);
        }}
      >
        <DeleteIcon />
      </MotionIconButton>
    </MotionBox>
  );
}
