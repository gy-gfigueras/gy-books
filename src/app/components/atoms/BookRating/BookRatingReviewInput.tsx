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
          background: 'rgba(45,45,45,0.95)',
          borderRadius: '16px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
              borderRadius: '16px',
            },
            '&:hover fieldset': {
              borderColor: '#8C54FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8C54FF',
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
