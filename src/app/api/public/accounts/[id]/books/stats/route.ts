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

    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const processedBookIds = new Set<string>();
    const bookStatus: Record<string, number> = {};

    let currentPage = 0;
    const size = 20;
    let hasMore = true;

    console.log(
      `[STATS-DEBUG] Starting book pagination fetch for profile ${profileId}`
    );

    while (hasMore) {
      const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${currentPage}&size=${size}`;
      const headers = { 'Content-Type': 'application/json' };

      console.log(
        `[STATS-DEBUG] Fetching page: ${currentPage}, size: ${size}, URL: ${apiUrl}`
      );

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
      console.log(
        `[STATS-DEBUG] Received ${USER_BOOKS.length} books on page ${currentPage}`
      );

      // Cortar si no hay más libros
      if (!Array.isArray(USER_BOOKS) || USER_BOOKS.length === 0) {
        console.log(
          `[STATS-DEBUG] No more books found, stopping pagination at page ${currentPage}`
        );
        break;
      }

      for (const book of USER_BOOKS) {
        try {
          const bookId = book.id || book.bookId || book?.book?.id;
          if (!bookId) {
            console.warn(`⚠️ Libro sin id válido:`, book);
            continue;
          }

          if (processedBookIds.has(bookId)) {
            continue;
          }
          processedBookIds.add(bookId);

          if (!book.userData?.status) {
            console.warn(`⚠️ Libro sin status: ${bookId}`);
          }

          const bookResponse = await fetch(HARDCOVER_API_URL!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${HARDCOVER_API_TOKEN}`,
            },
            body: JSON.stringify({
              query: GET_STATS,
              variables: { id: parseInt(bookId) },
            }),
          });

          if (!bookResponse.ok) {
            const errText = await bookResponse.text();
            if (errText.includes('Throttled')) {
              console.warn(`🚦 Rate limited en HARDCOVER para libro ${bookId}`);
            } else {
              console.error(
                `❌ Error HARDCOVER para libro ${bookId}:`,
                errText
              );
            }
            continue;
          }

          const bookData = await bookResponse.json();
          const status = book.userData?.status || 'unknown';
          bookStatus[status] = (bookStatus[status] || 0) + 1;

          if (status === EStatus.READ) {
            calculateStats(bookData, authors, stats);
          }

          // Pequeña pausa para evitar rate limit
          await new Promise((res) => setTimeout(res, 150));
        } catch (error) {
          console.error(`💥 Error procesando libro:`, error);
        }
      }

      // Si la página tiene menos de "size" elementos, no hay más
      hasMore = USER_BOOKS.length === size;
      currentPage++;
    }

    return NextResponse.json({
      authors,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      bookStatus,
    });
  } catch (error) {
    console.error('💥 Error en /api/accounts/users/[id]/books', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR,
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
