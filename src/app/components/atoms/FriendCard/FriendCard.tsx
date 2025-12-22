import React from 'react';
import { lora } from '@/utils/fonts/fonts';
import { Friend } from '@/domain/friend.model';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';

const MotionBox = motion(Box);
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
        justifyContent: 'left',
        gap: '1.5rem',
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '16px',
        padding: '1rem',
        width: { xs: '90%', md: '25%' },
        height: '100px',
        minWidth: { xs: '200px', md: '400px' },
        position: 'relative',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          border: '1px solid rgba(147, 51, 234, 0.4)',
          boxShadow: '0 8px 20px rgba(147, 51, 234, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '2px solid rgba(147, 51, 234, 0.3)',
          padding: '2px',
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
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
          width={100}
          height={100}
        />
      </Box>
      <Typography
        sx={{
          fontSize: '20px',
          letterSpacing: '0.05rem',
          fontWeight: '600',
          color: 'white',
          fontFamily: lora.style.fontFamily,
        }}
      >
        {friend.username}
      </Typography>
      <MotionIconButton
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        loading={isDeleteLoading}
        sx={{
          position: 'absolute',
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
