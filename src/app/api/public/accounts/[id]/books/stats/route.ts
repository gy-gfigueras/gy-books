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
    throw new Error(errorText);
  }
  return res.json();
}

async function fetchBookStats(bookId: number) {
  const res = await fetch(HARDCOVER_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HARDCOVER_API_TOKEN!,
    },
    body: JSON.stringify({
      query: GET_STATS,
      variables: { id: bookId },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
}

export const GET = async (req: NextRequest) => {
  try {
    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL || !GY_API) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const profileId = req.nextUrl.pathname.split('/')[4];
    if (!profileId) throw new Error('Profile ID missing in path');

    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const bookStatus: Record<string, number> = {};
    const processedBookIds = new Set<string>();

    let currentPage = 0;
    let hasMore = true;

    while (hasMore) {
      let userBooks;
      try {
        userBooks = await fetchUserBooksPage(profileId, currentPage);
      } catch (error) {
        await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
          error: (error as Error).message,
        });
        throw error;
      }

      if (!Array.isArray(userBooks) || userBooks.length === 0) break;

      for (const book of userBooks) {
        try {
          const bookIdStr = book.id || book.bookId || book?.book?.id;
          if (!bookIdStr || processedBookIds.has(bookIdStr)) continue;

          processedBookIds.add(bookIdStr);
          const bookId = parseInt(bookIdStr, 10);
          if (isNaN(bookId)) continue;

          const status = book.userData?.status || 'unknown';
          bookStatus[status] = (bookStatus[status] || 0) + 1;

          if (status === EStatus.READ) {
            const bookData = await fetchBookStats(bookId);
            calculateStats(bookData, authors, stats);
          }

          // Small delay to avoid rate limits
          await new Promise((r) => setTimeout(r, 150));
        } catch (err) {
          console.error('Error processing book:', err);
        }
      }

      hasMore = userBooks.length === PAGE_SIZE;
      currentPage++;
    }

    return NextResponse.json({
      authors,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      bookStatus,
    });
  } catch (error) {
    console.error('Error in stats API:', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: (error as Error).message || ELogs.UNKNOWN_ERROR,
    });
    return NextResponse.json(
      { error: (error as Error).message || ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
