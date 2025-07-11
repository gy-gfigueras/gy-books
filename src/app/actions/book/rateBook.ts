/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function rateBook(formData: FormData) {
  try {
    const bookId = formData.get('bookId') as string;
    const rating = formData.get('rating') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;

    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      throw new Error('Rating must be a number between 0 and 5');
    }

    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/${bookId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          rating: ratingNumber,
          startDate: startDate || '',
          endDate: endDate || '',
          status: status,
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.bookRatingData) {
      throw new Error('No ApiBook data received from server');
    }

    return data.bookRatingData;
  } catch (error: any) {
    throw new Error(`Failed to rate book: ${error.message}`);
  }
}
