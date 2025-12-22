/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams, useRouter } from 'next/navigation';
import { birthStone, lora } from '@/utils/fonts/fonts';
import { User } from '@/domain/friend.model';
import queryUsers from '@/app/actions/accounts/user/fetchUsers';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import Image from 'next/image';
import CustomTitle from '@/app/components/atoms/BookTitle/CustomTitle';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userSearched, setUserSearched] = useState(searchParams.get('q') || '');
  const [users, setUsers] = useState<User[]>([]);
  const debouncedUsername = useDebounce(userSearched, 250);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedUsername) {
        const formData = new FormData();
        formData.append('username', debouncedUsername);
        const result = await queryUsers(formData);
        setUsers(result);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedUsername]);

  const handleAddFriend = async (userId: string) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      await addFriend(formData);
      setOpen(true);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedUsername) {
      params.set('q', debouncedUsername);
    } else {
      params.delete('q');
    }
    router.push(`/users/search?${params.toString()}`);
  }, [debouncedUsername, router, searchParams]);

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
          text="Search Users"
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
            height: '10%',
            gap: '1rem',
            paddingTop: '10px',
          }}
        >
          <TextField
            placeholder="Search for a user..."
            value={userSearched}
            onChange={(e) => setUserSearched(e.target.value)}
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
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '100%',
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
          {users.map((user) => (
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
                    handleAddFriend(user.id);
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
            </MotionBox>
          ))}
        </Box>
      </MotionBox>
      <AnimatedAlert
        open={open}
        message={'Request sent'}
        onClose={() => setOpen(false)}
        severity={ESeverity.SUCCESS}
      />
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BooksContent />
    </Suspense>
  );
}
