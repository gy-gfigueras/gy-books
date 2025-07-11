import getFriendRequests from '@/app/actions/accounts/user/friend/fetchFriendRequest';
import useSWR from 'swr';

interface useFriendRequestsCountProps {
  count: number;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<unknown>;
}

export function useFriendRequestsCount(): useFriendRequestsCountProps {
  const { data, isLoading, error, mutate } = useSWR(
    '/api/auth/accounts/users/friends/request',
    getFriendRequests
  );

  const count = data?.length || 0;

  return {
    count,
    isLoading,
    error,
    mutate,
  };
}
