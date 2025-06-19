import Book from '@/domain/book.model';

export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch('/api/auth/books');
    if (!response.ok) {
      throw new Error('Failed to fetch rating list');
    }
    const data = await response.json();

    return data.books || [];
  } catch (error) {
    console.error('Error fetching rating list:', error);
    throw error;
  }
}
