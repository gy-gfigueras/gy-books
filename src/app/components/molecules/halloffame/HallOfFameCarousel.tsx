/* eslint-disable @next/next/no-img-element */
'use client';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { lora } from '@/utils/fonts/fonts';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Book {
  id: string;
  title: string;
  cover?: { url?: string };
}

interface HallOfFameCarouselProps {
  books: Book[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}

export const HallOfFameCarousel: React.FC<HallOfFameCarouselProps> = ({
  books,
  currentIndex,
  setCurrentIndex,
}) => {
  const router = useRouter();
  const total = books.length;
  const prev = () =>
    setCurrentIndex(currentIndex === 0 ? total - 1 : currentIndex - 1);
  const next = () => setCurrentIndex((currentIndex + 1) % total);

  const visibleCount = Math.min(5, total);
  const getVisibleBooks = () =>
    Array.from(
      { length: visibleCount },
      (_, i) =>
        books[(currentIndex - Math.floor(visibleCount / 2) + i + total) % total]
    );

  const posVariants = {
    offLeft: { opacity: 0, scale: 0.62, x: -268, zIndex: 0 },
    left: { opacity: 0.38, scale: 0.79, x: -134, zIndex: 1 },
    center: { opacity: 1, scale: 1, x: 0, zIndex: 3 },
    right: { opacity: 0.38, scale: 0.79, x: 134, zIndex: 1 },
    offRight: { opacity: 0, scale: 0.62, x: 268, zIndex: 0 },
  };

  const positionMaps = [
    ['center'],
    ['left', 'center'],
    ['left', 'center', 'right'],
    ['offLeft', 'left', 'center', 'right'],
    ['offLeft', 'left', 'center', 'right', 'offRight'],
  ];
  const positionMap = positionMaps[visibleCount - 1] ?? positionMaps[4];
  const currentBook = books[currentIndex];
  const showDots = total > 1 && total <= 12;

  const arrowSx = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: 38,
    height: 38,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.55)',
    borderRadius: '11px',
    '&:hover': {
      background: 'rgba(245,158,11,0.12)',
      borderColor: 'rgba(245,158,11,0.35)',
      color: '#f59e0b',
    },
    transition: 'all 0.2s ease',
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2.5,
      }}
    >
      {/* Carousel track */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 295,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          px: 6,
        }}
      >
        {total > 1 && (
          <>
            <IconButton
              onClick={prev}
              aria-label="Previous book"
              sx={{ ...arrowSx, left: 0 }}
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={next}
              aria-label="Next book"
              sx={{ ...arrowSx, right: 0 }}
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AnimatePresence initial={false}>
            {getVisibleBooks().map((book, i) => {
              const noCover = !book.cover?.url || book.cover.url === '';
              const pos = positionMap[i] as keyof typeof posVariants;
              const isCenter = pos === 'center';
              return (
                <motion.div
                  key={`${book.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.62, x: 0 }}
                  animate={posVariants[pos]}
                  exit={{ opacity: 0, scale: 0.62 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    cursor: isCenter ? 'pointer' : 'default',
                    width: isCenter ? 172 : 118,
                    height: isCenter ? 250 : 172,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: '#1a1a1a',
                    userSelect: 'none',
                    boxShadow: isCenter
                      ? '0 8px 30px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,158,11,0.22), 0 0 40px rgba(245,158,11,0.08)'
                      : '0 4px 14px rgba(0,0,0,0.4)',
                  }}
                  onClick={() => {
                    if (isCenter) router.push(`/books/${book.id}`);
                  }}
                  whileHover={isCenter ? { scale: 1.035, y: -3 } : {}}
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Current book title */}
      <Box sx={{ textAlign: 'center', px: 4, minHeight: 26 }}>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '0.01em',
            lineHeight: 1.3,
          }}
        >
          {currentBook?.title}
        </Typography>
      </Box>

      {/* Dot indicators */}
      {showDots && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {books.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrentIndex(i)}
              sx={{
                width: i === currentIndex ? 22 : 7,
                height: 7,
                borderRadius: '100px',
                background:
                  i === currentIndex
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'rgba(255,255,255,0.18)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background:
                    i === currentIndex
                      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                      : 'rgba(255,255,255,0.38)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Counter for large collections */}
      {!showDots && total > 1 && (
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {currentIndex + 1} / {total}
        </Typography>
      )}
    </Box>
  );
};
