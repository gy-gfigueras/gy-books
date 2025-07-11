import { User } from '@/domain/user.model';

export async function getUser(): Promise<User> {
  try {
    const response = await fetch('/api/auth/get', {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No user data received');
    }
    console.log(data);
    const user: User = data;
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
