import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import Book from '@/domain/book.model';
import { GET_BOOKS_BY_IDS_QUERY } from '@/utils/constants/Query';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';

export const GET = async (req: NextRequest) => {
  try {
    const SEARCH_PARAMS = req.nextUrl.searchParams;
    const USER_ID = SEARCH_PARAMS.get('userId');

    let apiUrl: string | null = null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    apiUrl = `${baseUrl}/accounts/books/${USER_ID}/halloffame`;

    if (!apiUrl) {
      throw new Error(ELogs.API_URL_NOT_DEFINED);
    }

    const gyCodingResponse = await fetch(apiUrl, { headers });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    let hallOfFame;
    try {
      hallOfFame = await gyCodingResponse.json();

      let books: Book[] = [];

      if (hallOfFame.books && hallOfFame.books.length > 0) {
        const rawBooks = hallOfFame.books;
        const bookIds = rawBooks
          .map((id: string) => parseInt(id))
          .filter((id: number) => !isNaN(id));

        if (bookIds.length > 0) {
          try {
            const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
            const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;

            if (!HARDCOVER_API_URL || !HARDCOVER_API_TOKEN) {
              throw new Error('Missing Hardcover API configuration');
            }

            const booksResponse = await fetch(HARDCOVER_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: HARDCOVER_API_TOKEN,
              },
              body: JSON.stringify({
                query: GET_BOOKS_BY_IDS_QUERY,
                variables: { ids: bookIds },
              }),
            });

            if (booksResponse.ok) {
              const booksData = await booksResponse.json();

              if (booksData.data?.books) {
                books = booksData.data.books.map(
                  (bookData: {
                    id: number;
                    book_series?: Array<{
                      series?: { id: number; name: string };
                    }>;
                  }) => {
                    const mappedBook = mapHardcoverToBook(bookData);
                    return {
                      ...mappedBook,
                      id: bookData.id.toString(),
                      series: bookData.book_series?.[0]?.series
                        ? {
                            id: bookData.book_series[0].series.id,
                            name: bookData.book_series[0].series.name,
                          }
                        : null,
                    };
                  }
                );
              }
            } else {
              console.error(
                'Error fetching Hall of Fame books:',
                await booksResponse.text()
              );
            }
          } catch (err) {
            console.error('Error in batch Hall of Fame request:', err);
          }
        }
      }

      hallOfFame = {
        quote: hallOfFame.quote || '',
        books: books,
      };
    } catch (jsonErr) {
      console.error('Error parsing hallOfFame JSON:', jsonErr);
      hallOfFame = {
        quote: '',
        books: [],
      };
    }

    return NextResponse.json(hallOfFame);
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
