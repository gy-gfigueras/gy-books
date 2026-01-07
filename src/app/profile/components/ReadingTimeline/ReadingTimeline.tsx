/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useMemo, useState } from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import type { UserProfileBook } from '@/domain/user.model';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import { useRouter } from 'next/navigation';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import type HardcoverBook from '@/domain/HardcoverBook';

interface ReadingTimelineProps {
  books: UserProfileBook[];
}

interface TimelineBook extends UserProfileBook {
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  pagesPerDay: number;
  displayData: {
    title: string;
    author: string;
    coverUrl: string;
    pageCount: number;
  };
}

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export const ReadingTimeline: React.FC<ReadingTimelineProps> = ({ books }) => {
  const router = useRouter();
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);

  // Procesar libros y calcular datos
  const timelineBooks = useMemo(() => {
    const readAndReading = books.filter(
      (book) =>
        book.userData?.status === EBookStatus.READ ||
        book.userData?.status === EBookStatus.READING
    );

    return readAndReading
      .map((book): TimelineBook | null => {
        const startDate = book.userData?.startDate
          ? new Date(book.userData.startDate)
          : null;
        const endDate =
          book.userData?.status === EBookStatus.READING
            ? new Date()
            : book.userData?.endDate
              ? new Date(book.userData.endDate)
              : null;

        if (!startDate) return null;

        // Calcular duración en DÍAS (no meses)
        const duration = endDate
          ? Math.ceil(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            )
          : 0;

        // Obtener datos del hook useBookDisplay con el pageCount correcto de la edición
        const bookAsHardcover = book as HardcoverBook;
        const displayData = {
          title: bookAsHardcover.title || 'Unknown Title',
          author:
            bookAsHardcover.author?.name ||
            (book as any).authors?.[0] ||
            'Unknown Author',
          coverUrl:
            bookAsHardcover.cover?.url ||
            (book as any).cover_url ||
            DEFAULT_COVER_IMAGE,
          pageCount: bookAsHardcover.pageCount || (book as any).pages || 0,
        };

        // Si tiene edición seleccionada, obtener datos de ella
        if (bookAsHardcover.userData?.editionId && bookAsHardcover.editions) {
          const selectedEdition = bookAsHardcover.editions.find(
            (ed) => ed.id === bookAsHardcover.userData?.editionId
          );
          if (selectedEdition) {
            displayData.title = selectedEdition.title || displayData.title;
            displayData.coverUrl =
              selectedEdition.cached_image?.url || displayData.coverUrl;
            displayData.pageCount =
              selectedEdition.pages || displayData.pageCount;
          }
        }

        const pagesPerDay =
          duration > 0 ? Math.round(displayData.pageCount / duration) : 0;

        return {
          ...book,
          startDate,
          endDate,
          duration,
          pagesPerDay,
          displayData,
        };
      })
      .filter((book): book is TimelineBook => book !== null)
      .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime());
  }, [books]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start) return '';
    if (!end) return `${formatDate(start)} - Now`;
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (timelineBooks.length === 0) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 60, color: '#a855f7' }} />
        </Box>
        <Typography
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          No reading history yet
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: lora.style.fontFamily,
            fontSize: 16,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          Start tracking your reading journey with start and end dates
        </Typography>
      </MotionBox>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        py: 4,
        px: 2,
      }}
    >
      {/* Header con stats */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: 28, md: 36 },
            fontWeight: 'bold',
            mb: 1,
            background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Reading Journey
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: 16,
            mb: 3,
          }}
        >
          Your adventure through {timelineBooks.length} books
        </Typography>

        {/* Quick stats */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Chip
            icon={<CheckCircleIcon />}
            label={`${timelineBooks.filter((b) => b.userData?.status === EBookStatus.READ).length} completed`}
            sx={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#10b981' },
            }}
          />
          <Chip
            icon={<AutoStoriesIcon />}
            label={`${timelineBooks.filter((b) => b.userData?.status === EBookStatus.READING).length} reading`}
            sx={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
              color: '#3b82f6',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#3b82f6' },
            }}
          />
          <Chip
            icon={<SpeedIcon />}
            label={`${Math.round(timelineBooks.reduce((sum, b) => sum + b.pagesPerDay, 0) / timelineBooks.length)} pages/day avg`}
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
              color: '#a855f7',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#a855f7' },
            }}
          />
        </Box>
      </MotionBox>

      {/* Timeline Container con scroll horizontal */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          pb: 3,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(147, 51, 234, 0.05)',
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
            borderRadius: 10,
            '&:hover': {
              background: 'linear-gradient(90deg, #7e22ce 0%, #9333ea 100%)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
            minWidth: 'max-content',
            px: 2,
            py: 4,
          }}
        >
          {/* Línea temporal curva / river */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <linearGradient
                id="timelineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,120 ${timelineBooks
                .map((_, i) => {
                  const x = 80 + i * 200;
                  const y = 120 + Math.sin(i * 0.5) * 20;
                  return `Q ${x - 50},${y} ${x},${y}`;
                })
                .join(' ')}`}
              stroke="url(#timelineGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Libros en timeline */}
          <AnimatePresence>
            {timelineBooks.map((book, index) => {
              const isReading = book.userData?.status === EBookStatus.READING;
              const isHovered = hoveredBookId === book.id;
              const yOffset = Math.sin(index * 0.5) * 20;

              return (
                <MotionBox
                  key={book.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: yOffset,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: yOffset - 5,
                    zIndex: 10,
                  }}
                  onHoverStart={() => setHoveredBookId(book.id)}
                  onHoverEnd={() => setHoveredBookId(null)}
                  onClick={() => router.push(`/books/${book.id}`)}
                  sx={{
                    position: 'relative',
                    minWidth: 180,
                    maxWidth: 180,
                    mr: index < timelineBooks.length - 1 ? 2.5 : 0,
                    cursor: 'pointer',
                    zIndex: isHovered ? 10 : 1,
                  }}
                >
                  {/* Marcador en la línea */}
                  <MotionBox
                    animate={
                      isReading
                        ? {
                            scale: [1, 1.15, 1],
                            opacity: [0.8, 1, 0.8],
                          }
                        : {}
                    }
                    transition={
                      isReading
                        ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                        : {}
                    }
                    sx={{
                      position: 'absolute',
                      top: 108,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: isReading
                        ? 'radial-gradient(circle, #3b82f6 0%, #2563eb 100%)'
                        : 'radial-gradient(circle, #10b981 0%, #059669 100%)',
                      border: '3px solid rgba(0, 0, 0, 0.8)',
                      boxShadow: isReading
                        ? '0 0 15px rgba(59, 130, 246, 0.7)'
                        : '0 0 15px rgba(16, 185, 129, 0.7)',
                      transition: 'all 0.3s ease',
                      zIndex: 2,
                    }}
                  />

                  {/* Conector vertical sutil */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 116,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 1,
                      height: 16,
                      background: isReading
                        ? 'linear-gradient(180deg, #3b82f6 0%, transparent 100%)'
                        : 'linear-gradient(180deg, #10b981 0%, transparent 100%)',
                      opacity: 0.5,
                    }}
                  />

                  {/* Card del libro - más compacta */}
                  <MotionPaper
                    elevation={isHovered ? 16 : 4}
                    sx={{
                      p: 1.5,
                      background: 'rgba(17, 24, 39, 0.8)',
                      backdropFilter: 'blur(12px)',
                      border: isHovered
                        ? `1.5px solid ${isReading ? 'rgba(59, 130, 246, 0.5)' : 'rgba(147, 51, 234, 0.5)'}`
                        : '1px solid rgba(147, 51, 234, 0.2)',
                      borderRadius: '16px',
                      boxShadow: isHovered
                        ? `0 12px 40px ${isReading ? 'rgba(59, 130, 246, 0.25)' : 'rgba(147, 51, 234, 0.25)'}`
                        : '0 4px 20px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Portada más pequeña */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '2/3',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        mb: 1.5,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <Box
                        component="img"
                        src={book.displayData.coverUrl}
                        alt={book.displayData.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER_IMAGE;
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                      {/* Indicador de estado sutil en la esquina */}
                      {isReading && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#3b82f6',
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                            },
                          }}
                        />
                      )}
                    </Box>

                    {/* Título compacto */}
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: lora.style.fontFamily,
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        minHeight: 32,
                        mb: 0.5,
                      }}
                    >
                      {book.displayData.title}
                    </Typography>

                    {/* Autor compacto */}
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: lora.style.fontFamily,
                        fontSize: 11,
                        mb: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {book.displayData.author}
                    </Typography>

                    {/* Fecha compacta */}
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontFamily: lora.style.fontFamily,
                        fontSize: 10,
                        mb: 1,
                      }}
                    >
                      {formatDateRange(book.startDate, book.endDate)}
                    </Typography>

                    {/* Stats compactos */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip
                        label={`${book.duration}d`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          background: 'rgba(147, 51, 234, 0.15)',
                          color: '#a855f7',
                          border: '1px solid rgba(147, 51, 234, 0.25)',
                          fontFamily: lora.style.fontFamily,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                      {book.pagesPerDay > 0 && (
                        <Chip
                          label={`${book.pagesPerDay} p/d`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            background: 'rgba(168, 85, 247, 0.15)',
                            color: '#c084fc',
                            border: '1px solid rgba(168, 85, 247, 0.25)',
                            fontFamily: lora.style.fontFamily,
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      )}
                    </Box>
                  </MotionPaper>
                </MotionBox>
              );
            })}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};
