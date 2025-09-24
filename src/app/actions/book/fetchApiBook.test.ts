jest.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: jest.fn(),
  },
}));
jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

import getApiBook from './fetchApiBook';
import { auth0 } from '@/lib/auth0';
import { headers, cookies } from 'next/headers';

describe('getApiBook', () => {
  const bookId = 'test-book-id';
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should fetch private book data when authenticated', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-id' },
    });
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });

    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should fetch public book data when not authenticated', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: bookId }) });

    const result = await getApiBook(bookId);
    expect(result).toEqual({ id: bookId });
  });

  it('should return null if fetch fails', async () => {
    (auth0.getSession as jest.Mock).mockResolvedValue(null);
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => '' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, text: async () => 'error' });

    await expect(getApiBook(bookId)).rejects.toThrow();
  });
});
