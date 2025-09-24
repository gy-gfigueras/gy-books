import fetchBookById from './fetchBookById';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';

jest.mock('@/mapper/BookToMO.mapper', () => ({
  mapHardcoverToBook: jest.fn(),
}));

describe('fetchBookById', () => {
  const bookId = 'test-book-id';
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should fetch and map book data', async () => {
    const apiResponse = { id: bookId, title: 'Test Book' };
    const mappedBook = { id: bookId, title: 'Test Book', mapped: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { entries: () => [] },
      json: async () => apiResponse,
    });
    (mapHardcoverToBook as jest.Mock).mockReturnValue(mappedBook);

    const result = await fetchBookById(bookId);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/public/hardcover/${bookId}`),
      expect.objectContaining({ method: 'GET' })
    );
    expect(mapHardcoverToBook).toHaveBeenCalledWith(apiResponse);
    expect(result).toEqual(mappedBook);
  });

  it('should throw error if response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => 'Not found',
      headers: { entries: () => [] },
    });
    await expect(fetchBookById(bookId)).rejects.toThrow(
      'HTTP error! status: 404 - Not found'
    );
  });

  it('should throw error if fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(fetchBookById(bookId)).rejects.toThrow(
      'Failed to fetch books: Network error'
    );
  });
});
