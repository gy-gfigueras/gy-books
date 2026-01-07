'use client';
import HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import { Box, Typography, Chip, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import { EBookStatus } from '@gycoding/nebula';

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
        return { bg: '#3b82f620', border: '#3b82f6', text: '#60a5fa' };
      case EBookStatus.READ:
        return { bg: '#10b98120', border: '#10b981', text: '#34d399' };
      case EBookStatus.WANT_TO_READ:
        return { bg: '#f59e0b20', border: '#f59e0b', text: '#fbbf24' };
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
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(147, 51, 234, 0.25)',
        borderRadius: '16px',
        textDecoration: 'none',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          border: '1px solid rgba(147, 51, 234, 0.5)',
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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
