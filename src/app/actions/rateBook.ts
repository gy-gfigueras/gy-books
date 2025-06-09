/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Rating } from '@/domain/rating.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function rateBook(formData: FormData): Promise<Rating> {
  try {
    const bookId = formData.get('bookId') as string;
    const rating = formData.get('rating') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (!bookId || !rating) {
      throw new Error('Book ID and rating are required');
    }

    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      throw new Error('Rating must be a number between 0 and 5');
    }

    console.log('Server Action - Rating book:', {
      bookId,
      rating: ratingNumber,
      startDate,
      endDate,
    });

    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/rating/${bookId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          rating: ratingNumber,
          startDate: startDate || '2025-01-01',
          endDate: endDate || '2025-01-26',
        }),
        credentials: 'include',
      }
    );

    console.log('Server Action - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.rating) {
      throw new Error('No rating data received from server');
    }

    return data.rating;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to rate book: ${error.message}`);
  }
}
