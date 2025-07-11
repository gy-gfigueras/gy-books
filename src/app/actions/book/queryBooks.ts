/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import Book from '@/domain/book.model';

interface ApiResponse {
  books: Book[];
}

export default async function queryBooks(formData: FormData): Promise<Book[]> {
  const query = formData.get('title');
  console.log('Server Action - Searching for:', query);

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/books?query=${query}`;
    console.log('Server Action - Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Server Action - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log('Server Action - Received data:', data);

    // Filtrar y ordenar libros: primero los que tienen series
    const sortedBooks = data.books.sort((a, b) => {
      const aHasSeries = a.series !== null;
      const bHasSeries = b.series !== null;

      if (aHasSeries && !bHasSeries) return -1; // a va primero
      if (!aHasSeries && bHasSeries) return 1; // b va primero
      return 0; // mantienen su orden original
    });

    console.log('Server Action - Sorted books (series first):', sortedBooks);
    return sortedBooks;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
