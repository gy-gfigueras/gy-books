/* eslint-disable no-constant-binary-expression */
'use client';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUpdateHallOfFame } from '@/hooks/useUpdateHallOfFame';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { HallOfFameSkeleton } from './HallOfFameSkeleton';
import { HallOfFameCarousel } from './halloffame/HallOfFameCarousel';
import { HallOfFameEmpty } from './halloffame/HallOfFameEmpty';
import { HallOfFameQuoteInput } from './halloffame/HallOfFameQuoteInput';

const MotionBox = motion(Box);

export default function HallOfFame({ userId }: { userId: string }) {
  const { user } = useGyCodingUser();
  const { isLoading, error, quote, books } = useHallOfFame(userId);
  const { handleUpdateHallOfFame } = useUpdateHallOfFame(userId);

  const [editedQuote, setEditedQuote] = useState(quote);
  const [isEditing, setIsEditing] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    setEditedQuote(quote || '');
  }, [quote]);

  if (isLoading) return <HallOfFameSkeleton />;

  if (error) {
    return (
      <Box sx={{ color: 'white', textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="white">
          Error loading Hall of Fame.
        </Typography>
      </Box>
    );
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('quote', editedQuote);
      await handleUpdateHallOfFame(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update quote:', error);
      // The error state is already set in the hook
    }
  };

  // Si books es undefined o array vacío
  if (!books || books.length === 0) {
    return (
      <>
        <HallOfFameEmpty />
        <HallOfFameQuoteInput
          quote={quote || ''}
          editedQuote={editedQuote}
          setEditedQuote={setEditedQuote}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleUpdate}
          disabled={userId !== user?.id}
        />
      </>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        background:
          'linear-gradient(145deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(126, 34, 206, 0.1) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(147, 51, 234, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        userSelect: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <HallOfFameCarousel
        books={books}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <HallOfFameQuoteInput
        quote={quote || ''}
        editedQuote={editedQuote}
        setEditedQuote={setEditedQuote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleUpdate}
        disabled={userId !== user?.id}
      />
    </MotionBox>
  );
}
