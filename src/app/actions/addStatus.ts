/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import Book from '@/domain/book.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

interface ApiResponse {
  books: Book[];
}

export default async function addStatus(
  bookId: string,
  status: string
): Promise<void> {
  console.log('Server Action - Searching for:', bookId);

  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const url = `${protocol}://${host}/api/auth/books/${bookId}`;
    console.log('Server Action - Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    console.log('Server Action - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log('Server Action - Received data:', data);
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to update status: ${error.message}`);
  }
}
