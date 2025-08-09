/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import { UUID } from 'crypto';
import getStats from '@/service/stats.service';

interface UseStatsResult<T> {
  data?: T;
  isLoading: boolean;
  error?: Error;
}

export function useStats(id: UUID): UseStatsResult<any> {
  const { data, error, isLoading } = useSWR(
    id ? `/api/public/accounts/${id}/books/stats` : null,
    () => getStats(id)
  );

  return { data, isLoading, error };
}
