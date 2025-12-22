'use client';
import React, { useState, useMemo } from 'react';
import { Friend } from '@/domain/friend.model';
import FriendCard from '@/app/components/atoms/FriendCard/FriendCard';
import FriendCardSkeleton from '@/app/components/atoms/FriendCard/FriendCardSkeleton';
import { useFriends } from '@/hooks/useFriends';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { birthStone, lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
import { useRouter } from 'next/navigation';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import CustomTitle from '@/app/components/atoms/BookTitle/CustomTitle';

export default function FriendsPage() {
  const {
    data,
    isLoading,
    handleDeleteFriend,
    isLoadingDelete,
    setErrorDelete,
    errorDelete,
    isSuccessDelete,
    setIsSuccessDelete,
  } = useFriends();
  const [search, setSearch] = useState('');
  const router = useRouter();
  // Filtra amigos por nombre de usuario (case-insensitive)
  const filteredFriends = useMemo(() => {
    if (!data) return [];
    return data.filter((friend) =>
      friend.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          pt: 4,
        }}
      >
        <CustomTitle
          text="Friends"
          size="6rem"
          fontFamily={birthStone.style.fontFamily}
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '1rem',
          }}
        >
          <TextField
            placeholder="Search for a friend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            sx={{
              mb: '8px',
              width: ['90%', '70%', '60%'],
              maxWidth: '600px',
              backgroundColor: 'rgba(147, 51, 234, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              fontFamily: lora.style.fontFamily,
              '& .MuiOutlinedInput-root': {
                minHeight: '56px',
                '& fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                  borderRadius: '16px',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9333ea',
                  borderWidth: '2px',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                fontFamily: lora.style.fontFamily,
                fontSize: '18px',
              },
            }}
            slotProps={{
              htmlInput: {
                style: {
                  width: '100%',
                  color: 'white',
                  fontFamily: lora.style.fontFamily,
                  fontSize: '20px',

                  fieldSet: {
                    borderColor: 'white',
                    fontFamily: lora.style.fontFamily,
                  },
                },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <MotionIconButton
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              router.push('/users/search');
            }}
            sx={{
              borderRadius: '12px',
              backgroundColor: 'rgba(147, 51, 234, 0.15)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '-5px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.25)',
                border: '1px solid rgba(147, 51, 234, 0.5)',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
              },
            }}
          >
            <PersonAddIcon sx={{ fontSize: '32px', color: '#a855f7' }} />
          </MotionIconButton>
        </Box>

        {isLoading || !data ? (
          Array.from({ length: 3 }).map((_, i) => (
            <FriendCardSkeleton key={i} />
          ))
        ) : filteredFriends.length === 0 ? (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'white',
              fontSize: '1.5rem',
              mt: 2,
            }}
          >
            No friends found.
          </Typography>
        ) : (
          filteredFriends.map((friend: Friend) => (
            <FriendCard
              key={friend.id}
              friend={friend as Friend}
              isDeleteLoading={isLoadingDelete}
              handleDeleteFriend={handleDeleteFriend}
            />
          ))
        )}
        <AnimatedAlert
          open={isSuccessDelete}
          onClose={() => setIsSuccessDelete(false)}
          severity={ESeverity.SUCCESS}
          message="Friend deleted successfully."
        />
        <AnimatedAlert
          open={!!errorDelete}
          onClose={() => setErrorDelete(null)}
          severity={ESeverity.ERROR}
          message="Error deleting friend."
        />
      </MotionBox>
    </>
  );
}
