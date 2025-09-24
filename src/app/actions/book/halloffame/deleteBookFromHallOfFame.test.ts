/* eslint-disable @typescript-eslint/no-explicit-any */
import deleteBookFromHallOfFame from './deleteBookFromHallOfFame';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('deleteBookFromHallOfFame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if formData is missing', async () => {
    await expect(deleteBookFromHallOfFame(undefined as any)).rejects.toThrow(
      'No quote provided in formData'
    );
  });
  it('calls DELETE with correct params', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('bookId', 'book-id');
    global.fetch = jest.fn().mockResolvedValue({});
    await deleteBookFromHallOfFame(formData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/books/halloffame/book'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
  it('throws error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('bookId', 'book-id');
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(deleteBookFromHallOfFame(formData)).rejects.toThrow(
      'Network error'
    );
  });
});
