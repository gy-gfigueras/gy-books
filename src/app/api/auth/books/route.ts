import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_BOOK_BY_ID_QUERY } from '@/utils/constants/Query';
import { mapHardcoverToBook } from '@/mapper/books.mapper';
import { ApiBook } from '@/domain/apiBook.model';
import Book from '@/domain/book.model';

export const GET = withApiAuthRequired(async (req) => {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    const idToken = session?.idToken;
    const apiUrlHardcover = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (session) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: userId });
    }

    if (!idToken) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    // Leer page y size de la query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);

    // Log para depuración
    console.log(`[API] page: ${page}, size: ${size}`);

    const apiUrl = `${process.env.GY_API}/books/?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    };

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const ratingsData = await response.json();
    console.log(ratingsData as ApiBook[]);

    const library: { books: Book[]; hasMore: boolean } = {
      books: [],
      hasMore: ratingsData.length === size, // Si devuelve menos que size, no hay más
    };

    // Obtener los detalles de cada libro
    for (const book of ratingsData) {
      try {
        const bookResponse = await fetch(apiUrlHardcover!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${apiKey}`,
          },
          body: JSON.stringify({
            query: GET_BOOK_BY_ID_QUERY,
            variables: {
              id: parseInt(book.id),
            },
          }),
        });

        if (!bookResponse.ok) {
          console.error(
            `Error fetching book ${book.bookId}:`,
            await bookResponse.text()
          );
          continue;
        }

        const bookData = await bookResponse.json();

        const mappedBook: Book = {
          ...mapHardcoverToBook(bookData.data.books_by_pk),
          id: book.id,
          rating: book.userData.rating,
          series: bookData.data.books_by_pk.book_series?.[0]?.series
            ? {
                id: bookData.data.books_by_pk.book_series[0].series.id,
                name: bookData.data.books_by_pk.book_series[0].series.name,
              }
            : null,
          status: book.userData.status,
        };

        library.books.push(mappedBook);
      } catch (error) {
        console.error(`Error processing book ${book.bookId}:`, error);
      }
    }

    return NextResponse.json(library);
  } catch (error) {
    console.error('Error in /api/auth/rating:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
});
