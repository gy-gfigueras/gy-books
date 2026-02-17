/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import type { UserProfileBook } from '@/domain/user.model';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: 0,
                maxWidth: 'none',
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(20, 20, 20, 0.98)',
                '&::before': {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
                : 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
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
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 2, md: 3 },
          px: { xs: 0, md: 1 },
        }}
      >
        {/* Botón anterior */}
        <IconButton
          onClick={() => toolbar.onNavigate('PREV')}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: '#a855f7',
              background: 'rgba(147, 51, 234, 0.1)',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Mes y año actual - más minimalista */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontSize: { xs: 18, md: 20 },
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {toolbar.label}
          </Typography>
        </Box>

        {/* Botón siguiente */}
        <IconButton
          onClick={() => toolbar.onNavigate('NEXT')}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: '#a855f7',
              background: 'rgba(147, 51, 234, 0.1)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
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
      {/* Header con stats - más compacto */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
        }}
      >
        {/* Quick stats - más minimalista */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1.5, md: 2 },
            justifyContent: 'center',
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#a855f7',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: 20, md: 24 },
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {stats.completed}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(147, 51, 234, 0.8)',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: 10, md: 11 },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mt: 0.5,
              }}
            >
              Finished
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: '#a855f7',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: 20, md: 24 },
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {stats.totalPages.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(147, 51, 234, 0.8)',
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: 10, md: 11 },
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mt: 0.5,
              }}
            >
              Pages
            </Typography>
          </Box>
          {stats.reading > 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: '#a855f7',
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: 20, md: 24 },
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {stats.reading}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(147, 51, 234, 0.8)',
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: 10, md: 11 },
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mt: 0.5,
                }}
              >
                Reading
              </Typography>
            </Box>
          )}
        </Box>
      </MotionBox>

      {/* Calendario */}
      <Paper
        sx={{
          p: { xs: 0.5, md: 2 },
          background: {
            xs: 'transparent',
            md: 'rgba(255, 255, 255, 0.03)',
          },
          backdropFilter: { xs: 'none', md: 'blur(16px)' },
          border: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.06)' },
          borderRadius: { xs: '12px', md: '20px' },
          minHeight: { xs: 'auto', md: 600 },
          '& .rbc-calendar': {
            fontFamily: lora.style.fontFamily,
          },
          '& .rbc-header': {
            padding: { xs: '6px 2px', md: '10px' },
            fontWeight: 600,
            fontSize: { xs: '11px', md: '13px' },
            color: 'rgba(255, 255, 255, 0.5)',
            borderBottom: 'none',
            background: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
          '& .rbc-today': {
            background: 'rgba(147, 51, 234, 0.08)',
          },
          '& .rbc-off-range-bg': {
            background: 'rgba(0, 0, 0, 0.3)',
          },
          '& .rbc-month-view': {
            border: {
              xs: '1px solid rgba(255, 255, 255, 0.06)',
              md: '1px solid rgba(255, 255, 255, 0.08)',
            },
            borderRadius: { xs: '8px', md: '12px' },
            overflow: 'hidden',
            background: { xs: 'rgba(0, 0, 0, 0.3)', md: 'rgba(0, 0, 0, 0.3)' },
          },
          '& .rbc-day-bg': {
            borderColor: 'rgba(255, 255, 255, 0.06)',
            background: 'rgba(0, 0, 0, 0.2)',
          },
          '& .rbc-date-cell': {
            padding: { xs: '4px', md: '6px' },
            '& a': {
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              fontSize: { xs: '13px', md: '14px' },
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
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(147, 51, 234, 0.1)',
                borderColor: 'rgba(147, 51, 234, 0.3)',
              },
              '&:active, &.rbc-active': {
                background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                color: '#fff',
                borderColor: '#9333ea',
                boxShadow: 'none',
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
            minHeight: { xs: '60px', md: '80px' },
          },
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: 500 }}
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
