/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import { ApiBook } from '@/domain/apiBook.model';
import { UUID } from 'crypto';

// Función para traer un libro específico
export default async function getApiBook(
  bookId: string
): Promise<ApiBook | null> {
  console.log('Server Action', bookId);

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
      url = `${protocol}://${host}/api/public/books/${bookId}`;
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

        const publicUrl = `${protocol}://${host}/api/public/books/${bookId}`;
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
          return publicData as ApiBook;
        }
      }

      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 404) {
      return null;
    }

    // Asegurar que la respuesta tenga la estructura correcta
    return data as ApiBook;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get book status: ${error.message}`);
  }
}

// Nueva función para traer todos los libros con paginación
export async function getBooksWithPagination(
  profileId: UUID,
  page: number = 0,
  size: number = 10
): Promise<{ books: any[]; hasMore: boolean } | null> {
  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const url = `${protocol}://${host}/api/public/accounts/${profileId}/books?page=${page}&size=${size}`;
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    };

    console.log('Server Action - Fetching books by user:', profileId);
    console.log('Server Action - Fetching books by user:', url);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      books: data.books || [],
      hasMore: data.hasMore || false,
    };
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get books: ${error.message}`);
  }
}
