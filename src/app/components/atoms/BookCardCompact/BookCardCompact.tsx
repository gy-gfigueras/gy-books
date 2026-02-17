import HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import AssistantIcon from '@mui/icons-material/Assistant';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Rating,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MotionBox = motion(Box);

interface BookCardCompactProps {
  book: HardcoverBook;
  onClick?: () => void;
}

export const BookCardCompactSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
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
            bgcolor: 'rgba(255, 255, 255, 0.04)',
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
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />

        {/* Skeleton del rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
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
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
          />
        </Box>

        {/* Skeleton del autor */}
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}
        />

        {/* Skeleton del chip de serie */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />
      </Box>
    </Box>
  );
};

export const BookCardCompact = ({ book, onClick }: BookCardCompactProps) => {
  const router = useRouter();
  const { title, coverUrl } = useBookDisplay(book);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/books/${book.id}`);
    }
  };

  // Status badge configuration
  const statusConfig = {
    [EBookStatus.READING]: {
      label: 'Reading',
      color: '#818cf8',
      bg: 'rgba(129, 140, 248, 0.8)',
    },
    [EBookStatus.READ]: {
      label: 'Read',
      color: '#6ee7b7',
      bg: 'rgba(110, 231, 183, 0.75)',
    },
    [EBookStatus.WANT_TO_READ]: {
      label: 'Want to Read',
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.7)',
    },
  };

  const currentStatus = book.userData?.status || EBookStatus.WANT_TO_READ;
  const statusInfo = statusConfig[currentStatus];

  // Calculate progress if reading
  const progress =
    currentStatus === EBookStatus.READING &&
    book.userData?.pagesRead &&
    book.totalPages
      ? Math.round((book.userData.pagesRead / book.totalPages) * 100)
      : null;

  return (
    <MotionBox
      component="a"
      href={`/books/${book.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
      }}
      sx={{
        width: 'auto',
        minWidth: 'auto',
        maxWidth: 'auto',
        margin: 'auto',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.25s ease',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Status Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
        }}
      >
        <Chip
          label={statusInfo.label}
          size="small"
          sx={{
            height: 24,
            background: `${statusInfo.bg}`,

            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            border: `1px solid ${statusInfo.color}`,
            boxShadow: 'none',
            textShadow: 'none',
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />
      </Box>

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

      {/* Progress Bar (if reading) */}
      {progress !== null && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '95px',
            left: 0,
            right: 0,
            px: 2,
            zIndex: 15,
          }}
        >
          <Box
            sx={{
              background: 'rgba(0, 0, 0, 0.7)',

              borderRadius: '8px',
              p: 1,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 0.5,
                textAlign: 'center',
              }}
            >
              {progress}% completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  background:
                    'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
                  borderRadius: 3,
                  boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)',
                },
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: lora.style.fontFamily,
                fontSize: '0.65rem',
                mt: 0.5,
                textAlign: 'center',
              }}
            >
              Page {book.userData?.pagesRead || 0} of {book.totalPages}
            </Typography>
          </Box>
        </Box>
      )}

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
          <Tooltip title={title} arrow placement="top">
            <Typography
              variant="subtitle1"
              sx={{
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontFamily: lora.style.fontFamily,
                letterSpacing: '.05rem',
                lineHeight: 1.3,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textShadow: 'none',
              }}
            >
              {title}
            </Typography>
          </Tooltip>
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
              textShadow: 'none',
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
                    color: book.userData?.review ? '#a855f7' : '#a855f7',
                    filter: book.userData?.review
                      ? 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.7))'
                      : 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              />
              {book.userData?.review && (
                <Box
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReviewModalOpen(true);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(147, 51, 234, 0.3)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 2px 8px rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  <AssistantIcon sx={{ fontSize: 12, color: '#fff' }} />
                </Box>
              )}
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

              color: '#c084fc',
              fontSize: { xs: '.75rem', sm: '.85rem' },
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.05rem',
              fontWeight: '700',
              height: { xs: '22px', sm: '24px' },
              borderRadius: '12px',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              textShadow: 'none',
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
