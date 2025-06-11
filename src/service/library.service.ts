import { Library } from '@/domain/library.model';

export async function getLibrary(): Promise<Library> {
  try {
    const response = await fetch('/api/auth/rating');
    if (!response.ok) {
      throw new Error('Failed to fetch rating list');
    }
    const data = await response.json();

    return data || [];
  } catch (error) {
    console.error('Error fetching rating list:', error);
    throw error;
  }
}
