import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_MULTIPLE_STATS } from '@/utils/constants/Query';
import { calculateStats } from '@/utils/functions/mapStats';
import { EStatus } from '@/utils/constants/EStatus';

export const GET = async (req: NextRequest) => {
  try {
    const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
    const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
    const profileId = req.nextUrl.pathname.split('/')[4];

    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const processedBookIds = new Set<string>();
    const bookStatus: Record<string, number> = {};
    let hasMore = true;
    let currentPage = 0;
    const size = 50;
    const allBooks: Array<{ id: string; userData?: { status?: string } }> = [];

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

      // Filtrar libros únicos y recopilar datos
      for (const book of USER_BOOKS) {
        if (!processedBookIds.has(book.id)) {
          processedBookIds.add(book.id);
          allBooks.push(book);

          // Contar status
          const status = book.userData?.status || null;
          bookStatus[status] = (bookStatus[status] || 0) + 1;
        }
      }

      currentPage++;
    }

    // 2. Procesar solo los libros "read" en batch para estadísticas detalladas
    const readBooks = allBooks.filter(
      (book) => book.userData?.status === EStatus.READ
    );
    const readBookIds = readBooks
      .map((book) => parseInt(book.id))
      .filter((id) => !isNaN(id));

    if (readBookIds.length > 0) {
      try {
        // Hacer una sola query para todos los libros leídos
        const booksResponse = await fetch(HARDCOVER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: HARDCOVER_API_TOKEN,
          },
          body: JSON.stringify({
            query: GET_MULTIPLE_STATS,
            variables: { ids: readBookIds },
          }),
        });

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();

          if (booksData.data?.books) {
            // Procesar todos los libros obtenidos
            for (const book of booksData.data.books) {
              try {
                // Simular la estructura que espera calculateStats
                const bookData = { data: { books_by_pk: book } };
                calculateStats(bookData, authors, stats);
              } catch (err) {
                console.error(`Error processing book:`, err);
              }
            }
            console.log(
              `✅ Successfully processed ${booksData.data.books.length} read books in batch`
            );
          }
        }
      } catch (err) {
        console.error('Error in batch book processing:', err);
      }
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
