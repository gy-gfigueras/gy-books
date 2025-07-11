import { Friend } from '@/domain/friend.model';

export async function getFriends(): Promise<Friend[]> {
  try {
    const response = await fetch('/api/auth/accounts/users/friends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch friends list');
    }
    const data = await response.json();

    return (data as Friend[]) || [];
  } catch (error) {
    console.error('Error fetching friends list:', error);
    throw error;
  }
}
