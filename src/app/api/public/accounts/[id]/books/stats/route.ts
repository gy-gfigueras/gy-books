import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_STATS } from '@/utils/constants/Query';
import { calculateStats } from '@/utils/functions/mapStats';
import { EStatus } from '@/utils/constants/EStatus';

const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const GY_API = process.env.GY_API;
const PAGE_SIZE = 20;

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

async function fetchBookStats(
  bookId: number,
  retryCount = 0
): Promise<unknown> {
  const requestBody = {
    query: GET_STATS,
    variables: { id: bookId },
  };

  const res = await fetch(HARDCOVER_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HARDCOVER_API_TOKEN!,
    },
    body: JSON.stringify(requestBody),
  });

  if (res.status === 429) {
    // Rate limited - implement exponential backoff
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchBookStats(bookId, retryCount + 1);
    } else {
      console.warn(`⚠️ Max retries reached for book ${bookId}, skipping`);
      return null; // Skip this book instead of failing
    }
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ HARDCOVER API Error (${res.status}):`, text);
    throw new Error(text);
  }

  const data = await res.json();
  return data;
}

async function processBooksInBatches(
  bookIds: number[],
  authors: Record<string, number>,
  stats: { totalPages: number; totalBooks: number }
) {
  const CONCURRENCY = 2; // Reduced from 5 to 2
  let idx = 0;

  while (idx < bookIds.length) {
    const batch = bookIds.slice(idx, idx + CONCURRENCY);

    await Promise.all(
      batch.map(async (bookId) => {
        try {
          console.log(`🎯 Processing book ${bookId}...`);
          const bookData = await fetchBookStats(bookId);

          if (!bookData) {
            console.warn(`⚠️ Book ${bookId} skipped due to rate limiting`);
            return;
          }

          if (
            !bookData ||
            typeof bookData !== 'object' ||
            !('data' in bookData)
          ) {
            console.warn(
              `⚠️ Book ${bookId} has invalid data structure:`,
              bookData
            );
            await sendLog(ELevel.WARN, 'BOOK_STATS_EMPTY', {
              bookId,
              bookData,
            });
            return;
          }

          const data = bookData as { data?: { books_by_pk?: unknown } };

          if (!data.data?.books_by_pk) {
            console.warn(`⚠️ Book ${bookId} missing books_by_pk:`, data.data);
            await sendLog(ELevel.WARN, 'BOOKS_BY_PK_MISSING', {
              bookId,
              bookData,
            });
            return;
          }

          calculateStats(bookData, authors, stats);
        } catch (err) {
          console.error(`❌ Error processing book ${bookId}:`, err);
          await sendLog(ELevel.ERROR, 'BOOK_STATS_ERROR', {
            bookId,
            error: (err as Error).message,
          });
        }
      })
    );

    idx += CONCURRENCY;

    await new Promise((r) => setTimeout(r, 500));
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

    // 2.5. Procesar libros want to read para contar páginas
    console.log('🚀 Starting to process want to read books...');
    for (const bookId of wantToReadBooks) {
      try {
        const bookData = await fetchBookStats(bookId);
        if (bookData && typeof bookData === 'object' && 'data' in bookData) {
          const data = bookData as {
            data?: { books_by_pk?: { pages?: number } };
          };
          const pages = data.data?.books_by_pk?.pages || 0;
          wantToReadPages += pages;
        }
      } catch (err) {
        console.error(`❌ Error processing want to read book ${bookId}:`, err);
      }
    }

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
