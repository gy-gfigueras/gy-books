import updateBiography from './updateBiography';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

import { headers, cookies } from 'next/headers';

describe('updateBiography', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error if biography is missing', async () => {
    await expect(updateBiography('')).rejects.toThrow(
      'No biography provided in formData'
    );
  });

  it('returns text if private fetch is OK', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      clone: () => ({ text: async () => 'biography updated' }),
      status: 200,
    });
    await expect(updateBiography('new bio')).resolves.toBe('biography updated');
  });

  it('returns text if private fetch is 401', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'unauthorized' }),
      status: 401,
    });
    await expect(updateBiography('bio')).resolves.toBe('unauthorized');
  });

  it('throws error if private fetch is not OK and not 401', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      clone: () => ({ text: async () => 'server error' }),
      status: 500,
    });
    await expect(updateBiography('bio')).rejects.toThrow(
      'Private fetch failed. Status: 500 - server error'
    );
  });

  it('throws error if fetch throws', async () => {
    (headers as jest.Mock).mockResolvedValue({ get: () => 'localhost:3000' });
    (cookies as jest.Mock).mockResolvedValue({ toString: () => 'cookie-data' });
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(updateBiography('bio')).rejects.toThrow('Network error');
  });
});
