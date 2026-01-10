/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Provider } from 'react-redux';
import store from '@/store';
import {
  GyCodingUserProvider,
  useGyCodingUser,
} from '@/contexts/GyCodingUserContext';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { getTheme } from '@/styles/theme';
import { ETheme } from '@/utils/constants/theme.enum';
import { getMenuItems } from '@/utils/constants/MenuItems';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import AnimatedAlert from './components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { User } from '@/domain/user.model';
import { useUser } from '@/hooks/useUser';
import { useHeaderScroll } from './ClientLayout/hooks/useHeaderScroll';
import { useFriendRequestsPanel } from './ClientLayout/hooks/useFriendRequestsPanel';
import { useMobileDrawer } from './ClientLayout/hooks/useMobileDrawer';
import { DesktopHeader } from './ClientLayout/components/DesktopHeader/DesktopHeader';
import { MobileHeader } from './ClientLayout/components/MobileHeader/MobileHeader';
import { FriendRequestsPanel } from './ClientLayout/components/FriendRequestsPanel/FriendRequestsPanel';
import { MobileDrawer } from './ClientLayout/components/MobileDrawer/MobileDrawer';

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  useUser(); // Fetch and store profile in Redux
  const { user, isLoading } = useGyCodingUser();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Custom hooks
  const { scrolled } = useHeaderScroll();
  const friendRequestsPanel = useFriendRequestsPanel(user?.id as UUID);
  const drawer = useMobileDrawer();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const menuItems = getMenuItems(user as User | null);

  // Handlers
  const handleLogoClick = () => {
    router.push('/');
    drawer.close();
  };

  const handleMenuItemClick = (route: string) => {
    router.push(route);
    drawer.close();
  };

  const handleFriendRequestsClick = () => {
    friendRequestsPanel.toggle();
    drawer.close();
  };

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#000000',
        }}
      >
        {/* Header Container */}
        <Box
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
              sx={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
            </Box>
          ) : isMobile ? (
            <MobileHeader onLogoClick={drawer.toggle} />
          ) : (
            <DesktopHeader
              user={user}
              isLoading={isLoading}
              friendRequestsCount={friendRequestsPanel.count}
              isLoadingRequests={friendRequestsPanel.isLoadingRequests}
              onFriendRequestsClick={friendRequestsPanel.toggle}
            />
          )}
        </Box>

        {/* Friend Requests Panel */}
        <FriendRequestsPanel
          isOpen={friendRequestsPanel.isOpen}
          isLoading={friendRequestsPanel.isLoadingRequests}
          isLoadingUsers={friendRequestsPanel.isLoadingUsers}
          isLoadingManageRequest={friendRequestsPanel.isLoadingManageRequest}
          friendRequestsWithUsers={friendRequestsPanel.friendRequestsWithUsers}
          onClose={friendRequestsPanel.close}
          onManageRequest={friendRequestsPanel.handleManageRequest}
        />

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={drawer.isOpen}
          user={user}
          menuItems={menuItems}
          friendRequestsCount={friendRequestsPanel.count}
          onClose={drawer.close}
          onLogoClick={handleLogoClick}
          onMenuItemClick={handleMenuItemClick}
          onFriendRequestsClick={handleFriendRequestsClick}
        />

        {/* Main Content */}
        <Box suppressHydrationWarning={true} sx={{ mt: '80px' }}>
          {children}
        </Box>

        {/* Alerts */}
        <AnimatedAlert
          open={friendRequestsPanel.errorManageRequest}
          onClose={friendRequestsPanel.handleCloseErrorAlert}
          severity={ESeverity.ERROR}
          message="Error managing request"
        />
        <AnimatedAlert
          open={friendRequestsPanel.isSuccessManageRequest}
          onClose={friendRequestsPanel.handleCloseSuccessAlert}
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
