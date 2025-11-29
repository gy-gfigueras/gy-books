import { User } from '@/domain/user.model';
import { act, renderHook } from '@testing-library/react';
import { useBiography } from './useBiography';

// Mock the updateBiography function
jest.mock('@/app/actions/book/updateBiography');

// Mock SWR mutate
jest.mock('swr', () => ({
  mutate: jest.fn(),
}));

import updateBiography from '@/app/actions/book/updateBiography';
import { mutate } from 'swr';

const mockUpdateBiography = updateBiography as jest.MockedFunction<
  typeof updateBiography
>;
const mockMutate = mutate as jest.MockedFunction<typeof mutate>;

describe('useBiography', () => {
  const mockUser: User = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/pic.jpg',
    biography: 'Original biography',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useBiography());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(typeof result.current.handleUpdateBiography).toBe('function');
    expect(typeof result.current.setIsUpdated).toBe('function');
    expect(typeof result.current.setIsError).toBe('function');
  });

  it('should handle successful biography update with optimistic update', async () => {
    const newBiography = 'This is my new biography';

    mockUpdateBiography.mockResolvedValue(undefined);
    mockMutate.mockImplementation(async (key, updateFn, options) => {
      // Simulate optimistic data
      if (
        options?.optimisticData &&
        typeof options.optimisticData === 'function'
      ) {
        options.optimisticData(mockUser);
      }
      // Execute the update function
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(newBiography);
    });

    expect(mockUpdateBiography).toHaveBeenCalledWith(newBiography);
    expect(mockMutate).toHaveBeenCalledWith(
      '/api/auth/get',
      expect.any(Function),
      expect.objectContaining({
        optimisticData: expect.any(Function),
        rollbackOnError: true,
        revalidate: true,
        populateCache: true,
      })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle biography update error with rollback', async () => {
    const mockError = new Error('Failed to update biography');
    const newBiography = 'Test biography';

    mockUpdateBiography.mockRejectedValue(mockError);
    mockMutate.mockImplementation(async (key, updateFn, options) => {
      // Simulate optimistic data
      if (
        options?.optimisticData &&
        typeof options.optimisticData === 'function'
      ) {
        options.optimisticData(mockUser);
      }
      // Execute the update function which will throw
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(newBiography);
    });

    expect(mockUpdateBiography).toHaveBeenCalledWith(newBiography);
    expect(mockMutate).toHaveBeenCalledWith(
      '/api/auth/get',
      expect.any(Function),
      expect.objectContaining({
        rollbackOnError: true,
      })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('should set loading to true during update', async () => {
    const newBiography = 'Test biography';

    // Mock a delayed response
    mockUpdateBiography.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );
    mockMutate.mockImplementation(async (updateFn) => {
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    // Start the async operation without awaiting immediately
    let updatePromise: Promise<void>;
    act(() => {
      updatePromise = result.current.handleUpdateBiography(newBiography);
    });

    // Check loading state during operation
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);

    // Wait for completion
    await act(async () => {
      await updatePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle empty biography', async () => {
    const emptyBiography = '';

    mockUpdateBiography.mockResolvedValue(undefined);
    mockMutate.mockImplementation(async (key, updateFn) => {
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(emptyBiography);
    });

    expect(mockUpdateBiography).toHaveBeenCalledWith('');
    expect(mockMutate).toHaveBeenCalled();
    expect(result.current.isUpdated).toBe(true);
  });

  it('should allow manual state updates', () => {
    const { result } = renderHook(() => useBiography());

    act(() => {
      result.current.setIsUpdated(true);
      result.current.setIsError(true);
    });

    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isError).toBe(true);
  });

  it('should reset error state on successful update', async () => {
    const newBiography = 'Test biography';

    mockUpdateBiography.mockResolvedValue(undefined);
    mockMutate.mockImplementation(async (key, updateFn) => {
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    // First set error state
    act(() => {
      result.current.setIsError(true);
    });
    expect(result.current.isError).toBe(true);

    // Then do successful update
    await act(async () => {
      await result.current.handleUpdateBiography(newBiography);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.isUpdated).toBe(true);
  });

  it('should call updateBiography with correct biography text', async () => {
    const biographyText = 'This is a detailed biography about the user.';

    mockUpdateBiography.mockResolvedValue(undefined);
    mockMutate.mockImplementation(async (key, updateFn) => {
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(biographyText);
    });

    expect(mockUpdateBiography).toHaveBeenCalledTimes(1);
    expect(mockUpdateBiography).toHaveBeenCalledWith(biographyText);
  });

  it('should handle error when no user data in cache', async () => {
    const newBiography = 'Test biography';

    mockMutate.mockImplementation(async (key, updateFn) => {
      if (typeof updateFn === 'function') {
        // Simulate no user in cache
        await updateFn(undefined);
      }
      return undefined;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(newBiography);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.isUpdated).toBe(false);
  });

  it('should update optimistic data correctly', async () => {
    const newBiography = 'Updated biography';
    let optimisticResult: User | undefined;

    mockUpdateBiography.mockResolvedValue(undefined);
    mockMutate.mockImplementation(async (key, updateFn, options) => {
      // Capture the optimistic data
      if (
        options?.optimisticData &&
        typeof options.optimisticData === 'function'
      ) {
        optimisticResult = options.optimisticData(mockUser);
      }
      if (typeof updateFn === 'function') {
        await updateFn(mockUser);
      }
      return mockUser;
    });

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(newBiography);
    });

    expect(optimisticResult).toEqual({
      ...mockUser,
      biography: newBiography,
    });
  });
});
