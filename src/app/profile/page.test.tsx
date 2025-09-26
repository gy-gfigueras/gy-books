/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfilePage from './page';
import { User } from '@/domain/user.model';
import { EStatus } from '@/utils/constants/EStatus';
import { UUID } from 'crypto';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock hooks
jest.mock('@/hooks/useFriends');
jest.mock('@/hooks/useBiography');
jest.mock('@/hooks/useActivities');

// Mock server actions
jest.mock('../actions/book/fetchApiBook');

import { useFriends } from '@/hooks/useFriends';
import { useBiography } from '@/hooks/useBiography';
import { useActivities } from '@/hooks/useActivities';
import { getBooksWithPagination } from '../actions/book/fetchApiBook';

// Mock lazy-loaded components
jest.mock('../components/organisms/Stats', () => {
  return function MockStats({ id }: { id: UUID }) {
    return <div data-testid="stats-component">Stats for user {id}</div>;
  };
});

jest.mock('../components/molecules/HallOfFame', () => {
  return function MockHallOfFame({ userId }: { userId: UUID }) {
    return (
      <div data-testid="hall-of-fame-component">Hall of Fame for {userId}</div>
    );
  };
});

jest.mock('../components/molecules/activityTab', () => {
  return function MockActivityTab({ id }: { id: UUID }) {
    return <div data-testid="activity-tab-component">Activity for {id}</div>;
  };
});

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Tab: ({ label, ...props }: any) => <button {...props}>{label}</button>,
  Tabs: ({ children, onChange, value, ...props }: any) => (
    <div data-testid="tabs" {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          onClick: () => onChange?.(null, index),
          'data-selected': value === index,
        })
      )}
    </div>
  ),
  CircularProgress: (props: any) => <div data-testid="loading" {...props} />,
}));

// Mock profile components
jest.mock('./components/ProfileHeader/ProfileHeader', () => ({
  ProfileHeader: ({
    user,
    onEditProfile,
    onBiographyChange,
    onBiographySave,
  }: any) => (
    <div data-testid="profile-header">
      <span>Profile: {user?.username}</span>
      <button onClick={onEditProfile} data-testid="edit-profile-btn">
        Edit Profile
      </button>
      <input
        data-testid="biography-input"
        onChange={(e) => onBiographyChange?.(e.target.value)}
      />
      <button onClick={onBiographySave} data-testid="save-biography-btn">
        Save Biography
      </button>
    </div>
  ),
}));

jest.mock('./components/ProfileHeader/ProfileHeaderSkeleton', () => ({
  ProfileHeaderSkeleton: () => (
    <div data-testid="profile-header-skeleton">Loading...</div>
  ),
}));

