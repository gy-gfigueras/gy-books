'use client';

import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

interface BookCoverProps {
  imageUrl?: string;
  bookId: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ imageUrl, bookId }) => {
  return (
    <Box
      sx={{
        width: 60,
        height: 90,
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        position: 'relative',
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Book cover ${bookId}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="60px"
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9333ea',
            fontSize: 12,
            textAlign: 'center',
            p: 1,
          }}
        >
          No Cover
        </Box>
      )}
    </Box>
  );
};
