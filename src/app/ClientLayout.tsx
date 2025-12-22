/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';
import store from '@/store';
import {
  GyCodingUserProvider,
  useGyCodingUser,
} from '@/contexts/GyCodingUserContext';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
  Skeleton,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme } from '@/styles/theme';
import Profile from './components/organisms/Profile';
import { ETheme } from '@/utils/constants/theme.enum';
import { getMenuItems } from '@/utils/constants/MenuItems';
import { User } from '@/domain/user.model';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { lora } from '@/utils/fonts/fonts';
import InboxIcon from '@mui/icons-material/Inbox';
import CloseIcon from '@mui/icons-material/Close';
import { useFriendRequestsCount } from '@/hooks/useFriendRequestsCount';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import FriendRequest from './components/atoms/FriendRequest/FriendRequest';
import AnimatedAlert from './components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PersonIcon from '@mui/icons-material/Person';
import { CustomButton } from './components/atoms/CustomButton/customButton';
import { useUser } from '@/hooks/useUser';

// Create motion components
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useUser(); // Fetch and store profile in Redux
  const { user, isLoading } = useGyCodingUser();
  // useStatsPreFetch(user?.id); // Pre-fetch stats for current user
  const { count } = useFriendRequestsCount(user?.id as UUID);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [friendRequestsOpen, setFriendRequestsOpen] = useState(false);
  const router = useRouter();

  const {
    isLoading: isLoadingRequests,
    isLoadingUsers,
    friendRequestsWithUsers,
    isLoadingManageRequest,
    errorManageRequest,
    setErrorManageRequest,
    isSuccessManageRequest,
    setIsSuccessManageRequest,
    handleManageRequest,
  } = useFriendRequests(user?.id as UUID);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleFriendRequests = () => {
    setFriendRequestsOpen(!friendRequestsOpen);
  };

  const handleOpenErrorAlertClose = () => {
    setErrorManageRequest(false);
  };

  const handleOpenSuccessAlertClose = () => {
    setIsSuccessManageRequest(false);
  };

  const menuItems = getMenuItems(user as User | null);

  const renderProfileOrLogin = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            height: '48px',
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: '48px',
              height: '48px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        </Box>
      );
    }

    if (user) {
      return <Profile user={user} />;
    }

    return (
      <a href="/auth/login" style={{ textDecoration: 'none' }}>
        <CustomButton
          component={motion.button}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background:
              'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #7e22ce 100%)',
            color: 'white',
            fontSize: '14px',
            letterSpacing: '0.1rem',
            height: '10px',
            py: '1.3rem',
            fontFamily: lora.style.fontFamily,
            boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(147, 51, 234, 0.6)',
            },
          }}
        >
          Login
        </CustomButton>
      </a>
    );
  };

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        suppressHydrationWarning={true}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#000000',
        }}
      >
        <Box
          suppressHydrationWarning={true}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: scrolled
              ? 'rgba(10, 10, 10, 0.9)'
              : 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: scrolled
              ? '1px solid rgba(147, 51, 234, 0.3)'
              : '1px solid transparent',
            boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.5)' : 'none',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            transition: 'all 0.3s ease',
          }}
        >
          {!isHydrated ? (
            <Box
              component="img"
              sx={{
                width: '48px',
                height: '48px',
                filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
              }}
              src="/gy-logo.png"
              alt="logo"
            />
          ) : isMobile ? (
            <MotionBox
              component="img"
              onClick={toggleDrawer}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
                transition: 'filter 0.3s ease',
              }}
              src="/gy-logo.png"
              alt="logo"
            />
          ) : (
            <Box
              suppressHydrationWarning={true}
              sx={{
                position: 'fixed',
                display: ['none', 'none', 'flex'],
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MotionBox
                  component="img"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
                    transition: 'filter 0.3s ease',
                  }}
                  onClick={() => router.push('/')}
                  src="/gy-logo.png"
                  alt="logo"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  width: '100%',
                  justifyContent: 'end',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CustomButton
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  variant="outlined"
                  onClick={() => router.push('/books')}
                  sx={{
                    borderColor: '#9333ea',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    letterSpacing: '0.1rem',
                    height: '10px',
                    py: '1.3rem',
                    fontFamily: lora.style.fontFamily,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#a855f7',
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                    },
                  }}
                  startIcon={<LocalLibraryIcon />}
                >
                  Library
                </CustomButton>
                <CustomButton
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  variant="outlined"
                  onClick={() => router.push('/users/search')}
                  sx={{
                    borderColor: '#9333ea',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    letterSpacing: '0.1rem',
                    height: '10px',
                    py: '1.3rem',
                    fontFamily: lora.style.fontFamily,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#a855f7',
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                    },
                  }}
                  startIcon={<PersonIcon />}
                >
                  Users
                </CustomButton>
                {user && (
                  <MotionIconButton
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFriendRequests}
                  >
                    <InboxIcon
                      sx={{
                        fontSize: '28px',
                        color: isLoadingRequests ? 'gray' : '#FFF',
                        position: 'relative',
                        filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.3))',
                      }}
                    />
                    {count > 0 && (
                      <MotionBox
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 15,
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '20px',
                          height: '20px',
                          background:
                            'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '4px',
                          fontSize: '12px',
                          boxShadow: '0 2px 8px rgba(147, 51, 234, 0.6)',
                        }}
                      >
                        {count}
                      </MotionBox>
                    )}
                  </MotionIconButton>
                )}
                {renderProfileOrLogin()}
              </Box>
            </Box>
          )}
        </Box>

        {/* Overlay para cerrar la pestaña flotante */}
        {friendRequestsOpen && (
          <Box
            onClick={toggleFriendRequests}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
        )}

        {/* Pestaña flotante de solicitudes de amistad */}
        <AnimatePresence>
          {friendRequestsOpen && (
            <MotionBox
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: 'fixed',
                top: '80px',
                right: { xs: '10px', md: '20px' },
                left: { xs: '10px', md: 'auto' },
                width: { xs: 'auto', md: '500px' },
                maxHeight: { xs: '70vh', md: '500px' },
                zIndex: 999,
                background:
                  'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(30, 10, 40, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                boxShadow:
                  '0 8px 32px rgba(147, 51, 234, 0.3), 0 0 80px rgba(147, 51, 234, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
                  background:
                    'linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, transparent 100%)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontFamily: lora.style.fontFamily,
                    fontSize: { xs: 16, md: 20 },
                    textShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                  }}
                >
                  Friend Requests
                </Typography>
                <MotionIconButton
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFriendRequests}
                  sx={{ color: '#fff' }}
                  size="small"
                >
                  <CloseIcon />
                </MotionIconButton>
              </Box>

              <Box
                sx={{
                  maxHeight: '600px',
                  overflowY: 'auto',
                  p: 2,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(147, 51, 234, 0.1)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background:
                      'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background:
                      'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
                  },
                }}
              >
                {isLoadingRequests || isLoadingUsers ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress sx={{ color: '#fff' }} />
                  </Box>
                ) : friendRequestsWithUsers &&
                  friendRequestsWithUsers.length > 0 ? (
                  friendRequestsWithUsers.map((requestWithUser, index) => (
                    <MotionBox
                      key={requestWithUser.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      sx={{ mb: 2, width: '100%' }}
                    >
                      <FriendRequest
                        user={requestWithUser.user || null}
                        handleManageRequest={handleManageRequest}
                        isLoadingManageRequest={isLoadingManageRequest}
                        requestId={requestWithUser.id}
                      />
                    </MotionBox>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: lora.style.fontFamily,
                        textAlign: 'center',
                      }}
                    >
                      No friend requests
                    </Typography>
                  </Box>
                )}
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              background:
                'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(30, 10, 40, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              color: 'white',
              width: 300,
              borderRight: '1px solid rgba(147, 51, 234, 0.3)',
            },
          }}
        >
          <Box
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header del drawer */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 4,
                pb: 2,
                borderBottom: '1px solid rgba(147, 51, 234, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MotionBox
                  component="img"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
                  }}
                  onClick={() => {
                    router.push('/');
                    toggleDrawer();
                  }}
                  src="/gy-logo.png"
                  alt="logo"
                />
              </Box>
              <MotionIconButton
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDrawer}
                sx={{ color: '#fff' }}
              >
                <CloseIcon />
              </MotionIconButton>
            </Box>

            {/* Menu Items */}
            <List sx={{ flex: 1, py: 0 }}>
              {menuItems.map((item, index) => (
                <MotionBox
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <ListItem
                    onClick={() => {
                      router.push(item.route);
                      toggleDrawer();
                    }}
                    sx={{
                      color: 'white',
                      cursor: 'pointer',
                      mb: 1.5,
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: 'rgba(147, 51, 234, 0.05)',
                      border: '1px solid rgba(147, 51, 234, 0.15)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
                        border: '1px solid rgba(147, 51, 234, 0.4)',
                        transform: 'translateX(8px) scale(1.02)',
                        boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)',
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#a855f7',
                        minWidth: '45px',
                        filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.4))',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          fontFamily: lora.style.fontFamily,
                          fontSize: 16,
                          letterSpacing: '0.02em',
                        },
                      }}
                    />
                  </ListItem>
                </MotionBox>
              ))}
            </List>

            {/* Friend Requests Button */}
            {user && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <ListItem
                  onClick={() => {
                    toggleFriendRequests();
                    toggleDrawer();
                  }}
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    mb: 2,
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background:
                      count > 0
                        ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)'
                        : 'rgba(147, 51, 234, 0.05)',
                    border: `1px solid ${count > 0 ? 'rgba(147, 51, 234, 0.4)' : 'rgba(147, 51, 234, 0.15)'}`,
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(168, 85, 247, 0.25) 100%)',
                      border: '1px solid rgba(147, 51, 234, 0.5)',
                      transform: 'translateX(8px) scale(1.02)',
                      boxShadow: '0 4px 20px rgba(147, 51, 234, 0.4)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#a855f7',
                      minWidth: '45px',
                      filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.4))',
                      position: 'relative',
                    }}
                  >
                    <InboxIcon />
                    {count > 0 && (
                      <MotionBox
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 15,
                        }}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: '20px',
                          height: '20px',
                          background:
                            'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(147, 51, 234, 0.6)',
                        }}
                      >
                        {count}
                      </MotionBox>
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Friend Requests"
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                        fontFamily: lora.style.fontFamily,
                        fontSize: 16,
                        letterSpacing: '0.02em',
                      },
                    }}
                  />
                </ListItem>
              </MotionBox>
            )}

            {/* Logout Button */}
            {user && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <a href="/auth/logout" style={{ textDecoration: 'none' }}>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      borderColor: 'rgba(239, 68, 68, 0.5)',
                      color: '#ef4444',
                      fontFamily: lora.style.fontFamily,
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(239, 68, 68, 0.15)',
                        borderColor: '#ef4444',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                      },
                    }}
                    startIcon={<LogoutIcon />}
                  >
                    Logout
                  </Button>
                </a>
              </MotionBox>
            )}
          </Box>
        </Drawer>

        <Box suppressHydrationWarning={true} sx={{ mt: '80px' }}>
          {children}
        </Box>

        {/* Alertas para las solicitudes de amistad */}
        <AnimatedAlert
          open={errorManageRequest}
          onClose={handleOpenErrorAlertClose}
          severity={ESeverity.ERROR}
          message="Error managing request"
        />
        <AnimatedAlert
          open={isSuccessManageRequest}
          onClose={handleOpenSuccessAlertClose}
          severity={ESeverity.SUCCESS}
          message="Request managed successfully"
        />
      </Box>
    </ThemeProvider>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Auth0Provider>
        <GyCodingUserProvider>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </GyCodingUserProvider>
      </Auth0Provider>
    </Provider>
  );
}
