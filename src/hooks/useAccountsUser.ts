/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { User } from '@/domain/friend.model';
import getAccountsUser from '@/app/actions/accounts/user/fetchAccountsUser';

interface useBookProps {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useAccountsUser(id: string): useBookProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/accounts/users/${id}` : null,
    () => getAccountsUser(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}
