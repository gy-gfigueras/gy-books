/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import queryBooks from '@/app/actions/book/queryBooks';
import HardcoverBook from '@/domain/HardcoverBook';
import { useDebounce } from '@/hooks/useDebounce';
import { birthStone, lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { BookCard } from '../components/atoms/BookCard/BookCard';
import CustomTitle from '../components/atoms/BookTitle/CustomTitle';
import LottieAnimation from '../components/atoms/LottieAnimation/LottieAnimation';

const MotionBox = motion(Box);

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState<HardcoverBook[]>([]);

  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/lottie/book_searcher.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  const debouncedTitle = useDebounce(title, 250);

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedTitle) {
        const formData = new FormData();
        formData.append('title', debouncedTitle);
        const result = await queryBooks(formData);
        setBooks(result as HardcoverBook[]);
      } else {
        setBooks([]);
      }
    };

    fetchBooks();
  }, [debouncedTitle]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedTitle) {
      params.set('q', debouncedTitle);
    } else {
      params.delete('q');
    }
    router.push(`/books?${params.toString()}`);
  }, [debouncedTitle, router, searchParams]);

  return (
    <>
      <Head>
        <title>
          {debouncedTitle
            ? `Buscando: ${debouncedTitle} - WingWords`
            : '- Tu biblioteca personal'}
        </title>
        <meta
          name="description"
          content={
            debouncedTitle
              ? `Resultados de búsqueda para: ${debouncedTitle}`
              : 'Tu biblioteca personal de libros'
          }
        />
      </Head>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          pt: 4,
        }}
      >
        <CustomTitle
          text="Library"
          size="6rem"
          fontFamily={birthStone.style.fontFamily}
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        />
      </MotionBox>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          height: '100%',
          gap: '1rem',
          backgroundColor: '#000000',
          paddingBottom: '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'center',
            width: '100%',
            gap: { xs: '0.5rem', sm: '1rem' },
            paddingTop: { xs: '8px', sm: '10px' },
            px: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            placeholder="Look for a book..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                </InputAdornment>
              ),
              style: {
                color: 'white',
                fontFamily: lora.style.fontFamily,
                fontSize: '18px',
                backgroundColor: 'rgba(147, 51, 234, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                minHeight: '56px',
              },
            }}
            InputLabelProps={{
              style: {
                color: 'white',
                fontFamily: lora.style.fontFamily,
                fontSize: '20px',
              },
            }}
            sx={{
              mb: { xs: 1, sm: 2 },
              width: { xs: '90%', sm: '60%', md: '60%' },
              alignSelf: 'center',
              maxWidth: { xs: '100%', sm: '600px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                  borderRadius: '16px',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9333ea',
                  borderWidth: '2px',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '70vh',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'start',
            padding: '25px',
            overflow: 'auto',
            scrollbarColor: '#9333ea transparent',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(147, 51, 234, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
              borderRadius: '4px',
            },
          }}
        >
          {books.length > 0
            ? books.map((book: any) => <BookCard key={book.id} book={book} />)
            : animationData && (
                <LottieAnimation
                  loop
                  animationData={animationData}
                  style={{ width: '500px', height: '80%', maxWidth: '100%' }}
                />
              )}
        </Box>
      </Box>
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BooksContent />
    </Suspense>
  );
}
