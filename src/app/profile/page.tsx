'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  useMediaQuery,
  CircularProgress,
  Skeleton,
  TextField,
} from '@mui/material';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import EditIcon from '@mui/icons-material/Edit';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact';
import { EStatus } from '@/utils/constants/EStatus';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';
import ProfileSkeleton from '../components/atoms/ProfileSkeleton';
import { getBooksWithPagination } from '../actions/book/fetchApiBook';
import Book from '@/domain/book.model';
import { useSearchParams, useRouter } from 'next/navigation';
import { cinzel, goudi } from '@/utils/fonts/fonts';
import { useFriends } from '@/hooks/useFriends';
import { UserImage } from '../components/atoms/UserImage';
import { useBiography } from '@/hooks/useBiography';
import { CustomButton } from '../components/atoms/customButton';
import AnimatedAlert from '../components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';
import Stats from '../components/organisms/Stats';

function ProfilePageContent() {
  const { user, isLoading } = useGyCodingUser();
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoading: isLoadingFriends, count: friendsCount } = useFriends();
  const {
    handleUpdateBiography,
    setIsUpdated: setIsUpdatedBiography,
    isLoading: isLoadingBiography,
    isUpdated: isUpdatedBiography,
    isError: isErrorBiography,
    setIsError: setIsErrorBiography,
  } = useBiography();
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [biography, setBiography] = useState(user?.biography);
  // Estado para paginación automática
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);

  // Obtener el status del URL al cargar la página
  const urlStatus = searchParams.get('status');
  const [statusFilter, setStatusFilter] = React.useState<EStatus | null>(
    urlStatus && Object.values(EStatus).includes(urlStatus as EStatus)
      ? (urlStatus as EStatus)
      : null
  );

  const statusOptions = [
    { label: 'Reading', value: EStatus.READING },
    { label: 'Read', value: EStatus.READ },
    { label: 'Want to read', value: EStatus.WANT_TO_READ },
  ];

  // Función para actualizar la URL cuando cambie el filtro
  const updateUrl = useCallback(
    (newStatus: EStatus | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newStatus) {
        params.set('status', newStatus);
      } else {
        params.delete('status');
      }
      router.replace(`/profile?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Función para manejar cambios en el filtro
  const handleStatusFilterChange = useCallback(
    (newStatus: EStatus | null) => {
      setStatusFilter(newStatus);
      updateUrl(newStatus);
    },
    [updateUrl]
  );

  // Sincronizar el estado con los search params cuando cambien (solo para navegación del navegador)
  useEffect(() => {
    const currentUrlStatus = searchParams.get('status');
    const newStatus =
      currentUrlStatus &&
      Object.values(EStatus).includes(currentUrlStatus as EStatus)
        ? (currentUrlStatus as EStatus)
        : null;

    // Solo actualizar si es diferente y no es el mismo valor que ya tenemos
    if (newStatus !== statusFilter) {
      setStatusFilter(newStatus);
    }
  }, [searchParams]); // Removido statusFilter de las dependencias para evitar loops

  // Memoizar el valor del filtro para evitar re-renders innecesarios
  const filterValue = React.useMemo(() => {
    return statusFilter ?? 'all';
  }, [statusFilter]);

  // Función para cargar más libros
  const loadMoreBooks = useCallback(async () => {
    if (loading || !hasMore || !user?.id) return;

    setLoading(true);
    const currentPage = pageRef.current;
    try {
      const res = await getBooksWithPagination(
        user?.id as UUID,
        currentPage,
        10
      );
      if (res && Array.isArray(res.books) && res.books.length > 0) {
        setBooks((prev) => {
          // Evitar duplicados por id
          const allBooks = [...prev, ...res.books];
          const uniqueBooks = allBooks.filter(
            (book, idx, arr) => arr.findIndex((b) => b.id === book.id) === idx
          );
          return uniqueBooks;
        });
        pageRef.current = currentPage + 1;
        setHasMore(!!res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, user?.id]);

  // Cargar libros iniciales SOLO cuando user.id cambie
  useEffect(() => {
    if (!user?.id) return;
    pageRef.current = 0;
    setBooks([]);
    setHasMore(true);
    setLoading(false);
    loadMoreBooks();
  }, [user?.id]);

  // Paginación automática cada 2 segundos usando setTimeout encadenado
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasMore && !loading && user?.id) {
      timeout = setTimeout(() => {
        loadMoreBooks();
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [books, hasMore, loading, loadMoreBooks, user?.id]);

  // Filtrar libros por status
  const filteredBooks = React.useMemo(() => {
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

  const handleBiographyChange = async (biography: string) => {
    const formData = new FormData();
    formData.append('biography', biography);
    const biographyUpdated = await handleUpdateBiography(formData);
    setBiography(biographyUpdated);
    setIsEditingBiography(false);
    setIsUpdatedBiography(true);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 6 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%' },
          maxWidth: 1200,
          mx: 'auto',
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
          <UserImage user={user} />
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                id="profile-username"
                variant="h3"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: goudi.style.fontFamily,
                  mb: 0,
                  fontSize: { xs: 30, sm: 32, md: 40 },
                }}
              >
                {user.username}
              </Typography>
              {user?.email && (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#ffffff50',
                    fontFamily: goudi.style.fontFamily,
                    fontSize: { xs: 17, sm: 16, md: 22 },
                    mb: 1,
                    marginTop: { xs: -1, md: 0 },
                    fontStyle: 'italic',
                  }}
                >
                  {`(${user?.email})`}
                </Typography>
              )}
            </Box>
            <Box
              component={'a'}
              href={'/users/friends'}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                marginTop: '-10px',
                textDecoration: 'none',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: { xs: 14, sm: 15, md: 18 },
                  fontFamily: cinzel.style.fontFamily,
                }}
              >
                {isLoadingFriends ? (
                  <Skeleton variant="text" width={100} height={24} />
                ) : (
                  `${friendsCount}`
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: { xs: 14, sm: 15, md: 20 },
                  fontFamily: goudi.style.fontFamily,
                }}
              >
                {isLoadingFriends ? '' : 'friends'}
              </Typography>
            </Box>

            <Box
              sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}
            >
              {isEditingBiography ? (
                <TextField
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Write your biography here..."
                  sx={{
                    mb: '8px',
                    width: '100%',
                    backgroundColor: '#232323',
                    borderRadius: '12px',
                    border: '2px solid #FFFFFF30',

                    fontFamily: goudi.style.fontFamily,
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '12px',
                      },
                      '&.MuiFormLabel-root': {
                        color: 'transparent',
                        fontFamily: goudi.style.fontFamily,
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: goudi.style.fontFamily,
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                      fontFamily: goudi.style.fontFamily,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                      fontSize: '18px',
                      fontFamily: goudi.style.fontFamily,
                    },
                  }}
                  slotProps={{
                    htmlInput: {
                      style: {
                        width: '100%',
                        color: 'white',
                        fontFamily: goudi.style.fontFamily,
                        fontSize: '20px',

                        fieldSet: {
                          borderColor: 'white',
                          fontFamily: goudi.style.fontFamily,
                        },
                      },
                    },
                  }}
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    border: '2px solid #FFFFFF30',
                    width: '100%',
                    borderRadius: '12px',
                    background: 'rgba(35, 35, 35, 0.85)',
                    p: 1.5,
                    height: '100%',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#fff',
                      fontFamily: goudi.style.fontFamily,
                      fontSize: 18,
                      minHeight: 32,
                      fontStyle: 'italic',
                    }}
                  >
                    {user.biography || 'Aquí irá la biografía del usuario.'}
                  </Typography>
                </Paper>
              )}
              {isEditingBiography && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'start',
                    justifyContent: 'start',
                    mt: 2,
                  }}
                >
                  <CustomButton
                    isLoading={isLoadingBiography}
                    sx={{
                      letterSpacing: '.05rem',
                      minWidth: { xs: 0, md: 'auto' },
                      width: { xs: '50%', md: 'auto' },
                      fontSize: { xs: 11, md: 15 },
                      height: '44px',
                      paddingTop: '14px',

                      textAlign: 'center',
                      fontFamily: goudi.style.fontFamily,
                    }}
                    onClick={() => handleBiographyChange(biography as string)}
                    variant="outlined"
                  >
                    Save
                  </CustomButton>
                  <CustomButton
                    sx={{
                      letterSpacing: '.05rem',
                      minWidth: { xs: 0, md: 'auto' },
                      width: { xs: '50%', md: 'auto' },
                      fontFamily: goudi.style.fontFamily,
                      background: 'rgba(255, 0, 0, 0.43)',
                      boxShadow: '0 4px 14px rgba(255, 0, 0, 0.4)',
                      paddingTop: '14px',
                      height: '44px',
                      textAlign: 'center',
                      fontSize: { xs: 11, md: 15 },
                      '&:hover': {
                        background: 'rgba(255, 0, 0, 0.65)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => setIsEditingBiography(false)}
                    variant="outlined"
                  >
                    Cancel
                  </CustomButton>
                </Box>
              )}
            </Box>
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
              height: 'auto',
            }}
          >
            <CustomButton
              sx={{
                letterSpacing: '.05rem',
                minWidth: { xs: 0, md: 170 },
                width: { xs: '50%', md: '200px' },
                fontFamily: goudi.style.fontFamily,
                fontSize: { xs: 11, md: 15 },
              }}
              variant="contained"
              endIcon={<LaunchIcon />}
              variantComponent="link"
              href="https://accounts.gycoding.com"
              target="_blank"
            >
              Edit Account
            </CustomButton>
            <CustomButton
              sx={{
                letterSpacing: '.05rem',
                minWidth: { xs: 0, md: 170 },
                width: { xs: '50%', md: '200px' },
                fontFamily: goudi.style.fontFamily,
                fontSize: { xs: 11, md: 15 },
              }}
              onClick={() => setIsEditingBiography(true)}
              variant="contained"
              endIcon={<EditIcon />}
            >
              Edit Profile
            </CustomButton>
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
                fontFamily: goudi.style.fontFamily,
                fontSize: 20,
                textTransform: 'none',
                minWidth: 120,
              },
              '.Mui-selected': { color: '#FFFFFF' },
              '& .MuiTabs-scrollButtons': {
                color: '#fff',
              },
            }}
          >
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Books"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Hall of Fame"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Stats"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Activity"
            />
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
                  maxWidth: { xs: '100%', md: 280 },
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
                    value={filterValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'all') {
                        handleStatusFilterChange(null);
                      } else {
                        handleStatusFilterChange(v as EStatus);
                      }
                    }}
                    fullWidth
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 16,
                      fontFamily: goudi.style.fontFamily,
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
                    value={filterValue}
                    onChange={(_, v) => {
                      if (v === 'all') {
                        handleStatusFilterChange(null);
                      } else {
                        handleStatusFilterChange(v as EStatus);
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
                            fontSize: 18,
                            letterSpacing: '.05rem',
                            fontFamily: goudi.style.fontFamily,
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
                              fontSize: 18,
                              letterSpacing: '.05rem',
                              fontFamily: goudi.style.fontFamily,
                            }}
                          >
                            {opt.label}
                          </span>
                        }
                        sx={{
                          ml: 0,
                          mr: 0,
                          borderRadius: '12px',
                          pl: 1.5,
                          pr: 2.2,
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
                  width: '100%',
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
                {filteredBooks.map((book) => (
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
                      height: '100%',
                    }}
                  >
                    <BookCardCompact book={book} small={isMobile} />
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                    <CircularProgress />
                  </Box>
                )}

                {!hasMore && books.length > 0 && (
                  <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      Todos los libros cargados
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {tab === 1 && (
            <Box
              sx={{
                mt: 4,
                color: '#fff',
                fontFamily: goudi.style.fontFamily,
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
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Stats id={user?.id as UUID} />
            </Box>
          )}
          {tab === 3 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Activity</Typography>
              <Typography variant="body1">Próximamente...</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <AnimatedAlert
        open={isUpdatedBiography}
        onClose={() => setIsUpdatedBiography(false)}
        message="Biography updated successfully"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorBiography}
        onClose={() => setIsErrorBiography(false)}
        message="Error updating biography"
        severity={ESeverity.ERROR}
      />
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
