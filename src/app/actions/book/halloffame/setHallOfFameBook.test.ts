/* eslint-disable @typescript-eslint/no-explicit-any */
import setHallOfFameBook from './setHallOfFameBook';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('setHallOfFameBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('throws error if formData is missing', async () => {
    await expect(setHallOfFameBook(undefined as any)).rejects.toThrow(
      'No quote provided in formData'
    );
  });
  it('calls PATCH with correct params', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('bookId', 'book-id');
    global.fetch = jest.fn().mockResolvedValue({});
    await setHallOfFameBook(formData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/books/halloffame/book'),
      expect.objectContaining({ method: 'PATCH' })
    );
  });
  it('throws error if fetch fails', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const formData = new FormData();
    formData.set('bookId', 'book-id');
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(setHallOfFameBook(formData)).rejects.toThrow('Network error');
  });
});
