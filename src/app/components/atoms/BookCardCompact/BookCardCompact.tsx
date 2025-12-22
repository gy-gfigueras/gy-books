import HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import AssistantIcon from '@mui/icons-material/Assistant';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BookCardCompactProps {
  book: HardcoverBook;
  onClick?: () => void;
  small?: boolean;
}

export const BookCardCompactSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Skeleton de la imagen */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // Aspect ratio 2:3
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(147, 51, 234, 0.15)',
          }}
          animation="wave"
        />
      </Box>

      {/* Skeleton del contenido */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Skeleton del título */}
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)' }}
        />

        {/* Skeleton del rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)' }}
          />
        </Box>

        {/* Skeleton de las estadísticas */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: 0.5 }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={16}
            sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)' }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={16}
            sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)' }}
          />
        </Box>

        {/* Skeleton del autor */}
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)' }}
        />

        {/* Skeleton del chip de serie */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(147, 51, 234, 0.15)',
          }}
        />
      </Box>
    </Box>
  );
};

export const BookCardCompact = ({
  book,
  onClick,
  small = false,
}: BookCardCompactProps) => {
  const router = useRouter();
  const { title, coverUrl } = useBookDisplay(book);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/books/${book.id}`);
    }
  };

  return (
    <MotionBox
      component="a"
      href={`/books/${book.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.05,
      }}
      sx={{
        width: small ? { xs: '100%', sm: '200px' } : 'auto',
        minWidth: small ? { xs: '0', sm: '200px' } : 'auto',
        maxWidth: small ? { xs: '170px', sm: '200px' } : 'auto',
        margin: small ? { xs: '0 auto', sm: '0' } : 'auto',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        background:
          'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(126, 34, 206, 0.1) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow:
          '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(147, 51, 234, 0.15)',
      }}
    >
      {/* Imagen del libro */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={coverUrl}
          alt={title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          padding: { xs: '12px', sm: '16px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '6px', sm: '8px' },
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 100%)',
        }}
      >
        {/* Título y Rating */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '2px', sm: '4px' },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.05rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.03rem',
              fontWeight: '500',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
            }}
          >
            {book.author.name}
          </Typography>
          {book.userData?.rating !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                mt: 0.5,
              }}
            >
              <Rating
                value={book.userData.rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#a855f7',
                    filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              />
            </Box>
          )}

          {book.userData?.review && (
            <Box
              sx={{
                position: 'absolute',
                right: '8px',
                top: 'calc(150% - 40px)',
                zIndex: 10,
              }}
            >
              <Tooltip title="See review" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReviewModalOpen(true);
                  }}
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                  }}
                >
                  <AssistantIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Series */}
        {book.series && book.series.length > 0 && book.series[0]?.name && (
          <Chip
            label={book.series[0].name}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mt: 0.5,
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
              backdropFilter: 'blur(8px)',
              color: '#c084fc',
              fontSize: { xs: '.75rem', sm: '.85rem' },
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.05rem',
              fontWeight: '700',
              height: { xs: '22px', sm: '24px' },
              borderRadius: '12px',
              border: '1px solid rgba(147, 51, 234, 0.4)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          />
        )}
      </Box>

      {/* Modal para mostrar la review */}
      <Dialog
        open={reviewModalOpen}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') {
            setReviewModalOpen(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.66)',
            color: '#FFFFFF',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#FFFFFF',
            fontFamily: lora.style.fontFamily,
            fontWeight: '800',
            fontSize: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {title} review
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: lora.style.fontFamily,
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          >
            {book.userData?.review}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setReviewModalOpen(false);
            }}
            sx={{
              color: 'primary.main',
              fontFamily: lora.style.fontFamily,
              fontWeight: '600',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
};
