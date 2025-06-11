'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import RatingStars from './RatingStars';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Rating } from '@/domain/rating.model';
import { useRating } from '@/hooks/useRating';
import rateBook from '@/app/actions/rateBook';

interface BookRatingProps {
  bookId: string;
}

export const BookRating = ({ bookId }: BookRatingProps) => {
  const { user, isLoading: isUserLoading } = useUser();
  const { data: initialRating, isLoading: isRatingLoading } = useRating(bookId);
  const [rating, setRating] = useState<Rating | undefined>(
    initialRating || undefined
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  const handleRatingChange = async (newRating: number) => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);

    if (initialRating?.rating === newRating) {
      setIsSubmitting(false);
      return;
    }

    const updating = !!initialRating;

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('rating', newRating.toString());
      formData.append('startDate', '');
      formData.append('endDate', '');
      const newRatingData = await rateBook(formData, updating);
      setRating(newRatingData);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || isRatingLoading;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: { xs: 'center', sm: 'flex-start' },
      }}
    >
      <RatingStars
        rating={rating?.rating || 0}
        onRatingChange={handleRatingChange}
        disabled={!user || isSubmitting}
        isLoading={isLoading}
      />
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
