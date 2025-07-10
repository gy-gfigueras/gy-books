/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { User } from '@/domain/friend.model';
import getAccountsUser from '@/app/actions/getAccountsUser';

interface useBookProps {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useAccountsUser(id: string): useBookProps {
  console.log('id', id);
  const { data, isLoading, error } = useSWR(id ? id : null, getAccountsUser, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    data,
    isLoading,
    error,
  };
}
