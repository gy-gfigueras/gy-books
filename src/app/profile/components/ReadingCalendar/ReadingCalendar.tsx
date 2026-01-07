/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  View,
  ToolbarProps,
} from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import type { UserProfileBook } from '@/domain/user.model';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import { getBookDisplayData } from '@/hooks/useBookDisplay';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface ReadingCalendarProps {
  books: UserProfileBook[];
}

interface BookEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    book: UserProfileBook;
    coverUrl: string;
    author: string;
    pageCount: number;
    isReading: boolean;
  };
}

const MotionBox = motion(Box);

export const ReadingCalendar: React.FC<ReadingCalendarProps> = ({ books }) => {
  const router = useRouter();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  // Convertir libros a eventos del calendario
  const events = useMemo((): BookEvent[] => {
    const readAndReading = books.filter(
      (book) =>
        book.userData?.status === EBookStatus.READ ||
        book.userData?.status === EBookStatus.READING
    );

    return readAndReading
      .map((book): BookEvent | null => {
        const startDate = book.userData?.startDate
          ? new Date(book.userData.startDate)
          : null;
        const endDate =
          book.userData?.status === EBookStatus.READING
            ? new Date()
            : book.userData?.endDate
              ? new Date(book.userData.endDate)
              : null;

        if (!startDate || !endDate) return null;

        const displayData = getBookDisplayData(book);
        if (!displayData) return null;

        const { title, author, coverUrl, pageCount } = displayData;
        const isReading = book.userData?.status === EBookStatus.READING;

        return {
          id: book.id,
          title: title,
          start: startDate,
          end: endDate,
          resource: {
            book,
            coverUrl,
            author,
            pageCount,
            isReading,
          },
        };
      })
      .filter((event): event is BookEvent => event !== null);
  }, [books]);

  // Stats del calendario
  const stats = useMemo(() => {
    const completed = events.filter((e) => !e.resource.isReading).length;
    const reading = events.filter((e) => e.resource.isReading).length;
    const totalPages = events.reduce((sum, e) => sum + e.resource.pageCount, 0);
    return { completed, reading, totalPages };
  }, [events]);

  // Componente personalizado para el evento
  const EventComponent = useCallback(
    ({ event }: { event: BookEvent }) => {
      const { resource } = event;
      return (
        <Tooltip
          title={
            <Box sx={{ display: 'flex', gap: 1.5, p: 1, minWidth: 250 }}>
              {/* Portada del libro */}
              <Box
                sx={{
                  width: 60,
                  height: 90,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <Box
                  component="img"
                  src={resource.coverUrl}
                  alt={event.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              {/* Info del libro */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    mb: 0.5,
                    fontSize: 13,
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </Typography>
                <Typography sx={{ fontSize: 11, mb: 0.5, opacity: 0.9 }}>
                  by {resource.author}
                </Typography>
                <Typography sx={{ fontSize: 11, mb: 0.5, opacity: 0.8 }}>
                  📖 {resource.pageCount} pages
                </Typography>
                <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
                  📅 {format(event.start, 'MMM d')} -{' '}
                  {format(event.end, 'MMM d, yyyy')}
                </Typography>
              </Box>
            </Box>
          }
          arrow
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: 'rgba(20, 20, 20, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '12px',
                padding: 0,
                maxWidth: 'none',
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(20, 20, 20, 0.98)',
                '&::before': {
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                },
              },
            },
          }}
        >
          <Box
            onClick={() => router.push(`/books/${event.id}`)}
            sx={{
              height: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '2px 4px',
              cursor: 'pointer',
              background: resource.isReading
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: resource.isReading
                  ? '0 4px 12px rgba(59, 130, 246, 0.6)'
                  : '0 4px 12px rgba(16, 185, 129, 0.6)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {resource.isReading ? (
              <AutoStoriesIcon sx={{ fontSize: 12 }} />
            ) : (
              <CheckCircleIcon sx={{ fontSize: 12 }} />
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.title}
            </span>
          </Box>
        </Tooltip>
      );
    },
    [router]
  );

  // Toolbar personalizado
  const CustomToolbar = useCallback((toolbar: ToolbarProps) => {
    const prevMonth = subMonths(toolbar.date, 1);
    const nextMonth = addMonths(toolbar.date, 1);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        {/* Botón anterior */}
        <Tooltip title={format(prevMonth, 'MMMM yyyy')} arrow>
          <IconButton
            onClick={() => toolbar.onNavigate('PREV')}
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              color: '#a855f7',
              width: 40,
              height: 40,
              '&:hover': {
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(168, 85, 247, 0.25) 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>

        {/* Mes y año actual */}
        <Box
          sx={{
            minWidth: 200,
            textAlign: 'center',
            py: 1.5,
            px: 3,
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(147, 51, 234, 0.2)',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontSize: 20,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'capitalize',
            }}
          >
            {toolbar.label}
          </Typography>
        </Box>

        {/* Botón siguiente */}
        <Tooltip title={format(nextMonth, 'MMMM yyyy')} arrow>
          <IconButton
            onClick={() => toolbar.onNavigate('NEXT')}
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              color: '#a855f7',
              width: 40,
              height: 40,
              '&:hover': {
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(168, 85, 247, 0.25) 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }, []);

  if (events.length === 0) {
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
          <AutoStoriesIcon sx={{ fontSize: 60, color: '#a855f7' }} />
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
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: 24, md: 32 },
            fontWeight: 'bold',
            mb: 1,
            background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Reading Calendar
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: 14,
            mb: 3,
          }}
        >
          Track your reading journey through time
        </Typography>

        {/* Quick stats */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
            mb: 3,
          }}
        >
          <Chip
            icon={<CheckCircleIcon />}
            label={`${stats.completed} completed`}
            size="small"
            sx={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#10b981' },
            }}
          />
          {stats.reading > 0 && (
            <Chip
              icon={<AutoStoriesIcon />}
              label={`${stats.reading} reading`}
              size="small"
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontFamily: lora.style.fontFamily,
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#3b82f6' },
              }}
            />
          )}
          <Chip
            label={`${stats.totalPages.toLocaleString()} pages`}
            size="small"
            sx={{
              background: 'rgba(147, 51, 234, 0.2)',
              color: '#a855f7',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
            }}
          />
        </Box>
      </MotionBox>

      {/* Calendario */}
      <Paper
        sx={{
          p: { xs: 1, md: 3 },
          background:
            'linear-gradient(145deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '20px',
          minHeight: 600,
          '& .rbc-calendar': {
            fontFamily: lora.style.fontFamily,
          },
          '& .rbc-header': {
            padding: '12px',
            fontWeight: 700,
            fontSize: '14px',
            color: '#a855f7',
            borderBottom: '2px solid rgba(147, 51, 234, 0.3)',
            background: 'rgba(147, 51, 234, 0.1)',
          },
          '& .rbc-today': {
            background: 'rgba(147, 51, 234, 0.15)',
          },
          '& .rbc-off-range-bg': {
            background: 'rgba(0, 0, 0, 0.2)',
          },
          '& .rbc-month-view': {
            border: '1px solid rgba(147, 51, 234, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.3)',
          },
          '& .rbc-day-bg': {
            borderColor: 'rgba(147, 51, 234, 0.15)',
          },
          '& .rbc-date-cell': {
            padding: '8px',
            '& a': {
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600,
            },
          },
          '& .rbc-event': {
            padding: '2px 4px',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
          },
          '& .rbc-toolbar': {
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
            '& button': {
              color: '#a855f7',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              background: 'rgba(147, 51, 234, 0.1)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(147, 51, 234, 0.5)',
              },
              '&:active, &.rbc-active': {
                background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                color: '#fff',
                borderColor: '#9333ea',
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
              },
            },
          },
          '& .rbc-toolbar-label': {
            fontWeight: 700,
            fontSize: '20px',
            color: '#fff',
            textTransform: 'capitalize',
          },
          '& .rbc-month-row': {
            minHeight: '80px',
          },
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: 600 }}
          views={['month']}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          components={{
            event: EventComponent,
            toolbar: CustomToolbar,
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: 'transparent',
              border: 'none',
            },
          })}
        />
      </Paper>
    </Box>
  );
};
