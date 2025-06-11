import React from 'react';
import { Box, Typography, Chip, Rating } from '@mui/material';
import Book from '@/domain/book.model';
import { useRouter } from 'next/navigation';
import { inter } from '@/utils/fonts/fonts';
import { Library } from '@/domain/library.model';

interface BookCardCompactProps {
  book: Book;
  library?: Library;
  onClick?: () => void;
}

export const BookCardCompact = ({
  book,
  library,
  onClick,
}: BookCardCompactProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/books/${book.id}`);
    }
  };

  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      sx={{
        width: '100%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#232323',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          backgroundColor: '#2a2a2a',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Imagen del libro */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // Aspect ratio 2:3
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={book.cover.url || '/placeholder-book.jpg'}
          alt={book.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Título y Rating */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '1rem',
              fontFamily: inter.style.fontFamily,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </Typography>

          {book.rating !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Rating
                value={book.rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: 'primary.main',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  fontFamily: inter.style.fontFamily,
                }}
              >
                {book.rating}
              </Typography>
            </Box>
          )}

          {library && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                mt: 0.5,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem',
                fontFamily: inter.style.fontFamily,
              }}
            >
              <Typography>
                {library.stats.totalBooks} libros en total
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Rating
                  value={library.stats.averageRating}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'primary.main',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                />
                <Typography>
                  Media: {library.stats.averageRating.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Autor */}
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            fontFamily: inter.style.fontFamily,
            fontWeight: '500',
          }}
        >
          {book.author.name}
        </Typography>

        {/* Series */}
        {book.series && (
          <Chip
            label={book.series.name}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              color: 'primary.main',
              fontSize: '0.75rem',
              height: '24px',
              borderRadius: '12px',
              fontFamily: inter.style.fontFamily,
              fontWeight: '500',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
