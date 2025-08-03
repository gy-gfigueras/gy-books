/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { hallOfFame } from '@/domain/hallOfFame.model';
import { headers, cookies } from 'next/headers';

export default async function updateHallOfFame(
  formData: FormData
): Promise<string> {
  console.log('formData', formData);
  if (!formData) throw new Error('No quote provided in formData');
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/halloffame`;

  // --- DEBUG: Log info before private fetch ---
  console.log('[DEBUG] Private fetch URL:', urlPrivate);

  const hallOfFameData = {
    quote: formData.get('quote') as string,
    books:
      formData.getAll('books').map((book) => ({
        bookId: book.toString(),
      })) ?? [],
  } as unknown as hallOfFame;

  console.log(JSON.stringify(hallOfFameData));
  let privateRes: Response;
  try {
    privateRes = await fetch(urlPrivate, {
      method: 'PATCH',
      body: JSON.stringify(hallOfFameData),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });
    console.log('[DEBUG] Private fetch status:', privateRes.status);
    const privateText = await privateRes.clone().text();
    console.log('[DEBUG] Private fetch body:', privateText);

    if (privateRes.ok) {
      return privateText;
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, sigue al endpoint público
    console.log(
      '[DEBUG] Private fetch returned 401. Trying public endpoint...'
    );
    return privateText as string;
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
