/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import bookStatus from '@/domain/bookStatus';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';

export default async function getBookStatus(
  bookId: string
): Promise<bookStatus | null> {
  console.log('Server Action - Getting book status for:', bookId);

  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    // Verificar si el usuario está autenticado
    const session = await getSession();
    const isAuthenticated = !!session?.user;

    let url: string;
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    };

    if (isAuthenticated) {
      // Usar ruta privada con autenticación
      url = `${protocol}://${host}/api/auth/books/${bookId}`;
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Cookie: cookieHeader,
      };
      fetchOptions.credentials = 'include';
    } else {
      // Usar ruta pública sin autenticación
      url = `${protocol}://${host}/api/books/${bookId}/public`;
    }

    console.log('Server Action - Fetching from URL:', url);
    console.log('Server Action - Is authenticated:', isAuthenticated);

    const response = await fetch(url, fetchOptions);

    console.log('Server Action - Response status:', response.status);

    if (!response.ok) {
      // Si la ruta privada falla y el usuario está autenticado, intentar con la ruta pública
      if (isAuthenticated && response.status >= 500) {
        console.log(
          'Server Action - Private route failed, trying public route as fallback'
        );

        const publicUrl = `${protocol}://${host}/api/books/${bookId}/public`;
        const publicResponse = await fetch(publicUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          console.log('Server Action - Public fallback successful');
          return publicData.bookStatus as bookStatus;
        }
      }

      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server Action - Received data:', data.bookStatusData);

    // Manejar la estructura de respuesta diferente según la ruta
    if (isAuthenticated) {
      return data.bookStatusData as bookStatus;
    } else {
      return data.bookStatusData as bookStatus;
    }
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get book status: ${error.message}`);
  }
}
