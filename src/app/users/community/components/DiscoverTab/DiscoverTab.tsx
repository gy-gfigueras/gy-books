import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Image from 'next/image';
import { User } from '@/domain/friend.model';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface DiscoverTabProps {
  search: string;
  users: User[];
  isAddingFriend: boolean;
  successMessage: boolean;
  onSearchChange: (search: string) => void;
  onAddFriend: (userId: string) => void;
  setSuccessMessage: (success: boolean) => void;
}

export function DiscoverTab({
  search,
  users,
  successMessage,
  onSearchChange,
  onAddFriend,
  setSuccessMessage,
}: DiscoverTabProps) {
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
        placeholder="Search for users to add..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          overflowX: 'auto',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'start',
          padding: '25px',
          scrollbarColor: '#9333ea transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(147, 51, 234, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
            borderRadius: '4px',
          },
        }}
      >
        {users.length === 0 && search ? (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'white',
              fontSize: '1.5rem',
              mt: 2,
            }}
          >
            No users found. Try a different search.
          </Typography>
        ) : users.length === 0 ? (
          <Typography
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem',
              mt: 2,
              textAlign: 'center',
            }}
          >
            Start typing to discover new users to add as friends
          </Typography>
        ) : (
          users.map((user) => (
            <MotionBox
              component="a"
              href={`/users/${user.id}`}
              key={user.username}
              initial={{ opacity: 0, scale: 0.9 }}
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
              <Image
                src={user.picture}
                style={{
                  width: 'auto',
                  height: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                alt={user.username}
                width={100}
                height={100}
              />
              <Typography
                sx={{
                  fontSize: '22px',
                  letterSpacing: '0.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  fontFamily: lora.style.fontFamily,
                }}
              >
                {user.username}
              </Typography>
              {!user.isFriend && (
                <MotionIconButton
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onAddFriend(user.id);
                  }}
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(147, 51, 234, 0.15)',
                    color: '#a855f7',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: '16px',
                    letterSpacing: '0.1rem',
                    position: 'absolute',
                    right: '1rem',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(147, 51, 234, 0.25)',
                      border: '1px solid rgba(147, 51, 234, 0.5)',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  <PersonAddIcon />
                </MotionIconButton>
              )}
              {user.isFriend && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: '1rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontFamily: lora.style.fontFamily,
                    fontWeight: 'bold',
                  }}
                >
                  Friend
                </Box>
              )}
            </MotionBox>
          ))
        )}
      </Box>

      <AnimatedAlert
        open={successMessage}
        message={'Friend request sent successfully!'}
        onClose={() => setSuccessMessage(false)}
        severity={ESeverity.SUCCESS}
      />
    </MotionBox>
  );
}
