/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import Book from '@/domain/book.model';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';

export default async function fetchBookById(id: string): Promise<Book> {
  console.log(`book to search` + id);
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/public/hardcover/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return mapHardcoverToBook(data);
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
