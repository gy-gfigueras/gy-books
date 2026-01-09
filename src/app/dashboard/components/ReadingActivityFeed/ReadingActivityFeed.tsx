'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, Skeleton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActivities } from '@/hooks/useActivities';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { lora } from '@/utils/fonts/fonts';
import Image from 'next/image';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface ReadingActivityFeedProps {
  isLoading?: boolean;
}

export const ReadingActivityFeed: React.FC<ReadingActivityFeedProps> = ({
  isLoading: externalLoading,
}) => {
  const router = useRouter();
  const { user } = useGyCodingUser();
  const userId = user?.id;
  const { data: activities, isLoading } = useActivities(userId);

  // Extraer IDs únicos de libros
  const bookIds = useMemo(() => {
    if (!activities) return [];
    const ids = activities
      .map((activity) => {
        const match = activity.message?.match(/\[(.*?)\]/);
        return match ? match[1] : null;
      })
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [activities]);

  // Obtener datos de los libros
  const { data: books } = useHardcoverBatch(bookIds);

  // Limitar a las 5 actividades más recientes
  const recentActivities = activities?.slice(0, 5) || [];

  // Función para obtener el tipo de actividad y su icono/color
  const getActivityType = (message: string) => {
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes('terminado') ||
      lowerMessage.includes('finished')
    ) {
      return {
        type: 'finished',
        icon: CheckCircleIcon,
        color: '#10b981',
        label: 'Terminado',
      };
    }
    if (lowerMessage.includes('empezado') || lowerMessage.includes('started')) {
      return {
        type: 'started',
        icon: AutoStoriesIcon,
        color: '#3b82f6',
        label: 'Empezado',
      };
    }
    if (
      lowerMessage.includes('puntuado') ||
      lowerMessage.includes('rated') ||
      lowerMessage.includes('rating')
    ) {
      return {
        type: 'rated',
        icon: StarIcon,
        color: '#fbbf24',
        label: 'Puntuado',
      };
    }
    if (
      lowerMessage.includes('progreso') ||
      lowerMessage.includes('progress')
    ) {
      return {
        type: 'progress',
        icon: TrendingUpIcon,
        color: '#a855f7',
        label: 'Progreso',
      };
    }
    return {
      type: 'other',
      icon: AutoStoriesIcon,
      color: '#9333ea',
      label: 'Actividad',
    };
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora mismo';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    const months = Math.floor(diffInSeconds / 2592000);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  };

  if (isLoading || externalLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: lora.style.fontFamily,
              color: 'white',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Recent Activity
          </Typography>
          <Paper
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: 2,
              border: '1px solid rgba(147, 51, 234, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    padding: 1.5,
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={50}
                    height={70}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 0.5 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={16}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 0.5 }}
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={14}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    );
  }

  if (!recentActivities || recentActivities.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: lora.style.fontFamily,
            color: 'white',
            fontWeight: 700,
            mb: 2,
            fontFamily: lora.style.fontFamily,
          }}
        >
          Recent Activity
        </Typography>

        <Paper
          sx={{
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: 2,
            border: '1px solid rgba(147, 51, 234, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentActivities.map((activity, index) => {
              // Extraer el bookId del mensaje si existe entre corchetes
              const bookIdMatch = activity.message?.match(/\[(.*?)\]/);
              const bookId = bookIdMatch ? bookIdMatch[1] : null;
              const cleanMessage =
                activity.message?.replace(/\[.*?\]\s*/, '') || '';

              // Obtener datos del libro
              const book = books?.find((b) => b.id === bookId);
              const activityInfo = getActivityType(cleanMessage);
              const ActivityIcon = activityInfo.icon;

              return (
                <motion.div
                  key={`${activity.date}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Box
                    onClick={() => bookId && router.push(`/books/${bookId}`)}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'flex-start',
                      cursor: bookId ? 'pointer' : 'default',
                      padding: 1.5,
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      background: 'rgba(0, 0, 0, 0.2)',
                      '&:hover': bookId
                        ? {
                            background: 'rgba(147, 51, 234, 0.15)',
                            transform: 'translateX(4px)',
                          }
                        : {},
                    }}
                  >
                    {/* Imagen del libro */}
                    {book?.image ? (
                      <Box
                        sx={{
                          position: 'relative',
                          width: 50,
                          height: 70,
                          flexShrink: 0,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <Image
                          src={book.image}
                          alt={book.title || 'Book cover'}
                          fill
                          sizes="50px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 70,
                          flexShrink: 0,
                          borderRadius: '8px',
                          background: `linear-gradient(135deg, ${activityInfo.color}40 0%, ${activityInfo.color}20 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ActivityIcon
                          sx={{ color: activityInfo.color, fontSize: 28 }}
                        />
                      </Box>
                    )}

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Chip con tipo de actividad */}
                      <Chip
                        icon={
                          <ActivityIcon
                            sx={{ fontSize: '0.9rem !important' }}
                          />
                        }
                        label={activityInfo.label}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          mb: 0.5,
                          background: `${activityInfo.color}30`,
                          color: activityInfo.color,
                          border: `1px solid ${activityInfo.color}50`,
                          fontFamily: lora.style.fontFamily,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: activityInfo.color,
                          },
                        }}
                      />

                      {/* Mensaje de actividad */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 500,
                          mb: 0.5,
                          fontSize: { xs: '0.85rem', sm: '0.875rem' },
                          lineHeight: 1.4,
                          fontFamily: lora.style.fontFamily,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {cleanMessage}
                      </Typography>

                      {/* Tiempo relativo */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontFamily: lora.style.fontFamily,
                        }}
                      >
                        {getRelativeTime(activity.date)}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
};
