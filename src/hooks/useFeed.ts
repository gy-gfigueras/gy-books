/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';

interface useFeedActivity {
  data: FeedActivity[];
  isLoading: boolean;
  error: Error | null;
}

export function useFeedActivity(id: string): useFeedActivity {
  const { data, isLoading, error } = useSWR(
    id ? `/api/auth/books/activity` : null,
    () => fetchActivities(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data as FeedActivity[],
    isLoading,
    error,
  };
}
