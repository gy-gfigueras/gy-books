import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_STATS } from '@/utils/constants/Query';
import { calculateStats } from '@/utils/functions/mapStats';
import { EStatus } from '@/utils/constants/EStatus';

export const GET = async (req: NextRequest) => {
  try {
    const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
    const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
    const profileId = req.nextUrl.pathname.split('/')[4]; // [id]

    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    // Siempre traer todos los libros en bucle de 20 en 20
    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const processedBookIds = new Set<string>();
    const bookStatus: Record<string, number> = {};
    let hasMore = true;
    let currentPage = 0;
    const size = 20;

    while (hasMore) {
      const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${currentPage}&size=${size}`;
      const headers = { 'Content-Type': 'application/json' };
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
      const USER_BOOKS = await response.json();
      hasMore = USER_BOOKS.length === size;
      for (const book of USER_BOOKS) {
        try {
          if (processedBookIds.has(book.id)) {
            continue; // Ya procesado, lo saltamos
          }
          processedBookIds.add(book.id);
          const bookResponse = await fetch(HARDCOVER_API_URL!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${HARDCOVER_API_TOKEN}`,
            },
            body: JSON.stringify({
              query: GET_STATS,
              variables: { id: parseInt(book.id) },
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
          const status = book.userData?.status || 'unknown';
          bookStatus[status] = (bookStatus[status] || 0) + 1;
          if (status === EStatus.READ) {
            calculateStats(bookData, authors, stats);
          }
        } catch (error) {
          console.error(`Error processing book ${book.bookId}:`, error);
        }
      }
      currentPage++;
    }

    return NextResponse.json({
      authors,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      bookStatus,
    });
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
