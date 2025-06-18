import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Library } from '@/domain/library.model';
import { GET_BOOK_BY_ID_QUERY } from '@/utils/constants/Query';
import { mapHardcoverToBook } from '@/mapper/books.mapper';
import { EStatus } from '@/utils/constants/EStatus';

export const GET = withApiAuthRequired(async () => {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    const idToken = session?.idToken;
    const apiUrlHardcover = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;
    const baseURL = process.env.GY_API?.replace(/['"]/g, '');

    if (session) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: userId });
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl || !idToken) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/ratings`;
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
    const library: Library = {
      books: [],
      stats: {
        totalBooks: 0,
        totalRatings: 0,
        averageRating: 0,
      },
    };

    // Obtener los detalles de cada libro
    for (const rating of ratingsData) {
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
              id: parseInt(rating.bookId),
            },
          }),
        });

        if (!bookResponse.ok) {
          console.error(
            `Error fetching book ${rating.bookId}:`,
            await bookResponse.text()
          );
          continue;
        }
        const apiUrl = `${baseURL}/books/${rating.bookId}`;
        const bookStatusResponse = await fetch(apiUrl, {
          method: 'GET',
          headers,
        });

        let bookStatusData = null;
        if (bookStatusResponse.status === 404) {
          console.log(
            `No hay estado para el libro ${rating.bookId}, usando estado por defecto`
          );
          bookStatusData = { status: EStatus.WANT_TO_READ };
        } else if (!bookStatusResponse.ok) {
          console.error(
            `Error fetching status for book ${rating.bookId}:`,
            await bookStatusResponse.text()
          );
          bookStatusData = { status: EStatus.WANT_TO_READ };
        } else {
          bookStatusData = await bookStatusResponse.json();
        }

        const bookData = await bookResponse.json();

        const mappedBook = {
          ...mapHardcoverToBook(bookData.data.books_by_pk),
          id: rating.bookId,
          rating: rating.rating,
          series: bookData.data.books_by_pk.book_series?.[0]?.series
            ? {
                id: bookData.data.books_by_pk.book_series[0].series.id,
                name: bookData.data.books_by_pk.book_series[0].series.name,
              }
            : null,
          status: bookStatusData?.status ?? EStatus.WANT_TO_READ,
        };

        library.books.push(mappedBook);
      } catch (error) {
        console.error(`Error processing book ${rating.bookId}:`, error);
      }
    }

    // Calcular estadísticas
    library.stats = {
      totalBooks: library.books.length,
      totalRatings: ratingsData.length,
      averageRating:
        library.books.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          library.books.length || 0,
    };

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
