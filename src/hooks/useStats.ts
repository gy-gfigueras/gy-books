/* eslint-disable @typescript-eslint/no-explicit-any */

import { getStats } from '@/app/actions/book/fetchUserStats';
import { UUID } from 'crypto';
import useSWR from 'swr';

interface useStatsProps {
  data: any | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useStats(id: UUID): useStatsProps {
  const { data, isLoading, error } = useSWR(
    `/api/public/accounts/${id}/books/stats`,
    () => getStats(id)
  );

  return {
    data,
    isLoading,
    error,
  };
}
