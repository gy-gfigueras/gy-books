'use client';

import React from 'react';
import { Box, Avatar, Typography, Paper, Skeleton } from '@mui/material';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { CurrentlyReadingSection } from './components/CurrentlyReadingSection/CurrentlyReadingSection';
import { ReadingStatsCards } from './components/ReadingStatsCards/ReadingStatsCards';
import { QuickActions } from './components/QuickActions/QuickActions';
import { FriendsActivityFeed } from './components/FriendsActivityFeed/FriendsActivityFeed';
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
          padding: { xs: 0, sm: 3, lg: 4 },
          height: 'calc(100vh - 32px)',
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
            gap: { xs: 2, lg: 4 },
            alignItems: 'start',
            height: '100%',
          }}
        >
          {/* LEFT COLUMN - User Profile & Currently Reading (Desktop only) */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              display: { xs: 'none', lg: 'flex' }, // Hidden on mobile
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

            {/* Currently Reading - Desktop */}
            <CurrentlyReadingSection books={books} isLoading={booksLoading} />
          </MotionBox>

          {/* CENTER COLUMN - Friends Activity Feed */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: 2,
              minHeight: 0,
            }}
          >
            {/* Currently Reading - Mobile only at the top */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, flexShrink: 0 }}>
              <CurrentlyReadingSection books={books} isLoading={booksLoading} />
            </Box>

            {/* Friends Activity - Main content */}
            <Paper
              sx={{
                background: 'transparent',
                borderRadius: '20px',
                padding: { xs: 1, sm: 3 },
                border: { xs: 'none', lg: '1px solid rgba(59, 130, 246, 0.2)' },
                minHeight: 0,
                mt: { xs: -4, lg: 0 },
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                // Custom scrollbar
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  borderRadius: '3px',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  },
                },
              }}
            >
              <FriendsActivityFeed />
            </Paper>
          </MotionBox>

          {/* RIGHT COLUMN - Stats & Actions (Desktop only) */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              display: { xs: 'none', lg: 'flex' }, // Hidden on mobile
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
