/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { User } from '@/domain/user.model';
import fetchUser from '@/app/actions/accounts/fetchUser';
interface useUserProps {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
}
export function useUser(): useUserProps {
  const { data, isLoading, error } = useSWR('/api/auth/get', fetchUser, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    focusThrottleInterval: 5000,
    keepPreviousData: true,
  });

  return {
    data,
    isLoading,
    error,
  };
}
