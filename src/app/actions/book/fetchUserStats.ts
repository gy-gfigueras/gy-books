/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { UUID } from 'crypto';
import { Stats } from '@/domain/stats.model';

// Nueva función para traer todos los libros con paginación
export async function getStats(profileId: UUID): Promise<any> {
  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const url = `${protocol}://${host}/api/accounts/users/${profileId}/books/stats`;
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    };

    console.log('Server Action - Fetching books by user:', profileId);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Stats = await response.json();

    return data;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get books: ${error.message}`);
  }
}
