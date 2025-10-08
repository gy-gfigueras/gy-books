import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_MULTIPLE_STATS } from '@/utils/constants/Query';
import { calculateStats } from '@/utils/functions/mapStats';
import { EStatus } from '@/utils/constants/EStatus';

const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const GY_API = process.env.GY_API;
const PAGE_SIZE = 50;

async function fetchUserBooksPage(profileId: string, page: number) {
  const url = `${GY_API}/books/${profileId}/list?page=${page}&size=${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ GY API Error (${res.status}):`, errorText);
    throw new Error(errorText);
  }

  const data = await res.json();
  return data;
}

async function fetchMultipleBookStats(bookIds: number[]): Promise<unknown> {
  if (bookIds.length === 0) return { data: { books: [] } };

  const requestBody = {
    query: GET_MULTIPLE_STATS,
    variables: { ids: bookIds },
  };

  const res = await fetch(HARDCOVER_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HARDCOVER_API_TOKEN!,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ Hardcover API Error (${res.status}):`, errorText);
    throw new Error(errorText);
  }

  return res.json();
}

async function processWantToReadBooks(
  wantToReadBooks: number[]
): Promise<number> {
  if (wantToReadBooks.length === 0) return 0;

  console.log(
    `🚀 Processing ${wantToReadBooks.length} want to read books in batch...`
  );

  try {
    const booksData = await fetchMultipleBookStats(wantToReadBooks);

    if (!booksData || typeof booksData !== 'object' || !('data' in booksData)) {
      console.warn('⚠️ Invalid response structure for want to read books');
      return 0;
    }

    const data = booksData as { data?: { books?: Array<{ pages?: number }> } };

    if (!data.data?.books || !Array.isArray(data.data.books)) {
      console.warn('⚠️ No want to read books found in batch response');
      return 0;
    }

    const totalPages = data.data.books.reduce((sum, book) => {
      return sum + (book.pages || 0);
    }, 0);

    console.log(`✅ Want to read books: ${totalPages} total pages`);
    return totalPages;
  } catch (err) {
    console.error(`❌ Error processing want to read books:`, err);
    return 0;
  }
}

async function processBooksInBatches(
  bookIds: number[],
  authors: Record<string, number>,
  stats: { totalPages: number; totalBooks: number }
) {
  try {
    console.log(`🎯 Processing ${bookIds.length} books in a single batch...`);
    const booksData = await fetchMultipleBookStats(bookIds);

    if (!booksData || typeof booksData !== 'object' || !('data' in booksData)) {
      console.warn('⚠️ Invalid response structure from batch request');
      return;
    }

    const data = booksData as { data?: { books?: unknown[] } };

    if (!data.data?.books || !Array.isArray(data.data.books)) {
      console.warn('⚠️ No books found in batch response');
      return;
    }

    console.log(`✅ Successfully fetched ${data.data.books.length} books`);

    // Procesar todos los libros obtenidos
    for (const book of data.data.books) {
      try {
        // Simular la estructura que espera calculateStats
        const bookData = { data: { books_by_pk: book } };
        calculateStats(bookData, authors, stats);
      } catch (err) {
        console.error(`❌ Error processing book:`, err);
      }
    }
  } catch (err) {
    console.error(`❌ Error in batch processing:`, err);
    await sendLog(ELevel.ERROR, 'BATCH_BOOK_STATS_ERROR', {
      error: (err as Error).message,
      bookIds: bookIds.length,
    });
  }
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL || !GY_API) {
      console.error('❌ Environment variables missing');
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const { id: profileId } = await params;

    if (!profileId) {
      console.error('❌ Profile ID missing in path');
      throw new Error('Profile ID missing in path');
    }

    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const bookStatus: Record<string, number> = {};
    const ratings = {
      distribution: {} as Record<string, number>,
      averageRating: 0,
      totalRatedBooks: 0,
    };
    const allRatings: number[] = [];
    const processedBookIds = new Set<string>();
    let currentPage = 0;
    let hasMore = true;
    const readBooks: number[] = [];
    const wantToReadBooks: number[] = [];
    let wantToReadPages = 0;

    // 1. Recopilar todos los libros leídos
    while (hasMore) {
      let userBooks;
      try {
        userBooks = await fetchUserBooksPage(profileId, currentPage);
      } catch (error) {
        console.error(`❌ Error fetching page ${currentPage}:`, error);
        await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
          error: (error as Error).message,
        });
        throw error;
      }

      if (!Array.isArray(userBooks) || userBooks.length === 0) {
        break;
      }

      for (const book of userBooks) {
        try {
          const bookIdStr = book.id || book.bookId || book?.book?.id;

          if (!bookIdStr || processedBookIds.has(bookIdStr)) {
            continue;
          }

          processedBookIds.add(bookIdStr);
          const bookId = parseInt(bookIdStr, 10);

          if (isNaN(bookId)) {
            continue;
          }

          const status = book.userData?.status || 'unknown';
          bookStatus[status] = (bookStatus[status] || 0) + 1;

          // Procesar rating si existe
          const userRating = book.userData?.rating;
          if (userRating && userRating > 0) {
            const ratingKey = userRating.toString();
            ratings.distribution[ratingKey] =
              (ratings.distribution[ratingKey] || 0) + 1;
            allRatings.push(userRating);
            ratings.totalRatedBooks++;
          }

          if (status === EStatus.READ) {
            readBooks.push(bookId);
          } else if (status === EStatus.WANT_TO_READ) {
            wantToReadBooks.push(bookId);
          }
        } catch (err) {
          console.error('❌ Error processing individual book:', err);
          await sendLog(ELevel.ERROR, 'BOOK_PROCESS_ERROR', {
            error: (err as Error).message,
          });
        }
      }

      hasMore = userBooks.length === PAGE_SIZE;
      currentPage++;
    }

    // 2. Procesar libros leídos en paralelo (concurrencia limitada)
    await processBooksInBatches(readBooks, authors, stats);

    // 2.5. Procesar libros want to read para contar páginas en batch
    wantToReadPages = await processWantToReadBooks(wantToReadBooks);

    // 3. Calcular la media de ratings
    if (allRatings.length > 0) {
      const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
      ratings.averageRating = parseFloat((sum / allRatings.length).toFixed(2));
    }

    console.log('✅ Book processing completed');
    console.log('📊 Final stats:', {
      authors: Object.keys(authors).length,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      ratingsDistribution: ratings.distribution,
      averageRating: ratings.averageRating,
      totalRatedBooks: ratings.totalRatedBooks,
    });

    // 4. Log extra si no hay autores
    if (Object.keys(authors).length === 0) {
      console.log('⚠️ No authors found!');
      await sendLog(ELevel.WARN, 'NO_AUTHORS_FOUND', {
        profileId,
        readBooksCount: readBooks.length,
        stats,
      });
    }

    const response = {
      authors,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      wantToReadPages,
      bookStatus,
      ratings,
    };

    console.log('📤 Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Error in stats API:', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: (error as Error).message || ELogs.UNKNOWN_ERROR,
    });
    return NextResponse.json(
      { error: (error as Error).message || ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
