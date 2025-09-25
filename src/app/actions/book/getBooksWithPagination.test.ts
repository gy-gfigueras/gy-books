import { getBooksWithPagination } from './fetchApiBook';
import { headers } from 'next/headers';
type UUID = `${string}-${string}-${string}-${string}-${string}`;

jest.mock('next/headers');

const profileId: UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('getBooksWithPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock | undefined) = jest.fn();
  });

  it('should use default host if headersList.get("host") is undefined', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => undefined });
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ books: [1], hasMore: true }),
    });
    const result = await getBooksWithPagination(profileId);
    expect(result).toEqual({ books: [1], hasMore: true });
  });

  it('should use http protocol in development and https in production', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ books: [], hasMore: false }),
    });
    await getBooksWithPagination(profileId);
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    await getBooksWithPagination(profileId);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should use default page and size values', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ books: [1, 2], hasMore: false }),
    });
    const result = await getBooksWithPagination(profileId);
    expect(result).toEqual({ books: [1, 2], hasMore: false });
  });

  it('should throw error if response.ok is false', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    });
    await expect(getBooksWithPagination(profileId)).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });

  it('should throw error if headers throws', async () => {
    (headers as jest.Mock).mockRejectedValue(new Error('headers error'));
    await expect(getBooksWithPagination(profileId)).rejects.toThrow(
      'Failed to get books: headers error'
    );
  });

  it('should return empty books and hasMore false if data is missing', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    const result = await getBooksWithPagination(profileId);
    expect(result).toEqual({ books: [], hasMore: false });
  });
});
