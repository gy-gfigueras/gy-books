'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUpdateHallOfFame } from '@/hooks/useUpdateHallOfFame';
import { goudi } from '@/utils/fonts/fonts';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';

export default function HallOfFame({ userId }: { userId: string }) {
  const { user } = useGyCodingUser();
  const router = useRouter();
  const { isLoading, error, quote, books } = useHallOfFame(userId);
  const { handleUpdateHallOfFame } = useUpdateHallOfFame();

  const [editedQuote, setEditedQuote] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && quote) {
      setEditedQuote(quote);
    }
  }, [isLoading, quote]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !books || books.length === 0) {
    return (
      <Box sx={{ color: 'white', textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="white">
          Error loading Hall of Fame.
        </Typography>
      </Box>
    );
  }

  const total = books.length;

  // Navegación cíclica
  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Obtener 5 libros centrados en currentIndex (cíclico)
  const getVisibleBooks = () =>
    Array.from(
      { length: 5 },
      (_, i) => books[(currentIndex - 2 + i + total) % total]
    );

  // Variantes para posición y animación
  const variants = {
    offLeft: { opacity: 0, scale: 0.7, x: -250, pointerEvents: 'none' },
    left: { opacity: 0.6, scale: 0.85, x: -125, pointerEvents: 'auto' },
    center: { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' },
    right: { opacity: 0.6, scale: 0.85, x: 125, pointerEvents: 'auto' },
    offRight: { opacity: 0, scale: 0.7, x: 250, pointerEvents: 'none' },
  };

  // Mapea la posición al variant correspondiente
  const positionMap = ['offLeft', 'left', 'center', 'right', 'offRight'];

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('quote', editedQuote);
    handleUpdateHallOfFame(formData);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1A1A1A',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        userSelect: 'none',
      }}
    >
      {/* Carousel */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 320,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          px: 4,
        }}
      >
        {/* Flechas */}
        <IconButton
          onClick={prev}
          aria-label="Previous book"
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: '#333',
            color: 'white',
            '&:hover': { bgcolor: '#555' },
            width: 40,
            height: 40,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={next}
          aria-label="Next book"
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: '#333',
            color: 'white',
            '&:hover': { bgcolor: '#555' },
            width: 40,
            height: 40,
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        {/* Libros */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AnimatePresence initial={false}>
            {getVisibleBooks().map((book, i) => {
              const pos = positionMap[i] as keyof typeof variants;
              const isCenter = pos === 'center';

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.7, x: 0 }}
                  animate={variants[pos]}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    cursor: isCenter ? 'pointer' : 'default',
                    width: isCenter ? 180 : 130,
                    height: isCenter ? 260 : 190,
                    borderRadius: 12,
                    zIndex: isCenter ? 1 : 0,
                    boxShadow: isCenter
                      ? '0 12px 25px rgba(0,0,0,0.6)'
                      : '0 6px 12px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    backgroundColor: '#222',
                    userSelect: 'none',
                  }}
                  onClick={() => {
                    if (isCenter) router.push(`/books/${book.id}`);
                  }}
                  whileHover={
                    isCenter
                      ? {
                          scale: 1.05,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                        }
                      : {}
                  }
                >
                  <img
                    src={book.cover.url}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      width: '100%',
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '4px 8px',
                      borderRadius: '0 0 12px 12px',
                      userSelect: 'text',
                    }}
                  >
                    {book.title}
                  </Typography>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Quote input */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'text',
          textAlign: 'center',
        }}
      >
        <TextField
          disabled={userId !== user?.id}
          multiline
          value={`${editedQuote}`}
          onChange={(e) => setEditedQuote(e.target.value)}
          placeholder="Write your quote here..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleUpdate();
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleUpdate} aria-label="Save quote">
                <CheckIcon sx={{ fontSize: '20px', color: 'white' }} />
              </IconButton>
            ),
          }}
          fullWidth
          sx={{
            backgroundColor: '#232323',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #FFFFFF30',
            '& .MuiOutlinedInput-root': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              fontSize: '20px',
              fontFamily: goudi.style.fontFamily,
              fontStyle: 'italic',
              textAlign: 'center',
            },
          }}
        />
      </Box>
    </Box>
  );
}