jest.mock('./components/BooksFilter/BooksFilter', () => ({
  BooksFilter: ({ onStatusChange, onSearchChange, onOrderByChange }: any) => (
    <div data-testid="books-filter">
      <select
        data-testid="status-filter"
        onChange={(e) => onStatusChange?.(e.target.value || null)}
      >
        <option value="">All</option>
        <option value={EStatus.READING}>Reading</option>
        <option value={EStatus.READ}>Read</option>
        <option value={EStatus.WANT_TO_READ}>Want to Read</option>
      </select>
      <input
        data-testid="search-input"
        placeholder="Search books..."
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
      <select
        data-testid="order-by-select"
        onChange={(e) => onOrderByChange?.(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  ),
}));

jest.mock('./components/BooksList/BooksList', () => ({
  BooksList: ({ books }: any) => (
    <div data-testid="books-list">
      {books.map((book: any) => (
        <div key={book.id} data-testid="book-item">
          {book.title} by {book.author?.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('./components/BooksList/BooksListSkeleton', () => ({
  BooksListSkeleton: () => (
    <div data-testid="books-list-skeleton">Loading books...</div>
  ),
}));

jest.mock('../components/atoms/ProfileSkeleton/ProfileSkeleton', () => {
  return function ProfileSkeleton() {
    return <div data-testid="profile-skeleton">Loading profile...</div>;
  };
});

jest.mock('../components/atoms/Alert/Alert', () => {
  return function AnimatedAlert({ open, message }: any) {
    return open ? <div data-testid="alert">{message}</div> : null;
  };
});

const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000' as UUID,
  username: 'testuser',
  biography: 'Test biography',
  email: 'test@example.com',
  picture: 'test-avatar.jpg',
  apiKey: 'test-api-key',
  phoneNumber: null,
};

const mockBooks = [
  {
    id: 'book-1',
    title: 'Test Book 1',
    author: { name: 'Author 1' },
    series: { name: 'Series 1' },
    status: EStatus.READ,
    rating: 5,
  },
  {
    id: 'book-2',
    title: 'Test Book 2',
    author: { name: 'Author 2' },
    series: { name: 'Series 2' },
    status: EStatus.READING,
    rating: 4,
  },
];

const mockStore = configureStore({
  reducer: {
    user: () => ({
      profile: mockUser,
    }),
  },
});

const mockStoreNoUser = configureStore({
  reducer: {
    user: () => ({
      profile: null,
    }),
  },
});

describe('ProfilePage', () => {
  const mockUseFriends = useFriends as jest.MockedFunction<typeof useFriends>;
  const mockUseBiography = useBiography as jest.MockedFunction<
    typeof useBiography
  >;
  const mockUseActivities = useActivities as jest.MockedFunction<
    typeof useActivities
  >;
  const mockGetBooksWithPagination =
    getBooksWithPagination as jest.MockedFunction<
      typeof getBooksWithPagination
    >;
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<
    typeof useSearchParams
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const mockSearchParams = {
    get: jest.fn(),
    toString: jest.fn(() => ''),
  };

  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockUseRouter.mockReturnValue(mockRouter as any);

    mockUseFriends.mockReturnValue({
      data: [],
      count: 5,
      isLoading: false,
      error: null,
      isLoadingDelete: false,
      errorDelete: null,
      isSuccessDelete: false,
      handleDeleteFriend: jest.fn(),
      setIsSuccessDelete: jest.fn(),
      setErrorDelete: jest.fn(),
      setIsLoadingDelete: jest.fn(),
    });

    mockUseBiography.mockReturnValue({
      handleUpdateBiography: jest.fn(),
      setIsUpdated: jest.fn(),
      isLoading: false,
      isUpdated: false,
      isError: false,
      setIsError: jest.fn(),
    });

    mockUseActivities.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      formattedActivities: [],
    });

    mockGetBooksWithPagination.mockResolvedValue({
      books: mockBooks,
      hasMore: false,
    });

    mockSearchParams.get.mockImplementation((key: string) => {
      const params: Record<string, string> = {};
      return params[key] || null;
    });
  });

  it('renders profile skeleton when user is loading', () => {
    render(
      <Provider store={mockStoreNoUser}>
        <ProfilePage />
      </Provider>
    );

    expect(screen.getByTestId('profile-header-skeleton')).toBeInTheDocument();
  });

  it('renders profile header skeleton when user data is loading', () => {
    render(
      <Provider store={mockStoreNoUser}>
        <ProfilePage />
      </Provider>
    );

    expect(screen.getByTestId('profile-header-skeleton')).toBeInTheDocument();
  });

  it('renders complete profile when user is loaded', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-header')).toBeInTheDocument();
      expect(screen.getByText('Profile: testuser')).toBeInTheDocument();
    });
  });

  it('renders tabs correctly', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Hall of Fame')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('books-filter')).toBeInTheDocument();
    });

    // Click on Hall of Fame tab
    fireEvent.click(screen.getByText('Hall of Fame'));
    await waitFor(() => {
      expect(screen.getByTestId('hall-of-fame-component')).toBeInTheDocument();
    });

    // Click on Stats tab
    fireEvent.click(screen.getByText('Stats'));
    await waitFor(() => {
      expect(screen.getByTestId('stats-component')).toBeInTheDocument();
    });

    // Click on Activity tab
    fireEvent.click(screen.getByText('Activity'));
    await waitFor(() => {
      expect(screen.getByTestId('activity-tab-component')).toBeInTheDocument();
    });
  });

  it('filters books by status', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    });

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: EStatus.READ } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('searches books correctly', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('changes order by correctly', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('order-by-select')).toBeInTheDocument();
    });

    const orderBySelect = screen.getByTestId('order-by-select');
    fireEvent.change(orderBySelect, { target: { value: 'author' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('handles biography editing', async () => {
    const mockHandleUpdateBiography = jest
      .fn()
      .mockResolvedValue('Updated biography');

    mockUseBiography.mockReturnValue({
      handleUpdateBiography: mockHandleUpdateBiography,
      setIsUpdated: jest.fn(),
      isLoading: false,
      isUpdated: false,
      isError: false,
      setIsError: jest.fn(),
    });

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-profile-btn')).toBeInTheDocument();
    });

    // Click edit profile
    fireEvent.click(screen.getByTestId('edit-profile-btn'));

    // Change biography
    const biographyInput = screen.getByTestId('biography-input');
    fireEvent.change(biographyInput, { target: { value: 'New biography' } });

    // Save biography
    fireEvent.click(screen.getByTestId('save-biography-btn'));

    await waitFor(() => {
      expect(mockHandleUpdateBiography).toHaveBeenCalled();
    });
  });

  it('displays loading skeleton when user is null', () => {
    render(
      <Provider store={mockStoreNoUser}>
        <ProfilePage />
      </Provider>
    );

    expect(screen.getByTestId('profile-header-skeleton')).toBeInTheDocument();
  });

  it('loads initial URL parameters', () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        status: EStatus.READ,
        search: 'test search',
        orderBy: 'author',
      };
      return params[key] || null;
    });

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    expect(mockSearchParams.get).toHaveBeenCalledWith('status');
    expect(mockSearchParams.get).toHaveBeenCalledWith('search');
    expect(mockSearchParams.get).toHaveBeenCalledWith('orderBy');
  });

  it('handles infinite scroll loading', async () => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;

    mockGetBooksWithPagination.mockResolvedValueOnce({
      books: mockBooks.slice(0, 1),
      hasMore: true,
    });

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(mockGetBooksWithPagination).toHaveBeenCalledWith(
        mockUser.id,
        0,
        5
      );
    });
  });

  it('displays loading indicator when loading more books', async () => {
    mockGetBooksWithPagination.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ books: mockBooks, hasMore: false }), 100)
        )
    );

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  it('displays success alert when biography is updated', async () => {
    mockUseBiography.mockReturnValue({
      handleUpdateBiography: jest.fn(),
      setIsUpdated: jest.fn(),
      isLoading: false,
      isUpdated: true,
      isError: false,
      setIsError: jest.fn(),
    });

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(
        screen.getByText('Biography updated successfully')
      ).toBeInTheDocument();
    });
  });

  it('displays error alert when biography update fails', async () => {
    mockUseBiography.mockReturnValue({
      handleUpdateBiography: jest.fn(),
      setIsUpdated: jest.fn(),
      isLoading: false,
      isUpdated: false,
      isError: true,
      setIsError: jest.fn(),
    });

    render(
      <Provider store={mockStore}>
        <ProfilePage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Error updating biography')).toBeInTheDocument();
    });
  });
});
