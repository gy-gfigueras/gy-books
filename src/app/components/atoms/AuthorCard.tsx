import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { inter } from '@/utils/fonts/fonts';

interface Author {
  name: string;
  image: {
    url: string;
  };
  bio: string;
}
export default function AuthorCard({ author }: { author: Author }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        height: '250px',
        backgroundColor: '#2a2a2a',
        padding: '16px',
        borderRadius: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={author.image?.url}
          alt={author.name}
          sx={{
            minWidth: '50px',
            minHeight: '100%',
            width: '160px',
            height: 'auto',
            borderRadius: '16px',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: '800', fontFamily: inter.style.fontFamily }}
          >
            {author.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: '400',
              fontFamily: inter.style.fontFamily,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {author.bio}
          </Typography>
          <Typography
            sx={{
              color: '#FFFFFF50',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'left',
              marginTop: '10px',
              position: 'absolute',
              fontFamily: inter.style.fontFamily,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'start',
              gap: '5px',
              bottom: '0',
            }}
          >
            Leer Más{' '}
            <ArrowForwardIcon sx={{ fontSize: '14px', marginLeft: '5px' }} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
