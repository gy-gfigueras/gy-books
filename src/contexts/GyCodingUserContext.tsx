'use client';

import React, { createContext, useContext } from 'react';
import { User } from '@/domain/user.model';
import useSWR from 'swr';
import fetchUser from '@/app/actions/accounts/fetchUser';

interface GyCodingUserContextType {
  user: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

const GyCodingUserContext = createContext<GyCodingUserContextType>({
  user: undefined,
  isLoading: true,
  error: null,
});

export const useGyCodingUser = () => useContext(GyCodingUserContext);

export const GyCodingUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR('/api/auth/get', fetchUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
    errorRetryCount: 3,
  });

  return (
    <GyCodingUserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </GyCodingUserContext.Provider>
  );
};
