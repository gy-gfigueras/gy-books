'use client';
import HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import { Box, Chip, Rating, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface BookCardListProps {
  book: HardcoverBook;
}

export const BookCardList = ({ book }: BookCardListProps) => {
  const { title, coverUrl } = useBookDisplay(book);

  // Determinar color del badge según status
  const getStatusColor = (status?: EBookStatus) => {
    switch (status) {
      case EBookStatus.READING:
        return { bg: '#a855f720', border: '#a855f7', text: '#c084fc' };
      case EBookStatus.READ:
        return { bg: '#a855f720', border: '#a855f7', text: '#c084fc' };
      case EBookStatus.WANT_TO_READ:
        return { bg: '#a855f720', border: '#a855f7', text: '#c084fc' };
      default:
        return {
          bg: 'rgba(147, 51, 234, 0.1)',
          border: '#9333ea',
          text: '#c084fc',
        };
    }
  };

  const statusColors = getStatusColor(book.userData?.status);

  return (
    <MotionBox
      component="a"
      href={`/books/${book.id}`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1.5,
        p: 1.5,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        textDecoration: 'none',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: `linear-gradient(180deg, ${statusColors.border} 0%, ${statusColors.text} 100%)`,
          opacity: 0.8,
        },
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          width: 60,
          height: 90,
          flexShrink: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          component="img"
          src={coverUrl}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          justifyContent: 'center',
        }}
      >
        {/* Título y serie */}
        <Typography
          sx={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: lora.style.fontFamily,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        {/* Autor */}
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.8rem',
            fontFamily: lora.style.fontFamily,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {book.author.name}
        </Typography>

        {/* Rating y Serie */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {book.userData?.rating !== undefined && (
            <Rating
              value={book.userData.rating}
              precision={0.5}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#a855f7',
                  fontSize: '0.9rem',
                },
                '& .MuiRating-iconEmpty': {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          )}

          {book.series && book.series.length > 0 && book.series[0]?.name && (
            <Chip
              label={book.series[0].name}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontFamily: lora.style.fontFamily,
                background: statusColors.bg,
                color: statusColors.text,
                border: `1px solid ${statusColors.border}40`,
                fontWeight: 600,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>
      </Box>
    </MotionBox>
  );
};
