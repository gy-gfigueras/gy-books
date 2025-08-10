/* eslint-disable no-constant-binary-expression */
'use client';

import React, { useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUpdateHallOfFame } from '@/hooks/useUpdateHallOfFame';
import { birthStone, goudi } from '@/utils/fonts/fonts';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { HallOfFameSkeleton } from './HallOfFameSkeleton';

export default function HallOfFame({ userId }: { userId: string }) {
  const { user } = useGyCodingUser();
  const router = useRouter();
  const { isLoading, error, quote, books } = useHallOfFame(userId);
  const { handleUpdateHallOfFame } = useUpdateHallOfFame();

  const [editedQuote, setEditedQuote] = useState(quote);
  const [isEditing, setIsEditing] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <HallOfFameSkeleton />;

  if (error) {
    return (
      <Box sx={{ color: 'white', textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="white">
          Error loading Hall of Fame.
        </Typography>
      </Box>
    );
  }
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('quote', editedQuote);
    handleUpdateHallOfFame(formData);
  };

  // Si books es undefined o array vacío
  if (!books || books.length === 0) {
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
          color: 'white',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontStyle: 'normal',
            fontSize: '50px',
            textAlign: 'center',
            fontFamily: birthStone.style.fontFamily,
          }}
        >
          ✨ Add books to see them here! ✨
        </Typography>

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
            defaultValue={quote || ''}
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

  const total = books.length;

  // Navegación cíclica
  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Obtener visible libros: máximo 5 o menos si no hay tantos
  const visibleCount = Math.min(5, total);

  const getVisibleBooks = () =>
    Array.from(
      { length: visibleCount },
      (_, i) =>
        books[(currentIndex - Math.floor(visibleCount / 2) + i + total) % total]
    );

  // Variantes para posición y animación
  const variants = {
    offLeft: { opacity: 0, scale: 0.7, x: -250, pointerEvents: 'none' },
    left: { opacity: 0.6, scale: 0.85, x: -125, pointerEvents: 'auto' },
    center: { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' },
    right: { opacity: 0.6, scale: 0.85, x: 125, pointerEvents: 'auto' },
    offRight: { opacity: 0, scale: 0.7, x: 250, pointerEvents: 'none' },
  };

  // Adaptar posición map según visibleCount
  // Por simplicidad, definimos para 1 a 5 libros:
  const positionMap1 = ['center'];
  const positionMap2 = ['left', 'center'];
  const positionMap3 = ['left', 'center', 'right'];
  const positionMap4 = ['offLeft', 'left', 'center', 'right'];
  const positionMap5 = ['offLeft', 'left', 'center', 'right', 'offRight'];

  let positionMap = positionMap5;
  if (visibleCount === 1) positionMap = positionMap1;
  else if (visibleCount === 2) positionMap = positionMap2;
  else if (visibleCount === 3) positionMap = positionMap3;
  else if (visibleCount === 4) positionMap = positionMap4;

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
        {total > 1 && (
          <>
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
          </>
        )}

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
              const noCover = !book.cover?.url || book.cover.url === '';
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
                    src={noCover ? DEFAULT_COVER_IMAGE : book.cover?.url}
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
          onClick={() => {
            setIsEditing(true);
          }}
          onBlur={() => setIsEditing(false)}
          disabled={userId !== user?.id}
          defaultValue={quote || ''}
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
              <IconButton
                sx={{ display: isEditing ? 'flex' : 'none' }}
                onClick={handleUpdate}
                aria-label="Save quote"
              >
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
