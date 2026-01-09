'use client';

import React from 'react';
import { Box, Avatar, Typography, Paper, Skeleton } from '@mui/material';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { CurrentlyReadingSection } from './components/CurrentlyReadingSection/CurrentlyReadingSection';
import { ReadingStatsCards } from './components/ReadingStatsCards/ReadingStatsCards';
import { QuickActions } from './components/QuickActions/QuickActions';
import useMergedBooksIncremental from '@/hooks/books/useMergedBooksIncremental';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';

const MotionBox = motion(Box);

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useGyCodingUser();
  const router = useRouter();

  const { data: books, isLoading: booksLoading } = useMergedBooksIncremental(
    user?.id
  );

  // Redirect if no user
  React.useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1600px',
          margin: '0 auto',
          padding: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        {/* 3 Column Layout - Desktop */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '360px 1fr 320px',
            },
            gap: { xs: 3, lg: 4 },
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN - User Profile & Currently Reading */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Compact User Card */}
            <Paper
              sx={{
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: 2,
                border: '1px solid rgba(147, 51, 234, 0.3)',
                textAlign: 'center',
              }}
            >
              {userLoading ? (
                <>
                  <Skeleton
                    variant="circular"
                    width={70}
                    height={70}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      margin: '0 auto',
                      mb: 1.5,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      margin: '0 auto',
                    }}
                  />
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Avatar
                      src={user?.picture}
                      alt={user?.username}
                      sx={{
                        width: 70,
                        height: 70,
                        margin: '0 auto',
                        mb: 1.5,
                        border: '2px solid rgba(147, 51, 234, 0.5)',
                        boxShadow: '0 4px 16px rgba(147, 51, 234, 0.3)',
                      }}
                    />
                  </motion.div>
                  <Typography
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background:
                        'linear-gradient(135deg, #ffffff 0%, #9333ea 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 0.5,
                    }}
                  >
                    {user?.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: lora.style.fontFamily,
                      fontSize: '0.75rem',
                    }}
                  >
                    Book Lover 📚
                  </Typography>
                </>
              )}
            </Paper>

            {/* Currently Reading - Hidden on mobile, visible on desktop */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <CurrentlyReadingSection books={books} isLoading={booksLoading} />
            </Box>
          </MotionBox>

          {/* CENTER COLUMN - Friends Activity Feed */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Currently Reading - Only on mobile */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
              <CurrentlyReadingSection books={books} isLoading={booksLoading} />
            </Box>

            {/* Friends Activity - Main content */}
            <Paper
              sx={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: { xs: 2, sm: 3 },
                border: '1px solid rgba(59, 130, 246, 0.2)',
                minHeight: { xs: 400, lg: 600 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 3,
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                Friends Activity
              </Typography>

              {/* Placeholder for Friends Activity Feed */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Box sx={{ fontSize: 64, mb: 2 }}>👥</Box>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: lora.style.fontFamily,
                  }}
                >
                  Coming Soon
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.9rem',
                    fontFamily: lora.style.fontFamily,
                    textAlign: 'center',
                    maxWidth: 400,
                  }}
                >
                  See what your friends are reading, their latest reviews, and
                  reading milestones
                </Typography>
              </Box>
            </Paper>
          </MotionBox>

          {/* RIGHT COLUMN - Stats & Actions */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Stats Cards */}
            <ReadingStatsCards books={books} isLoading={booksLoading} />

            {/* Quick Actions */}
            <QuickActions />
          </MotionBox>
        </Box>
      </Box>
    </Box>
  );
}
