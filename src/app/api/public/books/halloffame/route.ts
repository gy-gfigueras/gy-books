import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import Book from '@/domain/book.model';
import fetchBookById from '@/app/actions/book/fetchBookById';

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

        const fetchedBooks: (Book | null)[] = await Promise.all(
          rawBooks.map(async (bookId: string) => {
            try {
              const fetchedBook = await fetchBookById(bookId);
              return fetchedBook || null;
            } catch (err) {
              console.error(`Error fetching book ${bookId}:`, err);
              return null;
            }
          })
        );

        books = fetchedBooks.filter((book): book is Book => book !== null);
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
