/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderHook, act } from '@testing-library/react';
import { useBookRatingState } from './useBookRatingState';
import { BookRatingProps } from '../types';
import { EStatus } from '@/utils/constants/EStatus';
import { ApiBook } from '@/domain/apiBook.model';

// Mock dependencies
jest.mock('@/hooks/useUser');
jest.mock('@/hooks/useRemoveBook');
jest.mock('@/app/actions/book/rateBook');
jest.mock('@/domain/userData.model');

import { useUser } from '@/hooks/useUser';
import { useRemoveBook } from '@/hooks/useRemoveBook';
import rateBook from '@/app/actions/book/rateBook';
import { formatPercent, formatProgress } from '@/domain/userData.model';

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseRemoveBook = useRemoveBook as jest.MockedFunction<
  typeof useRemoveBook
>;
const mockRateBook = rateBook as jest.MockedFunction<typeof rateBook>;
const mockFormatPercent = formatPercent as jest.MockedFunction<
  typeof formatPercent
>;
const mockFormatProgress = formatProgress as jest.MockedFunction<
  typeof formatProgress
>;

describe('useBookRatingState', () => {
  const mockMutate = jest.fn();
  const mockHandleDeleteBook = jest.fn();

  const mockUser = {
    id: '00000000-0000-0000-0000-000000000000' as `${string}-${string}-${string}-${string}-${string}`,
    username: 'testuser',
    picture: 'user-picture-url',
    apiKey: 'user-api-key',
    phoneNumber: '1234567890',
  };
  const mockApiBook: ApiBook = {
    id: 'test-book-id',
    averageRating: 4.5,
    userData: {
      rating: 4,
      status: EStatus.READ,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      progress: 1,
      userId: '',
    },
  };

  const defaultProps: BookRatingProps = {
    bookId: 'test-book-id',
    apiBook: null,
    isRatingLoading: false,
    mutate: mockMutate,
    isLoggedIn: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    mockUseRemoveBook.mockReturnValue({
      handleDeleteBook: mockHandleDeleteBook,
      isLoading: false,
      error: null,
      isSuccess: false,
      setIsSuccess: function (isSuccess: boolean): void {
        throw new Error('Function not implemented.');
      },
      setError: function (error: Error | null): void {
        throw new Error('Function not implemented.');
      },
      setIsLoading: function (isLoading: boolean): void {
        throw new Error('Function not implemented.');
      },
    });

    mockFormatProgress.mockImplementation((value) => value);
    mockFormatPercent.mockImplementation((value) => value / 100);
  });

  it('initializes with default values when no apiBook', () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    expect(result.current.state.tempRating).toBe(0);
    expect(result.current.state.tempStatus).toBe(EStatus.RATE);
    expect(result.current.state.tempStartDate).toBe('');
    expect(result.current.state.tempEndDate).toBe('');
    expect(result.current.state.tempProgress).toBe(0);
    expect(result.current.state.isSubmitting).toBe(false);
    expect(result.current.state.isProgressPercent).toBe(true);
  });

  it('initializes with apiBook data when provided', () => {
    const props = { ...defaultProps, apiBook: mockApiBook };
    const { result } = renderHook(() => useBookRatingState(props));

    expect(result.current.state.tempRating).toBe(4);
    expect(result.current.state.tempStatus).toBe(EStatus.READ);
    expect(result.current.state.tempStartDate).toBe('2023-01-01');
    expect(result.current.state.tempEndDate).toBe('2023-01-31');
  });

  it('sets progress as percent when progress is <= 1', () => {
    const apiBookWithPercent = {
      ...mockApiBook,
      userData: {
        ...mockApiBook.userData!,
        progress: 0.5,
      },
    };

    const props = { ...defaultProps, apiBook: apiBookWithPercent };
    renderHook(() => useBookRatingState(props));

    expect(mockFormatProgress).toHaveBeenCalledWith(0.5);
  });

  it('handles apiBook without userData', () => {
    const apiBookNoUserData: ApiBook = {
      id: 'test-book-id',
      averageRating: 4.5,
      userData: undefined,
    };

    const props = { ...defaultProps, apiBook: apiBookNoUserData };
    const { result } = renderHook(() => useBookRatingState(props));

    expect(result.current.state.tempRating).toBe(0);
    expect(result.current.state.tempStatus).toBe(EStatus.RATE);
  });

  it('sets progress correctly when status is READ', () => {
    const apiBookRead = {
      ...mockApiBook,
      userData: {
        ...mockApiBook.userData!,
        status: EStatus.READ,
        progress: 0.8,
      },
    };

    const props = { ...defaultProps, apiBook: apiBookRead };
    renderHook(() => useBookRatingState(props));

    // Progress should be set to 1 when status is READ
    expect(apiBookRead.userData!.progress).toBe(1);
  });

  it('handles state setters correctly', () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    act(() => {
      result.current.handlers.setTempRating(5);
    });
    expect(result.current.state.tempRating).toBe(5);

    act(() => {
      result.current.handlers.setTempStatus(EStatus.READING);
    });
    expect(result.current.state.tempStatus).toBe(EStatus.READING);

    act(() => {
      result.current.handlers.setTempStartDate('2023-02-01');
    });
    expect(result.current.state.tempStartDate).toBe('2023-02-01');

    act(() => {
      result.current.handlers.setTempEndDate('2023-02-28');
    });
    expect(result.current.state.tempEndDate).toBe('2023-02-28');

    act(() => {
      result.current.handlers.setTempProgress(50);
    });
    expect(result.current.state.tempProgress).toBe(50);

    act(() => {
      result.current.handlers.setIsProgressPercent(false);
    });
    expect(result.current.state.isProgressPercent).toBe(false);
  });

  it('handles handleApply successfully with percentage progress', async () => {
    const updatedApiBook = {
      ...mockApiBook,
      userData: {
        rating: 5,
        status: EStatus.READ,
        startDate: '2023-02-01',
        endDate: '2023-02-28',
        progress: 1,
      },
    };

    mockRateBook.mockResolvedValue(updatedApiBook);

    const { result } = renderHook(() => useBookRatingState(defaultProps));

    act(() => {
      result.current.handlers.setTempRating(5);
      result.current.handlers.setTempProgress(100);
      result.current.handlers.setIsProgressPercent(true);
    });

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(mockRateBook).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith(updatedApiBook, {
      revalidate: false,
    });
  });

  it('handles handleApply successfully with page progress', async () => {
    const updatedApiBook = {
      ...mockApiBook,
      userData: {
        rating: 4,
        status: EStatus.READING,
        startDate: '2023-01-01',
        endDate: '',
        progress: 150,
      },
    };

    mockRateBook.mockResolvedValue(updatedApiBook);

    const { result } = renderHook(() => useBookRatingState(defaultProps));

    act(() => {
      result.current.handlers.setTempProgress(150);
      result.current.handlers.setIsProgressPercent(false);
    });

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(mockRateBook).toHaveBeenCalled();
  });

  it('handles handleApply when user is not available', async () => {
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useBookRatingState(defaultProps));

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(mockRateBook).not.toHaveBeenCalled();
  });

  it('handles handleApply when already submitting', async () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    // Set submitting state
    act(() => {
      result.current.handlers.handleApply();
    });

    // Try to call again while submitting
    await act(async () => {
      await result.current.handlers.handleApply();
    });

    // Should only be called once
    expect(mockRateBook).toHaveBeenCalledTimes(1);
  });

  it('handles error in handleApply', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockRateBook.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useBookRatingState(defaultProps));

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error applying changes:',
      expect.any(Error)
    );
    expect(result.current.state.isSubmitting).toBe(false);

    consoleSpy.mockRestore();
  });

  it('handles handleApply without mutate function', async () => {
    const propsWithoutMutate = { ...defaultProps, mutate: undefined };
    const updatedApiBook = { ...mockApiBook };

    mockRateBook.mockResolvedValue(updatedApiBook);

    const { result } = renderHook(() => useBookRatingState(propsWithoutMutate));

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(mockRateBook).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('handles anchorEl state', () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    const element = document.createElement('div');

    act(() => {
      result.current.setAnchorEl(element);
    });

    expect(result.current.anchorEl).toBe(element);
  });

  it('handles drawer state', () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    act(() => {
      result.current.setDrawerOpen(true);
    });

    expect(result.current.drawerOpen).toBe(true);
  });

  it('returns correct user and loading states', () => {
    const { result } = renderHook(() => useBookRatingState(defaultProps));

    expect(result.current.user).toBe(mockUser);
    expect(result.current.isUserLoading).toBe(false);
    expect(result.current.isDeleteLoading).toBe(false);
  });

  it('closes anchorEl and drawer after successful apply', async () => {
    const updatedApiBook = { ...mockApiBook };
    mockRateBook.mockResolvedValue(updatedApiBook);

    const { result } = renderHook(() => useBookRatingState(defaultProps));

    act(() => {
      result.current.setAnchorEl(document.createElement('div'));
      result.current.setDrawerOpen(true);
    });

    await act(async () => {
      await result.current.handlers.handleApply();
    });

    expect(result.current.anchorEl).toBe(null);
    expect(result.current.drawerOpen).toBe(false);
  });

  it('handles userData with undefined/null values', () => {
    const apiBookPartialData: ApiBook = {
      id: 'test-book-id',
      averageRating: 4.5,
      userData: {
        rating: 0,
        status: EStatus.WANT_TO_READ,
        startDate: '',
        endDate: '',
        progress: undefined,
        userId: '',
      },
    };

    const props = { ...defaultProps, apiBook: apiBookPartialData };
    const { result } = renderHook(() => useBookRatingState(props));

    expect(result.current.state.tempRating).toBe(0);
    expect(result.current.state.tempStatus).toBe(EStatus.WANT_TO_READ);
    expect(result.current.state.tempStartDate).toBe('');
    expect(result.current.state.tempEndDate).toBe('');
  });
});
