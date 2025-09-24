import queryBooks from './queryBooks';

describe('queryBooks', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('should fetch and sort books (series first)', async () => {
    const books = [
      { id: '1', title: 'A', series: null },
      { id: '2', title: 'B', series: { name: 'Saga', id: 1 } },
      { id: '3', title: 'C', series: null },
      { id: '4', title: 'D', series: { name: 'Saga', id: 2 } },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ books }),
    });
    const formData = new FormData();
    formData.set('title', 'test');
    const result = await queryBooks(formData);
    expect(result.map((b) => b.id)).toEqual(['2', '4', '1', '3']);
  });

  it('should throw error if response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    });
    const formData = new FormData();
    formData.set('title', 'test');
    await expect(queryBooks(formData)).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });

  it('should throw error if fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const formData = new FormData();
    formData.set('title', 'test');
    await expect(queryBooks(formData)).rejects.toThrow(
      'Failed to fetch books: Network error'
    );
  });
});
