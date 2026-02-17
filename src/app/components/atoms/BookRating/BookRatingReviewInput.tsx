import React from 'react';
import { TextField, Box } from '@mui/material';

interface BookRatingReviewInputProps {
  tempReview: string;
  setTempReview: (review: string) => void;
  fontFamily?: string;
  isLoading?: boolean;
}

const BookRatingReviewInput: React.FC<BookRatingReviewInputProps> = ({
  tempReview,
  setTempReview,
  fontFamily = 'inherit',
  isLoading = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField
        multiline
        rows={3}
        value={tempReview}
        onChange={(e) => setTempReview(e.target.value)}
        placeholder="Write your review..."
        disabled={isLoading}
        sx={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
              borderRadius: '10px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff',
            fontFamily: fontFamily,
            '&::placeholder': {
              color: '#999',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default BookRatingReviewInput;
