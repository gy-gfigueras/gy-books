'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Skeleton,
} from '@mui/material';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import { inter } from '@/utils/fonts/fonts';

const ProfileSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: '24px',
        background: 'rgba(35, 35, 35, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* Sección de Perfil */}
        <Box sx={{ flex: { md: '0 0 33.333%' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Skeleton
                variant="circular"
                width={120}
                height={120}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  border: '4px solid rgba(147, 51, 234, 0.3)',
                }}
              />
              <Skeleton
                variant="circular"
                width={32}
                height={32}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#9333ea',
                }}
              />
            </Box>
            <Skeleton
              variant="text"
              width={160}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Box>
        </Box>

        {/* Sección de Biblioteca */}
        <Box sx={{ flex: { md: '0 0 66.666%', padding: '20px' } }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton
              variant="text"
              width={120}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }}
            />
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  height={80}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Sección de Comunidad */}
          <Box>
            <Skeleton
              variant="text"
              width={120}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }}
            />
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <Skeleton
                variant="rounded"
                height={80}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  </Container>
);

export default function ProfilePage() {
  const { user, isLoading } = useGyCodingUser();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>No hay usuario logueado</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '24px',
          background: 'rgba(35, 35, 35, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Sección de Perfil */}
          <Box sx={{ flex: { md: '0 0 33.333%' } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user.picture}
                  alt={user.username}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid rgba(147, 51, 234, 0.3)',
                    boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)',
                  }}
                />
                <IconButton
                  onClick={() =>
                    window.open('https://accounts.gycoding.com', '_blank')
                  }
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#9333ea',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: '#a855f7',
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: inter.style.fontFamily,
                  fontSize: '1.5rem',
                }}
              >
                {user.username}
              </Typography>
            </Box>
          </Box>

          {/* Sección de Biblioteca y Estadísticas */}
          <Box sx={{ flex: { md: '0 0 66.666%', padding: '20px' } }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: 2,
                  fontFamily: inter.style.fontFamily,
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                }}
              >
                Mi Biblioteca
              </Typography>
              <Divider
                sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <BookIcon
                      sx={{
                        color: '#9333ea',
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontFamily: inter.style.fontFamily,
                          fontSize: '1rem',
                        }}
                      >
                        Mis Libros
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFFFFF80' }}>
                        Próximamente
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        color: '#9333ea',
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontFamily: inter.style.fontFamily,
                          fontSize: '1rem',
                        }}
                      >
                        Favoritos
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFFFFF80' }}>
                        Próximamente
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <HistoryIcon
                      sx={{
                        color: '#9333ea',
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontFamily: inter.style.fontFamily,
                          fontSize: '1rem',
                        }}
                      >
                        Historial de Lectura
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFFFFF80' }}>
                        Próximamente
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <StarIcon
                      sx={{
                        color: '#9333ea',
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontFamily: inter.style.fontFamily,
                          fontSize: '1rem',
                        }}
                      >
                        Reseñas
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFFFFF80' }}>
                        Próximamente
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Sección de Comunidad */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: 2,
                  fontFamily: inter.style.fontFamily,
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                }}
              >
                Comunidad
              </Typography>
              <Divider
                sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <GroupIcon
                      sx={{
                        color: '#9333ea',
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontFamily: inter.style.fontFamily,
                          fontSize: '1rem',
                        }}
                      >
                        Clubes de Lectura
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#FFFFFF80' }}>
                        Próximamente
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
