'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
  Tab,
  Tabs,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import EditIcon from '@mui/icons-material/Edit';
import { inter } from '@/utils/fonts/fonts';
import Link from 'next/link';
import { useLibrary } from '@/hooks/useLibrary';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact';
import { EStatus } from '@/utils/constants/EStatus';
import { useUser } from '@auth0/nextjs-auth0/client';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';
import ProfileSkeleton from '../components/atoms/ProfileSkeleton';

export default function ProfilePage() {
  const { user, isLoading } = useGyCodingUser();
  const { data: books, isLoading: isBooksLoading } = useLibrary();
  const [tab, setTab] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState<EStatus | null>(null);
  const { user: userData } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const statusOptions = [
    { label: 'Currently reading', value: EStatus.READING },
    { label: 'Read', value: EStatus.READ },
    { label: 'Want to read', value: EStatus.WANT_TO_READ },
  ];

  const filteredBooks = React.useMemo(() => {
    if (!books) return [];
    if (!statusFilter) return books;
    return books.filter((book) => book.status === statusFilter);
  }, [books, statusFilter]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>No hay usuario logueado</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 6,
        mb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          maxWidth: 1200,
          mx: 'auto',
          p: { xs: 3, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: { xs: 'center', md: 'center' },
            gap: { xs: 3, md: 6 },
            minHeight: { xs: 0, md: 200 },
            width: '100%',
          }}
        >
          <Avatar
            src={user.picture}
            alt={user.username}
            sx={{
              width: { xs: 100, sm: 120, md: 160 },
              height: { xs: 100, sm: 120, md: 160 },
              bgcolor: '#232323',
              border: '3px solid #8C54FF',
              ml: { xs: 0, md: 2 },
              mb: { xs: 2, md: 0 },
              alignSelf: { xs: 'center', md: 'flex-start' },
            }}
          />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 2,
              width: { xs: '100%', md: 'auto' },
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: inter.style.fontFamily,
                mb: 0,
                fontSize: { xs: 28, sm: 32, md: 36 },
              }}
            >
              {user.username}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontSize: { xs: 15, sm: 16, md: 18 },
                mb: 1,
              }}
            >
              {userData?.email}
            </Typography>
            <Box
              sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: '2px solid #FFFFFF30',
                  borderRadius: '12px',
                  background: 'rgba(35, 35, 35, 0.85)',
                  p: 1.5,
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontFamily: inter.style.fontFamily,
                    minHeight: 32,
                  }}
                >
                  {user.bio || 'Aquí irá la biografía del usuario.'}
                </Typography>
              </Paper>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                mt: 1,
                fontSize: { xs: 14, sm: 15, md: 16 },
              }}
            >
              12 friends
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: { xs: 2, md: 1 },
              alignItems: { xs: 'center', md: 'flex-end' },
              justifyContent: { xs: 'center', md: 'flex-end' },
              ml: { xs: 0, md: 'auto' },
              mt: { xs: 2, md: 0 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Button
              variant="outlined"
              component={Link}
              href="https://accounts.gycoding.com"
              target="_blank"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                fontWeight: 'bold',
                borderRadius: '8px',
                minWidth: { xs: 0, md: 140 },
                width: { xs: '50%', md: 'auto' },
                mb: { xs: 0, md: 1 },
                px: 2,
                py: 0.5,
                fontSize: { xs: 15, md: 16 },
                textTransform: 'none',
                background: 'transparent',
                '&:hover': {
                  borderColor: '#c4b5fd',
                  color: '#fff',
                  background: '#8C54FF',
                },
              }}
              endIcon={<LaunchIcon />}
            >
              Edit Account
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                fontWeight: 'bold',
                borderRadius: '8px',
                minWidth: { xs: 0, md: 140 },
                width: { xs: '50%', md: 'auto' },
                px: 2,
                py: 0.5,
                fontSize: { xs: 15, md: 16 },
                textTransform: 'none',
                background: 'transparent',
                '&:hover': {
                  borderColor: '#c4b5fd',
                  color: '#fff',
                  background: '#8C54FF',
                },
              }}
              endIcon={<EditIcon />}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: '1px solid #FFFFFF30',
              background: 'transparent',
              '.MuiTab-root': {
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: inter.style.fontFamily,
                fontSize: 18,
                textTransform: 'none',
                minWidth: 120,
              },
              '.Mui-selected': { color: '#FFFFFF' },
              '& .MuiTabs-scrollButtons': {
                color: '#fff',
              },
            }}
          >
            <Tab label="Books" />
            <Tab label="Hall of Fame" />
            <Tab label="Stats" />
            <Tab label="Activity" />
          </Tabs>
          {tab === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                mt: 4,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  minWidth: { xs: '100%', md: 220 },
                  maxWidth: { xs: '100%', md: 260 },
                  p: 3,
                  borderRadius: '18px',
                  background: 'rgba(35, 35, 35, 0.85)',
                  border: '1px solid #FFFFFF30',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {isMobile ? (
                  <Select
                    value={statusFilter ?? 'all'}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'all') {
                        setStatusFilter(null);
                      } else {
                        setStatusFilter(v as EStatus);
                      }
                    }}
                    fullWidth
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 16,
                      fontFamily: inter.style.fontFamily,
                      background: 'rgba(35, 35, 35, 0.85)',
                      borderRadius: '12px',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8C54FF',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#fff',
                      },
                    }}
                  >
                    <MenuItem
                      value="all"
                      sx={{ color: '#8C54FF', fontWeight: 'bold' }}
                    >
                      All
                    </MenuItem>
                    {statusOptions.map((opt) => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={{ color: '#fff', fontWeight: 'bold' }}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <RadioGroup
                    value={statusFilter ?? 'all'}
                    onChange={(_, v) => {
                      if (v === 'all') {
                        setStatusFilter(null);
                      } else {
                        setStatusFilter(v as EStatus);
                      }
                    }}
                    sx={{ gap: 1 }}
                  >
                    <FormControlLabel
                      value="all"
                      control={
                        <Radio
                          sx={{
                            color: '#fff',
                            '&.Mui-checked': {
                              color: '#8C54FF',
                            },
                          }}
                        />
                      }
                      label={
                        <span
                          style={{
                            color: statusFilter === null ? '#8C54FF' : '#fff',
                            fontWeight: 'bold',
                            fontSize: 16,
                            fontFamily: inter.style.fontFamily,
                          }}
                        >
                          All
                        </span>
                      }
                      sx={{
                        ml: 0,
                        mr: 0,
                        mb: 1,
                        borderRadius: '12px',
                        px: 1.5,
                        py: 0.5,
                        background:
                          statusFilter === null
                            ? 'rgba(140,84,255,0.10)'
                            : 'transparent',
                        '&:hover': {
                          background: 'rgba(140,84,255,0.15)',
                        },
                      }}
                    />
                    {statusOptions.map((opt) => (
                      <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        control={
                          <Radio
                            sx={{
                              color: '#fff',
                              '&.Mui-checked': {
                                color: '#8C54FF',
                              },
                            }}
                          />
                        }
                        label={
                          <span
                            style={{
                              color:
                                statusFilter === opt.value ? '#8C54FF' : '#fff',
                              fontWeight: 'bold',
                              fontSize: 16,
                              fontFamily: inter.style.fontFamily,
                            }}
                          >
                            {opt.label}
                          </span>
                        }
                        sx={{
                          ml: 0,
                          mr: 0,
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.5,
                          background:
                            statusFilter === opt.value
                              ? 'rgba(140,84,255,0.10)'
                              : 'transparent',
                          '&:hover': {
                            background: 'rgba(140,84,255,0.15)',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                )}
              </Paper>
              <Box
                sx={{
                  flex: 1,
                  display: { xs: 'grid', sm: 'grid', md: 'flex' },
                  gridTemplateColumns: {
                    xs: '1fr 1fr',
                    sm: '1fr 1fr',
                    md: 'none',
                  },
                  flexWrap: { xs: 'unset', md: 'wrap' },
                  gap: 2,
                  overflowY: 'auto',
                  maxHeight: 560,
                  minHeight: 340,
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1,
                  background: 'transparent',
                  scrollbarColor: '#8C54FF #232323',
                  '&::-webkit-scrollbar': {
                    width: 10,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#FFFFFF',
                    borderRadius: 6,
                  },
                }}
              >
                {isBooksLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  filteredBooks.map((book) => (
                    <Box
                      key={book.id}
                      sx={{
                        minWidth: { xs: 'unset', md: 140 },
                        maxWidth: { xs: 'unset', md: 220 },
                        width: { xs: '100%', sm: '100%', md: 'auto' },
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: { xs: 0.5, sm: 1, md: 0 },
                        py: { xs: 1, md: 0 },
                      }}
                    >
                      <BookCardCompact book={book} small={isMobile} />
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )}
          {tab === 1 && (
            <Box
              sx={{
                mt: 4,
                color: '#fff',
                fontFamily: inter.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Hall of Fame</Typography>
              <Typography variant="body1">Próximamente...</Typography>
            </Box>
          )}
          {tab === 2 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: inter.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Stats</Typography>
              <Typography variant="body1">Próximamente...</Typography>
            </Box>
          )}
          {tab === 3 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: inter.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Activity</Typography>
              <Typography variant="body1">Próximamente...</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
