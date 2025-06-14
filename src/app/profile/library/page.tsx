'use client';
import React, { useState, useMemo, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  Button,
} from '@mui/material';
import { useLibrary } from '@/hooks/useLibrary';
import {
  BookCardCompact,
  BookCardCompactSkeleton,
} from '@/app/components/atoms/BookCardCompact';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { inter } from '@/utils/fonts/fonts';
import StarIcon from '@mui/icons-material/Star';
import Book from '@/domain/book.model';

type SortOption = 'rating-asc' | 'rating-desc' | 'title-asc' | 'title-desc';
type FilterOption = 'all' | 'rated' | 'unrated';

// Componente para los filtros
const Filters = ({
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  searchQuery,
  setSearchQuery,
  seriesStats,
  isMobile,
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (value: FilterOption) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  seriesStats: Map<string, number>;
  isMobile: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const FilterContent = () => (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Ordenar por
        </InputLabel>
        <Select
          value={sortBy}
          label="Ordenar por"
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '.MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <MenuItem value="rating-desc">Rating (mayor a menor)</MenuItem>
          <MenuItem value="rating-asc">Rating (menor a mayor)</MenuItem>
          <MenuItem value="title-asc">Título (A-Z)</MenuItem>
          <MenuItem value="title-desc">Título (Z-A)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Filtrar por
        </InputLabel>
        <Select
          value={filterBy}
          label="Filtrar por"
          onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '.MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <MenuItem value="all">Todos los libros</MenuItem>
          <MenuItem value="rated">Con rating</MenuItem>
          <MenuItem value="unrated">Sin rating</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Buscar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por título o autor..."
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}
      />

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: inter.style.fontFamily,
          }}
        >
          Series ({seriesStats.size})
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Array.from(seriesStats.entries()).map(([name, count]) => (
            <Chip
              key={name}
              label={`${name} (${count})`}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: inter.style.fontFamily,
              }}
            />
          ))}
        </Box>
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Filtros
        </Button>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 350 },
              p: 3,
              backgroundColor: '#161616',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: inter.style.fontFamily }}
            >
              Filtros
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterContent />
        </Drawer>
      </>
    );
  }

  return (
    <Paper
      sx={{
        width: 300,
        p: 3,
        height: 'fit-content',
        position: 'sticky',
        top: 24,
        background: 'rgba(35, 35, 35, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontFamily: inter.style.fontFamily,
          color: 'white',
        }}
      >
        Filtros
      </Typography>
      <FilterContent />
    </Paper>
  );
};

// Componente para la lista de libros
const BooksList = ({
  books,
  sortBy,
  filterBy,
  searchQuery,
}: {
  books: Book[];
  sortBy: SortOption;
  filterBy: FilterOption;
  searchQuery: string;
}) => {
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = [...books];

    // Aplicar búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.name.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros
    if (filterBy === 'rated') {
      filtered = filtered.filter((book) => book.rating !== undefined);
    } else if (filterBy === 'unrated') {
      filtered = filtered.filter((book) => book.rating === undefined);
    }

    // Aplicar ordenamiento
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [books, sortBy, filterBy, searchQuery]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
        gap: 2,
      }}
    >
      {filteredAndSortedBooks.map((book) => (
        <Box key={book.id}>
          <BookCardCompact book={book} />
        </Box>
      ))}
    </Box>
  );
};

// Componente principal de la página
export default function LibraryPage() {
  const { data: library } = useLibrary();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const seriesStats = useMemo(() => {
    if (!library?.books) return new Map<string, number>();

    const stats = new Map<string, number>();
    library.books.forEach((book) => {
      if (book.series) {
        stats.set(book.series.name, (stats.get(book.series.name) || 0) + 1);
      }
    });
    return stats;
  }, [library?.books]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: inter.style.fontFamily,
                fontWeight: 'bold',
                mb: 1,
                color: 'white',
              }}
            >
              Mi Biblioteca
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {library?.stats.totalBooks || 0} libros en total
              {library?.stats.averageRating && (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    Media de {library.stats.averageRating.toFixed(1)}
                    <StarIcon
                      sx={{
                        fontSize: 20,
                        marginTop: -0.2,
                        color: 'primary.main',
                      }}
                    />
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Filtros
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          {!isMobile && (
            <Filters
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              seriesStats={seriesStats}
              isMobile={isMobile}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          )}

          <Box sx={{ flexGrow: 1 }}>
            {!library ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(6, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {[...Array(12)].map((_, index) => (
                  <BookCardCompactSkeleton key={index} />
                ))}
              </Box>
            ) : (
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(6, 1fr)',
                      },
                      gap: 2,
                    }}
                  >
                    {[...Array(12)].map((_, index) => (
                      <BookCardCompactSkeleton key={index} />
                    ))}
                  </Box>
                }
              >
                <BooksList
                  books={library.books}
                  sortBy={sortBy}
                  filterBy={filterBy}
                  searchQuery={searchQuery}
                />
              </Suspense>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
