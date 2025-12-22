import { motion } from 'framer-motion';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/Inbox';
import { CustomButton } from '@/app/components/atoms/CustomButton/customButton';
import { ProfileButton } from '../ProfileButton/ProfileButton';
import { lora } from '@/utils/fonts/fonts';
import { User } from '@/domain/user.model';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface DesktopHeaderProps {
  user: User | null;
  isLoading: boolean;
  friendRequestsCount: number;
  isLoadingRequests: boolean;
  onFriendRequestsClick: () => void;
}

/**
 * Header para versión desktop
 * Muestra logo, botones de navegación, notificaciones y perfil
 */
export const DesktopHeader = ({
  user,
  isLoading,
  friendRequestsCount,
  isLoadingRequests,
  onFriendRequestsClick,
}: DesktopHeaderProps) => {
  const router = useRouter();

  return (
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
      {/* Logo */}
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

      {/* Navigation Buttons */}
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

        {/* Friend Requests */}
        {user && (
          <MotionIconButton
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFriendRequestsClick}
          >
            <InboxIcon
              sx={{
                fontSize: '28px',
                color: isLoadingRequests ? 'gray' : '#FFF',
                position: 'relative',
                filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.3))',
              }}
            />
            {friendRequestsCount > 0 && (
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
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
                {friendRequestsCount}
              </MotionBox>
            )}
          </MotionIconButton>
        )}

        {/* Profile/Login Button */}
        <ProfileButton user={user} isLoading={isLoading} />
      </Box>
    </Box>
  );
};
