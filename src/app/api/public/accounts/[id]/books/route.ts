import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_BOOKS_BY_IDS_QUERY } from '@/utils/constants/Query';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';
import Book from '@/domain/book.model';

export const GET = async (req: NextRequest) => {
  try {
    const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
    const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
    const profileId = req.nextUrl.pathname.split('/')[4];

    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const size = parseInt(searchParams.get('size') || '50', 10);

    const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, { headers, method: 'GET' });

    if (!response.ok) {
      const errorText = await response.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(
        `${ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED}: ${errorText}`
      );
    }

    const RATINGS_DATA = await response.json();

    const LIBRARY: { books: Book[]; hasMore: boolean } = {
      books: [],
      hasMore: RATINGS_DATA.length === size,
    };

    if (RATINGS_DATA.length === 0) {
      return NextResponse.json(LIBRARY);
    }

    const bookIds = RATINGS_DATA.map((book: { id: string }) =>
      parseInt(book.id)
    ).filter((id: number) => !isNaN(id));

    if (bookIds.length === 0) {
      return NextResponse.json(LIBRARY);
    }

    const booksResponse = await fetch(HARDCOVER_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${HARDCOVER_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: GET_BOOKS_BY_IDS_QUERY,
        variables: {
          ids: bookIds,
        },
      }),
    });

    if (!booksResponse.ok) {
      console.error(
        'Error fetching books in batch:',
        await booksResponse.text()
      );
      throw new Error(`Failed to fetch books data`);
    }

    const booksData = await booksResponse.json();

    if (!booksData.data?.books) {
      console.error('Invalid response structure:', booksData);
      return NextResponse.json(LIBRARY);
    }

    const booksMap = new Map();
    booksData.data.books.forEach((book: { id: number }) => {
      booksMap.set(book.id.toString(), book);
    });

    for (const userBook of RATINGS_DATA) {
      try {
        const bookData = booksMap.get(userBook.id);

        if (!bookData) {
          console.warn(`Book data not found for ID: ${userBook.id}`);
          continue;
        }

        const MAPPED_BOOK: Book = {
          ...mapHardcoverToBook(bookData),
          id: userBook.id,
          rating: userBook.userData.rating,
          series: bookData.book_series?.[0]?.series
            ? {
                id: bookData.book_series[0].series.id,
                name: bookData.book_series[0].series.name,
              }
            : null,
          status: userBook.userData.status,
          userData: {
            userId: userBook.userData.userId,
            status: userBook.userData.status,
            rating: userBook.userData.rating,
            startDate: userBook.userData.startDate,
            endDate: userBook.userData.endDate,
            progress: userBook.userData.progress,
            review: userBook.userData.review,
            editionId: userBook.userData.editionId,
          },
        };

        LIBRARY.books.push(MAPPED_BOOK);
      } catch (error) {
        console.error(`Error processing book ${userBook.id}:`, error);
      }
    }

    return NextResponse.json(LIBRARY);
  } catch (error) {
    console.error('Error in /api/accounts/users/[id]/books', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
