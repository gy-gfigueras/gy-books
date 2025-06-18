'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  Drawer,
  useMediaQuery,
  TextField,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import RatingStars from './RatingStars';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Rating } from '@/domain/rating.model';
import { useRating } from '@/hooks/useRating';
import rateBook from '@/app/actions/rateBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { EStatus } from '@/utils/constants/EStatus';
import { useTheme } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import addStatus from '@/app/actions/addStatus';
import bookStatus from '@/domain/bookStatus';
interface BookRatingProps {
  bookId: string;
  bookStatus?: bookStatus;
}

const statusOptions = [
  {
    label: 'Want to read',
    value: EStatus.WANT_TO_READ,
    icon: <BookmarkIcon />,
  },
  {
    label: 'Currently reading',
    value: EStatus.READING,
    icon: <RemoveRedEyeIcon />,
  },
  { label: 'Read', value: EStatus.READ, icon: <CheckCircleIcon /> },
];

export const BookRating = ({ bookId, bookStatus }: BookRatingProps) => {
  const { user, isLoading: isUserLoading } = useUser();
  const { data: initialRating, isLoading: isRatingLoading } = useRating(bookId);
  const [rating, setRating] = useState<Rating | undefined>(
    initialRating || undefined
  );
  console.log(bookStatus);
  const [status, setStatus] = useState<EStatus>(
    bookStatus?.status || EStatus.WANT_TO_READ
  );
  const [startDate, setStartDate] = useState<string>(
    initialRating?.startDate || ''
  );
  const [endDate, setEndDate] = useState<string>(initialRating?.endDate || '');
  const [tempRating, setTempRating] = useState<number>(rating?.rating || 0);
  const [tempStatus, setTempStatus] = useState<EStatus>(status);
  const [tempStartDate, setTempStartDate] = useState<string>(startDate);
  const [tempEndDate, setTempEndDate] = useState<string>(endDate);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
      if ('status' in initialRating && initialRating.status) {
        setStatus(initialRating.status as EStatus);
        setTempStatus(initialRating.status as EStatus);
      }
      setStartDate(initialRating.startDate || '');
      setEndDate(initialRating.endDate || '');
      setTempStartDate(initialRating.startDate || '');
      setTempEndDate(initialRating.endDate || '');
      setTempRating(initialRating.rating || 0);
    }
  }, [initialRating]);

  // Actualizar el status cuando bookStatus cambie
  useEffect(() => {
    if (bookStatus?.status) {
      setStatus(bookStatus.status as EStatus);
      setTempStatus(bookStatus.status as EStatus);
    }
  }, [bookStatus]);

  const handleApply = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 1. Actualizar status si ha cambiado
      if (tempStatus !== status) {
        await addStatus(bookId, tempStatus);
        setStatus(tempStatus);
      }
      // 2. Actualizar rating/fechas si han cambiado
      if (
        tempRating !== (rating?.rating || 0) ||
        tempStartDate !== startDate ||
        tempEndDate !== endDate
      ) {
        const formData = new FormData();
        formData.append('bookId', bookId);
        formData.append('rating', tempRating.toString());
        formData.append('startDate', tempStartDate);
        formData.append('endDate', tempEndDate);
        const newRatingData = await rateBook(formData, !!initialRating);
        setRating(newRatingData);
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
      }
      setAnchorEl(null);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error applying changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTempRating = (val: number) => setTempRating(val);
  const handleTempStatus = (val: EStatus) => setTempStatus(val);
  const handleTempStartDate = (val: string) => setTempStartDate(val);
  const handleTempEndDate = (val: string) => setTempEndDate(val);

  const isLoading = isUserLoading || isRatingLoading;

  const currentStatus = statusOptions.find((opt) => opt.value === status);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: { xs: 'center', sm: 'flex-start' },
        width: '100%',
        mt: 2,
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 320 }, mb: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<BookmarkIcon />}
          endIcon={<ArrowDropDownIcon />}
          disabled={!user}
          onClick={(e) => {
            if (isMobile) setDrawerOpen(true);
            else setAnchorEl(e.currentTarget);
            setTempRating(rating?.rating || 0);
            setTempStatus(status);
            setTempStartDate(startDate);
            setTempEndDate(endDate);
          }}
          sx={{
            justifyContent: 'space-between',
            color: '#fff',
            borderColor: '#8C54FF',
            fontWeight: 'bold',
            fontSize: 18,
            borderRadius: '12px',
            background: 'rgba(140,84,255,0.10)',
            px: 2,
            py: 1,
            textTransform: 'none',
            opacity: !user ? 0.5 : 1,
            '&:hover': {
              borderColor: '#c4b5fd',
              background: '#8C54FF',
              color: '#fff',
            },
            '&:disabled': {
              borderColor: '#666',
              color: '#666',
              background: 'rgba(102,102,102,0.1)',
            },
          }}
        >
          {currentStatus?.label || 'Want to read'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && !isMobile}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              minWidth: 340,
              p: 3,
              background: '#232323',
              boxShadow: '0 8px 32px rgba(140,84,255,0.15)',
            },
          }}
        >
          <Stack spacing={2} alignItems="stretch">
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                Calificación
              </Typography>
              <RatingStars
                rating={tempRating}
                onRatingChange={handleTempRating}
                disabled={!user || isSubmitting}
                isLoading={isLoading}
              />
            </Box>
            <Divider sx={{ borderColor: '#8C54FF30' }} />
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                Estado
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={2}
                justifyContent="center"
              >
                {statusOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      tempStatus === opt.value ? 'contained' : 'outlined'
                    }
                    startIcon={React.cloneElement(opt.icon, {
                      sx: { color: tempStatus === opt.value ? '#fff' : '#fff' },
                    })}
                    onClick={() => handleTempStatus(opt.value)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 'bold',
                      color: tempStatus === opt.value ? '#fff' : 'white',
                      background:
                        tempStatus === opt.value ? '#8C54FF' : 'transparent',
                      borderColor: '#8C54FF',
                      px: 2,
                      py: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: 16,
                      '&:hover': {
                        background: '#8C54FF',
                        color: '#fff',
                      },
                    }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
            </Box>
            <Divider sx={{ borderColor: '#8C54FF30' }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha inicio"
                type="date"
                value={tempStartDate || ''}
                onChange={(e) => handleTempStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  background: '#232323',
                  borderRadius: 2,
                  input: { color: '#fff' },
                  svg: { color: 'white' },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&::-webkit-calendar-picker-indicator': {
                    filter:
                      'invert(1) brightness(50%) sepia(100%) saturate(10000%) hue-rotate(180deg)',
                  },
                }}
              />
              <TextField
                label="Fecha fin"
                type="date"
                value={tempEndDate || ''}
                onChange={(e) => handleTempEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  background: '#232323',
                  borderRadius: 2,
                  input: { color: '#fff' },
                  svg: { color: 'white' },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '& fieldset': {
                    borderColor: 'white',
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              disabled={isSubmitting}
              sx={{ borderRadius: 3, fontWeight: 'bold', fontSize: 16, mt: 1 }}
            >
              Aplicar
            </Button>
          </Stack>
        </Menu>
        <Drawer
          anchor="bottom"
          open={drawerOpen && isMobile}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              pb: 2,
              background: '#232323',
              minHeight: 380,
            },
          }}
        >
          <Box sx={{ p: 3, position: 'relative' }}>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
            <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                  Calificación
                </Typography>
                <RatingStars
                  rating={tempRating}
                  onRatingChange={handleTempRating}
                  disabled={!user || isSubmitting}
                  isLoading={isLoading}
                />
              </Box>
              <Divider sx={{ borderColor: '#8C54FF30' }} />
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                  Estado
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {statusOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={
                        tempStatus === opt.value ? 'contained' : 'outlined'
                      }
                      startIcon={React.cloneElement(opt.icon, {
                        sx: {
                          color: tempStatus === opt.value ? '#fff' : '#fff',
                        },
                      })}
                      onClick={() => handleTempStatus(opt.value)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 'bold',
                        color: tempStatus === opt.value ? '#fff' : 'white',
                        background:
                          tempStatus === opt.value ? '#8C54FF' : 'transparent',
                        borderColor: '#8C54FF',
                        px: 2,
                        py: 1,
                        minWidth: 0,
                        textTransform: 'none',
                        fontSize: 16,
                        '&:hover': {
                          background: '#8C54FF',
                          color: '#fff',
                        },
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ borderColor: '#8C54FF30' }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  value={tempStartDate || ''}
                  onChange={(e) => handleTempStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: 1,
                    background: '#232323',
                    borderRadius: 2,
                    input: { color: '#fff' },
                  }}
                />
                <TextField
                  label="Fecha fin"
                  type="date"
                  value={tempEndDate || ''}
                  onChange={(e) => handleTempEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: 1,
                    background: '#232323',
                    borderRadius: 2,
                    input: { color: '#fff' },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: 16,
                  mt: 1,
                }}
              >
                Aplicar
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </Box>

      {!user && (
        <Typography variant="caption" sx={{ color: '#666' }}>
          Inicia sesión en{' '}
          <span style={{ color: '#9c27b0', fontWeight: 'bold' }}>
            WingWords
          </span>{' '}
          para calificar este libro
        </Typography>
      )}
    </Box>
  );
};
