'use client';
import fetchBookById from '@/app/actions/book/fetchBookById';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Book from '@/domain/book.model';
import { CircularProgress } from '@mui/material';
export const BookImage: React.FC<{ bookId: string }> = ({
  bookId,
}: {
  bookId: string;
}) => {
  const [src, setSrc] = useState('/images/default-book-cover.png');
  useEffect(() => {
    const load = async () => {
      try {
        const book = (await fetchBookById(bookId as string)) as Book;
        console.log(book.cover);
        setSrc(book.cover.url as unknown as string);
      } catch (error) {
        console.error('Error loading book image:', error);
        setSrc('/images/default-book-cover.png');
      }
    };
    load();
  }, [bookId]);
  console.log(`BookImage: ${bookId} - ${src}`);

  if (src === '/images/default-book-cover.png') {
    return <CircularProgress />;
  }

  return (
    <Image
      style={{
        height: '100%',
        width: 'auto',
      }}
      src={src}
      alt="Activity Icon"
      width={1080}
      height={1080}
    />
  );
};
