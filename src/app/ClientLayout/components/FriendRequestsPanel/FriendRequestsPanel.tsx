import FriendRequest from '@/app/components/atoms/FriendRequest/FriendRequest';
import { FriendRequestWithUser } from '@/domain/friend.model';
import { lora } from '@/utils/fonts/fonts';
import CloseIcon from '@mui/icons-material/Close';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

interface FriendRequestsPanelProps {
  isOpen: boolean;
  isLoading: boolean;
  isLoadingUsers: boolean;
  isLoadingManageRequest: boolean;
  friendRequestsWithUsers: FriendRequestWithUser[];
  onClose: () => void;
  onManageRequest: (requestId: string, action: 'accept' | 'reject') => void;
}

/**
 * Panel flotante que muestra las solicitudes de amistad
 * Aparece desde la parte superior derecha con animación
 */
export const FriendRequestsPanel = ({
  isOpen,
  isLoading,
  isLoadingUsers,
  isLoadingManageRequest,
  friendRequestsWithUsers,
  onClose,
  onManageRequest,
}: FriendRequestsPanelProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para cerrar la pestaña flotante */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          backgroundColor: 'rgba(0, 0, 0, 0.18)',
          touchAction: 'manipulation',
        }}
      />

      {/* Pestaña flotante de solicitudes de amistad */}
      <AnimatePresence>
        <MotionBox
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.13 }}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'fixed',
            top: { xs: '60px', md: '80px' },
            right: { xs: '10px', md: '20px' },
            left: { xs: '10px', md: 'auto' },
            width: { xs: 'auto', md: '500px' },
            maxHeight: { xs: '70vh', md: '500px' },
            zIndex: 999,
            background:
              'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(20, 10, 30, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',

            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background:
                'linear-gradient(90deg, rgba(147, 51, 234, 0.06) 0%, transparent 100%)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: 16, md: 20 },
              }}
            >
              Friend Requests
            </Typography>
            <MotionIconButton
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              sx={{ color: '#fff' }}
              size="small"
            >
              <CloseIcon />
            </MotionIconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
              p: 2,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            {isLoading || isLoadingUsers ? (
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
                    handleManageRequest={onManageRequest}
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
      </AnimatePresence>
    </>
  );
};
