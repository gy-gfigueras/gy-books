import React, { useState, useMemo } from 'react';
import { Friend } from '@/domain/friend.model';
import FriendCard from '@/app/components/atoms/FriendCard/FriendCard';
import FriendCardSkeleton from '@/app/components/atoms/FriendCard/FriendCardSkeleton';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';

const MotionBox = motion(Box);

interface FriendsTabProps {
  data: Friend[] | undefined;
  isLoading: boolean;
  isLoadingDelete: boolean;
  errorDelete: string | null;
  isSuccessDelete: boolean;
  handleDeleteFriend: (friendId: string) => void;
  setErrorDelete: (error: string | null) => void;
  setIsSuccessDelete: (success: boolean) => void;
}

export function FriendsTab({
  data,
  isLoading,
  isLoadingDelete,
  errorDelete,
  isSuccessDelete,
  handleDeleteFriend,
  setErrorDelete,
  setIsSuccessDelete,
}: FriendsTabProps) {
  const [search, setSearch] = useState('');

  const filteredFriends = useMemo(() => {
    if (!data) return [];
    return data.filter((friend) =>
      friend.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <TextField
        placeholder="Search in your friends..."
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

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(400px, 1fr))',
          },
          columnGap: 2,
          rowGap: 1.5,
          width: '100%',
          maxWidth: '900px',
          justifyContent: 'center',
        }}
      >
        {isLoading || !data ? (
          Array.from({ length: 3 }).map((_, i) => (
            <FriendCardSkeleton key={i} />
          ))
        ) : filteredFriends.length === 0 ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                color: 'white',
                fontSize: '1.5rem',
                mt: 2,
              }}
            >
              {search ? 'No friends found.' : "You don't have any friends yet."}
            </Typography>
          </Box>
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
      </Box>

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
  );
}
