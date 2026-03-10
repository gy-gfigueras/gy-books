'use client';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';
import { Friend } from '@/domain/friend.model';
import { useFriends } from '@/hooks/useFriends';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface UseAddFriendReturn {
  isFriend: boolean;
  isAdding: boolean;
  isSuccess: boolean;
  isError: boolean;
  handleAddFriend: () => Promise<void>;
  setIsSuccess: (v: boolean) => void;
  setIsError: (v: boolean) => void;
}

export function useAddFriend(targetUserId: string): UseAddFriendReturn {
  const { data: friends } = useFriends();
  const { mutate } = useSWRConfig();

  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const isFriend = friends?.some((f: Friend) => f.id === targetUserId) ?? false;

  const handleAddFriend = async () => {
    if (isFriend || isAdding) return;
    setIsAdding(true);
    setIsError(false);
    try {
      const formData = new FormData();
      formData.set('userId', targetUserId);
      await addFriend(formData);
      setIsSuccess(true);
      mutate('/api/auth/users/accounts/friends');
    } catch {
      setIsError(true);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isFriend,
    isAdding,
    isSuccess,
    isError,
    handleAddFriend,
    setIsSuccess,
    setIsError,
  };
}
