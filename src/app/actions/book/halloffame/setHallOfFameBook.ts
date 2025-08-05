/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { hallOfFame } from '@/domain/hallOfFame.model';
import { headers, cookies } from 'next/headers';

export default async function setHallOfFameBook(formData: FormData) {
  if (!formData) throw new Error('No quote provided in formData');
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/halloffame`;

  // --- DEBUG: Log info before private fetch ---

  const hallOfFameData = {
    books: [formData.get('bookId')],
  } as unknown as hallOfFame;

  try {
    void (await fetch(urlPrivate, {
      method: 'PATCH',
      body: JSON.stringify(hallOfFameData),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    }));
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
