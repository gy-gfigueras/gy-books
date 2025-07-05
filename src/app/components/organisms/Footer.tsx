'use client';

import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { birthStone, cinzel, goudi } from '@/utils/fonts/fonts';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#232323',
        borderTop: '1px solid rgba(147, 51, 234, 0.1)',
        py: { xs: 4, sm: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 4, sm: 3 },
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: '700',
                fontSize: '32px',
                letterSpacing: '.05rem',
                fontFamily: birthStone.style.fontFamily,
                mb: 1,
              }}
            >
              WingWords
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FFFFFF80',
                maxWidth: '300px',
                mx: { xs: 'auto', md: 0 },
                fontSize: '16px',
                fontFamily: goudi.style.fontFamily,
              }}
            >
              Tu red social literaria. Descubre, comparte y conecta con otros
              lectores.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <Link
              href="https://gycoding.com"
              sx={{
                color: '#FFFFFF80',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1.2rem' },
                fontFamily: goudi.style.fontFamily,
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/privacy"
              sx={{
                color: '#FFFFFF80',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1.2rem' },
                fontFamily: goudi.style.fontFamily,
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              sx={{
                color: '#FFFFFF80',
                textDecoration: 'none',
                fontSize: { xs: '0.9rem', sm: '1.2rem' },
                fontFamily: goudi.style.fontFamily,
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              Términos
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <IconButton
              href="https://github.com/GY-CODING"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#FFFFFF80',
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/company/107304180/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#FFFFFF80',
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://gycoding.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#FFFFFF80',
                '&:hover': {
                  color: '#9333ea',
                },
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid rgba(147, 51, 234, 0.1)',
            mt: { xs: 3, sm: 4 },
            pt: { xs: 3, sm: 4 },
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: '.5rem',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#FFFFFF60',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              fontFamily: cinzel.style.fontFamily,
            }}
          >
            © {new Date().getFullYear()}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#FFFFFF60',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              fontFamily: goudi.style.fontFamily,
            }}
          >
            GYCODING. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
