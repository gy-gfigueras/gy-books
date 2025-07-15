/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import queryBooks from '@/app/actions/book/queryBooks';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import Book from '@/domain/book.model';
import SearchIcon from '@mui/icons-material/Search';
import Head from 'next/head';
import { useDebounce } from '@/hooks/useDebounce';
import { BookCard } from '../components/atoms/BookCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { birthStone, goudi } from '@/utils/fonts/fonts';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState<Book[]>([]);

  const debouncedTitle = useDebounce(title, 250);

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedTitle) {
        const formData = new FormData();
        formData.append('title', debouncedTitle);
        const result = await queryBooks(formData);
        setBooks(result);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: birthStone.style.fontFamily,
          }}
        >
          Library
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          height: '100%',
          gap: '1rem',
          backgroundColor: '#161616',
          paddingBottom: '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            gap: '1rem',
            paddingTop: '10px',
          }}
        >
          <TextField
            placeholder="Look for a book..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{
              mb: '8px',
              width: ['60%', '60%', '60%'],
              backgroundColor: '#232323',
              borderRadius: '16px',
              fontFamily: goudi.style.fontFamily,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                  borderRadius: '16px',
                  borderWidth: '1px',
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
                fontSize: '22px',
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
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: 'white',
                      }}
                    />
                  </InputAdornment>
                ),
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
            scrollbarColor: ' #8C54FF transparent',
          }}
        >
          {books.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
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
