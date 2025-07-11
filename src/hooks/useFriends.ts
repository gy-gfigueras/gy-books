import { Friend } from '@/domain/friend.model';
import { getFriends } from '@/service/friends.service';
import useSWR from 'swr';

interface useFriendsProps {
  data: Friend[] | undefined;
  isLoading: boolean;
  error: Error | null;
  count: number;
}

export function useFriends(): useFriendsProps {
  const { data, isLoading, error } = useSWR(
    '/api/auth/users/accounts/friends',
    getFriends
  );

  const count = data?.length;
  return {
    data,
    isLoading,
    error,
    count: count || 0,
  };
}
