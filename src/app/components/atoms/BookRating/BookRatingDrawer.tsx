import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import {
  Drawer,
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import BookRatingProgressInput from './BookRatingProgressInput';
import BookRatingReviewInput from './BookRatingReviewInput';
import { BookRatingState, BookRatingHandlers } from './types';

interface Props {
  open: boolean;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingDrawer: React.FC<Props> = ({
  open,
  onClose,
  state,
  handlers,
  isBookSaved,
  isLoading,
  isSubmitting,
  fontFamily = 'inherit',
  handleDeleteBook,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          pb: 2,
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          minHeight: 380,
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
        >
          <CloseIcon />
        </IconButton>
        <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
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
            {isBookSaved && handleDeleteBook && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 55,
                  padding: '10px',
                  background: 'rgba(255, 83, 83, 0.1)',
                  borderRadius: '16px',
                  right: 10,
                }}
                onClick={handleDeleteBook}
              >
                <DeleteIcon sx={{ color: '#ff5353' }} />
              </IconButton>
            )}
          </Box>
          <Divider sx={{ borderColor: '#8C54FF30' }} />
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
              Status
            </Typography>
            <BookRatingStatusButtons
              tempStatus={state.tempStatus}
              setTempStatus={handlers.setTempStatus}
              fontFamily={fontFamily}
            />
            <BookRatingProgressInput
              tempProgress={state.tempProgress}
              setTempProgress={handlers.setTempProgress}
              isProgressPercent={state.isProgressPercent}
              setIsProgressPercent={handlers.setIsProgressPercent}
              fontFamily={fontFamily}
            />
          </Box>
          <Divider sx={{ borderColor: '#8C54FF30' }} />
          <Box sx={{ display: 'flex', gap: 2, mb: '10px' }}>
            <TextField
              type="date"
              value={state.tempStartDate}
              onChange={(e) => handlers.setTempStartDate(e.target.value)}
              label="Start"
              InputLabelProps={{ shrink: true }}
              sx={{
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                input: {
                  color: '#fff',
                  fontFamily: fontFamily,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                    borderRadius: '10px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(147, 51, 234, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9333ea',
                    borderWidth: 2,
                  },
                },
                label: {
                  color: '#fff',
                  fontFamily: fontFamily,
                },
                minWidth: 120,
              }}
            />
            <TextField
              type="date"
              value={state.tempEndDate}
              onChange={(e) => handlers.setTempEndDate(e.target.value)}
              label="End"
              InputLabelProps={{ shrink: true }}
              sx={{
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                input: {
                  color: '#fff',
                  fontFamily: fontFamily,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                    borderRadius: '10px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(147, 51, 234, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9333ea',
                    borderWidth: 2,
                  },
                },
                label: {
                  color: '#fff',
                  fontFamily: fontFamily,
                },
                minWidth: 120,
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handlers.handleApply}
            disabled={isSubmitting}
            sx={{
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: 18,
              mt: 2,
              textTransform: 'none',
            }}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default BookRatingDrawer;
