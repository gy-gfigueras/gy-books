'use client';

import { ETheme } from '@/utils/constants/theme.enum';
import { createTheme } from '@mui/material/styles';

// Función para crear un tema dinámico
export const getTheme = (mode: ETheme.LIGHT | ETheme.DARK) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#9333ea',
        light: '#a855f7',
        dark: '#7e22ce',
      },
      secondary: {
        main: '#c084fc',
      },
      background: {
        default: '#0A0A0A',
        paper: '#0A0A0A',
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
    },
  });
