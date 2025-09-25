import getFriendRequests from './fetchFriendRequest';
jest.mock('next/headers', () => ({ headers: jest.fn(), cookies: jest.fn() }));
import { headers, cookies } from 'next/headers';
describe('getFriendRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns requests if fetch is ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    const mockData = [{ id: 'request-id', userId: 'user-id' }];
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockData });
    await expect(
      getFriendRequests('11111111-2222-3333-4444-555555555555')
    ).resolves.toEqual(mockData);
  });
  it('throws error if response is not ok', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => 'error' });
    await expect(
      getFriendRequests('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow('HTTP error! status: 500 - error');
  });
  it('throws error if no data returned', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => null });
    await expect(
      getFriendRequests('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow('No ApiFriendRequest data received from server');
  });
  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(
      getFriendRequests('11111111-2222-3333-4444-555555555555')
    ).rejects.toThrow('Failed to add friend: Network error');
  });
});
