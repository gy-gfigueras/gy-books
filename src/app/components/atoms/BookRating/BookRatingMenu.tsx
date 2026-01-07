import React from 'react';
import { TextField } from '@mui/material';
import {
  Menu,
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import BookRatingProgressInput from './BookRatingProgressInput';
import BookRatingReviewInput from './BookRatingReviewInput';
import { BookRatingState, BookRatingHandlers } from './types';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingMenu: React.FC<Props> = ({
  open,
  anchorEl,
  onClose,
  state,
  handlers,
  isBookSaved,
  isLoading,
  isSubmitting,
  fontFamily = 'inherit',
  handleDeleteBook,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    TransitionProps={{
      timeout: 250,
    }}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        minWidth: 600,
        maxWidth: 720,
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(147, 51, 234, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    }}
  >
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Header con título y botón eliminar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontSize: 20,
            fontFamily,
          }}
        >
          Book Details
        </Typography>
        {isBookSaved && handleDeleteBook && (
          <IconButton
            onClick={handleDeleteBook}
            size="small"
            sx={{
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      {/* Layout en 2 columnas */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Columna izquierda: Rating y Review */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
              fontWeight: 500,
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily,
            }}
          >
            Rating
          </Typography>
          <RatingStars
            rating={state.tempRating}
            onRatingChange={handlers.setTempRating}
            disabled={isLoading || isSubmitting}
            isLoading={isLoading}
          />
          <Box sx={{ mt: 2 }}>
            <BookRatingReviewInput
              tempReview={state.tempReview}
              setTempReview={handlers.setTempReview}
              fontFamily={fontFamily}
              isLoading={isLoading || isSubmitting}
            />
          </Box>
        </Box>

        {/* Columna derecha: Status y Progress */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 13,
              fontWeight: 500,
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily,
            }}
          >
            Status
          </Typography>
          <BookRatingStatusButtons
            tempStatus={state.tempStatus}
            setTempStatus={handlers.setTempStatus}
            fontFamily={fontFamily}
          />
          <Box sx={{ mt: 2 }}>
            <BookRatingProgressInput
              tempProgress={state.tempProgress}
              setTempProgress={handlers.setTempProgress}
              isProgressPercent={state.isProgressPercent}
              setIsProgressPercent={handlers.setIsProgressPercent}
              fontFamily={fontFamily}
            />
          </Box>
        </Box>
      </Box>

      {/* Fechas en una fila */}
      <Box sx={{ mt: 3 }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 13,
            fontWeight: 500,
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily,
          }}
        >
          Reading Period
        </Typography>
        <Stack direction="row" gap={2}>
          <TextField
            type="date"
            value={state.tempStartDate}
            onChange={(e) => handlers.setTempStartDate(e.target.value)}
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(147, 51, 234, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9333ea',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 14,
                fontFamily,
              },
              input: {
                color: '#fff',
                fontSize: 14,
                fontFamily,
              },
            }}
          />
          <TextField
            type="date"
            value={state.tempEndDate}
            onChange={(e) => handlers.setTempEndDate(e.target.value)}
            label="End Date"
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(147, 51, 234, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9333ea',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 14,
                fontFamily,
              },
              input: {
                color: '#fff',
                fontSize: 14,
                fontFamily,
              },
            }}
          />
        </Stack>
      </Box>

      {/* Botón Apply */}
      <Button
        variant="contained"
        fullWidth
        onClick={handlers.handleApply}
        disabled={isSubmitting}
        sx={{
          mt: 3,
          py: 1.2,
          borderRadius: '10px',
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 600,
          fontFamily,
          background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)',
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
          },
          '&.Mui-disabled': {
            background: 'rgba(147, 51, 234, 0.2)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        Apply Changes
      </Button>
    </Box>
  </Menu>
);

export default BookRatingMenu;
