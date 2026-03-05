'use client';

import { AuthorSearchResult } from '@/app/actions/book/queryAuthors';
import { lora } from '@/utils/fonts/fonts';
import { Avatar, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionBox = motion(Box);

interface AuthorCardProps {
  author: AuthorSearchResult;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <MotionBox
      component={Link}
      href={`/authors/${author.id}`}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2.5,
        py: 2,
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        '&:hover': {
          borderColor: 'rgba(147,51,234,0.35)',
          background: 'rgba(147,51,234,0.06)',
        },
      }}
    >
      <Avatar
        src={author.image?.url}
        alt={author.name}
        sx={{
          width: 52,
          height: 52,
          flexShrink: 0,
          border: '2px solid rgba(147,51,234,0.25)',
          background: 'rgba(147,51,234,0.15)',
          fontFamily: lora.style.fontFamily,
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#c084fc',
        }}
      >
        {author.name.charAt(0)}
      </Avatar>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          noWrap
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#fff',
            lineHeight: 1.3,
          }}
        >
          {author.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.4)',
            mt: 0.25,
          }}
        >
          {author.booksCount > 0
            ? `${author.booksCount} book${author.booksCount !== 1 ? 's' : ''}`
            : 'Author'}
        </Typography>
      </Box>

      {/* Arrow hint */}
      <Typography
        sx={{
          fontSize: '1rem',
          color: 'rgba(147,51,234,0.5)',
          flexShrink: 0,
          transition: 'color 0.2s',
          '.MuiBox-root:hover &': { color: '#c084fc' },
        }}
      >
        →
      </Typography>
    </MotionBox>
  );
}
