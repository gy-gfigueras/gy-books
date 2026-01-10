import { useState } from 'react';
import useSWR from 'swr';
import type HardcoverBook from '../../domain/HardcoverBook';

export type ProfileUserData = {
  editionId?: string;
  status?: string;
  rating?: number;
  review?: string;
  progress?: number;
  startedAt?: string;
  finishedAt?: string;
  [key: string]: unknown;
};

export type ProfileBookSummary = {
  id: string;
  averageRating?: number;
  userData?: ProfileUserData;
};

type Result = {
  data: HardcoverBook[];
  isLoading: boolean;
  error: Error | null;
  isDone: boolean;
};

/**
 * useMergedBooksIncremental
 * - Fetch summaries page-by-page (pageSize, default 5)
 * - For each page, POST ids to /api/hardcover and merge userData into returned HardcoverBook[]
 * - Uses SWR for caching and showing previous data immediately
 */

// Fetcher function que maneja todo el proceso incremental
async function fetchAllMergedBooks(
  profileId: string,
  pageSize: number
): Promise<HardcoverBook[]> {
  const allBooks: HardcoverBook[] = [];
  let page = 0;

  while (true) {
    const url = `/api/public/books?profileId=${profileId}&page=${page}&size=${pageSize}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const pageData = (await res.json()) as ProfileBookSummary[];
    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    // obtain ids and ask hardcover for this page
    const ids = pageData.map((p) => p.id).filter(Boolean);
    let hardcoverArr: HardcoverBook[] = [];
    if (ids.length > 0) {
      const hRes = await fetch('/api/hardcover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!hRes.ok) throw new Error(`Hardcover HTTP ${hRes.status}`);
      hardcoverArr = (await hRes.json()) as HardcoverBook[];
    }

    // merge userData into hardcover results by id
    const summaryById = new Map<string, ProfileUserData | undefined>();
    pageData.forEach((s) => summaryById.set(s.id, s.userData));

    const merged = hardcoverArr.map((hb) => ({
      ...hb,
      userData: summaryById.get(hb.id) || hb.userData,
    }));

    allBooks.push(...(merged as HardcoverBook[]));

    // if the page returned less than pageSize, we've reached the end
    if (pageData.length < pageSize) break;
    page += 1;
  }

  return allBooks;
}

export default function useMergedBooksIncremental(
  profileId?: string,
  pageSize = 5
): Result {
  const [isDone, setIsDone] = useState(false);

  const { data, isLoading, error } = useSWR(
    profileId ? [`/api/merged-books/${profileId}`, pageSize] : null,
    ([, size]) => fetchAllMergedBooks(profileId!, size as number),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
      onSuccess: () => setIsDone(true),
      onError: (err) => {
        console.error('Error loading merged books:', err);
        setIsDone(true);
      },
    }
  );

  return {
    data: data || [],
    isLoading,
    error: error || null,
    isDone: isDone || (!isLoading && !!data),
  };
}
