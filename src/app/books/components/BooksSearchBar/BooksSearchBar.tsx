'use client';

import React from 'react';
import { lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';

interface BooksSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const BooksSearchBar: React.FC<BooksSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by title, author or series…',
}) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      px: { xs: 2, sm: 4, md: 0 },
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 680, md: 760 },
        position: 'relative',
        '&:focus-within::after': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: '20px',
          background: 'rgba(147,51,234,0.2)',
          filter: 'blur(18px)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        autoComplete="off"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: value ? '#a855f7' : 'rgba(255,255,255,0.3)',
                  fontSize: 22,
                  transition: 'color 0.2s',
                }}
              />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onChange('')}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.06)',
                  },
                  borderRadius: '8px',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: {
            color: 'white',
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '16px', sm: '18px' },
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            borderRadius: '18px',
            minHeight: { xs: '56px', sm: '64px' },
            position: 'relative',
            zIndex: 1,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '18px',
              borderWidth: '1px',
              transition: 'border-color 0.25s',
            },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(147,51,234,0.6)',
              borderWidth: '1px',
            },
          },
          '& input::placeholder': {
            color: 'rgba(255,255,255,0.3)',
            fontFamily: lora.style.fontFamily,
          },
        }}
      />
    </Box>
  </Box>
);
