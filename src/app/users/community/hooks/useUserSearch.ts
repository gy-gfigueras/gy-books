import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { User } from '@/domain/friend.model';
import queryUsers from '@/app/actions/accounts/user/fetchUsers';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';

export function useUserSearch() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearch) {
        const formData = new FormData();
        formData.append('username', debouncedSearch);
        const result = await queryUsers(formData);
        setUsers(result);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const handleAddFriend = async (userId: string) => {
    try {
      setIsAddingFriend(true);
      const formData = new FormData();
      formData.append('userId', userId);
      await addFriend(formData);
      setSuccessMessage(true);

      // Actualizar la lista para marcar al usuario como amigo
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFriend: true } : user
        )
      );
    } catch (error) {
      console.error('Error adding friend:', error);
    } finally {
      setIsAddingFriend(false);
    }
  };

  return {
    search,
    setSearch,
    users,
    isAddingFriend,
    successMessage,
    setSuccessMessage,
    handleAddFriend,
  };
}
