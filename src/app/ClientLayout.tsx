/* eslint-disable react/react-in-jsx-scope */
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
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
import { getTheme } from '@/styles/theme';
import Profile from './components/organisms/Profile';
import { ETheme } from '@/utils/constants/theme.enum';
import { useState } from 'react';
import { getMenuItems } from '@/utils/constants/MenuItems';
import { User } from '@/domain/user.model';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { goudi } from '@/utils/fonts/fonts';
import InboxIcon from '@mui/icons-material/Inbox';
import CloseIcon from '@mui/icons-material/Close';
import { useFriendRequestsCount } from '@/hooks/useFriendRequestsCount';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import FriendRequest from './components/atoms/FriendRequest';
import AnimatedAlert from './components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useGyCodingUser();
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
      <a href="/api/auth/login" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          onClick={() =>
            (window.location.href = '/api/auth/login?prompt=login')
          }
          sx={{
            display: { xs: 'none', md: 'flex' },
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(147, 51, 234, 0.6)',
              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Iniciar Sesión
        </Button>
      </a>
    );
  };

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#161616',
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: 'rgba(22, 22, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
          }}
        >
          {isMobile ? (
            <Box
              component="img"
              onClick={toggleDrawer}
              sx={{
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              src="/gy-logo.png"
              alt="logo"
            />
          ) : (
            <>
              <Box
                component="img"
                sx={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/')}
                src="/gy-logo.png"
                alt="logo"
              />
              {user && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: '100px',
                  }}
                  onClick={toggleFriendRequests}
                >
                  <InboxIcon
                    sx={{
                      fontSize: '28px',
                      color: isLoadingRequests ? 'gray' : '#FFF',
                      position: 'relative',
                    }}
                  />
                  {count > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </IconButton>
              )}
              {renderProfileOrLogin()}
            </>
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
        {friendRequestsOpen && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: '80px',
              right: { xs: '10px', md: '20px' },
              left: { xs: '10px', md: 'auto' },
              width: { xs: 'auto', md: '500px' },
              maxHeight: { xs: '70vh', md: '500px' },
              zIndex: 999,
              backgroundColor: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: goudi.style.fontFamily,
                  fontSize: { xs: 16, md: 20 },
                }}
              >
                Solicitudes de Amistad
              </Typography>
              <IconButton
                onClick={toggleFriendRequests}
                sx={{ color: '#fff' }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
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
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {isLoadingRequests || isLoadingUsers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress sx={{ color: '#fff' }} />
                </Box>
              ) : friendRequestsWithUsers &&
                friendRequestsWithUsers.length > 0 ? (
                friendRequestsWithUsers.map((requestWithUser) => (
                  <Box key={requestWithUser.id} sx={{ mb: 2, width: '100%' }}>
                    <FriendRequest
                      user={requestWithUser.user || null}
                      handleManageRequest={handleManageRequest}
                      isLoadingManageRequest={isLoadingManageRequest}
                      requestId={requestWithUser.id}
                    />
                  </Box>
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
                      fontFamily: goudi.style.fontFamily,
                      textAlign: 'center',
                    }}
                  >
                    No hay solicitudes de amistad
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: '#161616',
              color: 'white',
              width: 280,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push('/');
                  toggleDrawer();
                }}
                src="/gy-logo.png"
                alt="logo"
              />
              {user && (
                <IconButton
                  onClick={() => {
                    toggleFriendRequests();
                    toggleDrawer();
                  }}
                  sx={{ color: '#fff' }}
                >
                  <InboxIcon sx={{ fontSize: '24px' }} />
                  {count > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '18px',
                        height: '18px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px',
                        fontSize: '10px',
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </IconButton>
              )}
            </Box>

            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  onClick={() => {
                    router.push(item.route);
                    toggleDrawer();
                  }}
                  sx={{
                    color: item.color,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{ color: item.color || 'white', minWidth: '40px' }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: goudi.style.fontFamily,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {user && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <a href="/api/auth/logout" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={(theme) => ({
                    fontSize: ['12px', '14px'],
                    transition: '0.3s',
                    '&:hover': {
                      background: 'red',
                      color: theme.palette.text.primary,
                    },
                  })}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </a>
            </Box>
          )}
        </Drawer>

        <Box sx={{ mt: '80px' }}>{children}</Box>

        {/* Alertas para las solicitudes de amistad */}
        <AnimatedAlert
          open={errorManageRequest}
          onClose={handleOpenErrorAlertClose}
          severity={ESeverity.ERROR}
          message="Error al gestionar la solicitud"
        />
        <AnimatedAlert
          open={isSuccessManageRequest}
          onClose={handleOpenSuccessAlertClose}
          severity={ESeverity.SUCCESS}
          message="Solicitud gestionada exitosamente"
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
    <UserProvider>
      <GyCodingUserProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </GyCodingUserProvider>
    </UserProvider>
  );
}
