/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ActivityTab from './activityTab';
import { UUID } from 'crypto';

// Mock hooks
jest.mock('@/hooks/useActivities');

// Mock components
jest.mock('../atoms/BookCover/BookImage', () => ({
  BookImage: ({ bookId }: { bookId: string }) => (
    <div data-testid="book-image" data-book-id={bookId}>
      Book Image {bookId}
    </div>
  ),
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, component, href, ...props }: any) => {
    if (component === 'a') {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <div {...props}>{children}</div>;
  },
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Skeleton: ({ variant, width, height, ...props }: any) => (
    <div
      data-testid="skeleton"
      data-variant={variant}
      data-width={width}
      data-height={height}
      {...props}
    />
  ),
}));

import { useActivities } from '@/hooks/useActivities';

const mockUserId = '550e8400-e29b-41d4-a716-446655440000' as UUID;

const mockActivities = [
  {
    id: 'activity-1',
    bookId: 'book-1',
    message: 'Started reading this amazing book',
    date: new Date('2024-01-15'),
    formattedDate: '15/01/2024',
  },
  {
    id: 'activity-2',
    bookId: 'book-2',
    message: 'Finished reading this incredible story',
    date: new Date('2024-01-10'),
    formattedDate: '10/01/2024',
  },
];

describe('ActivityTab', () => {
  const mockUseActivities = useActivities as jest.MockedFunction<
    typeof useActivities
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when activities are loading', () => {
    mockUseActivities.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(10); // 2 skeletons per item * 5 items
  });

  it('renders activities when loaded successfully', async () => {
    mockUseActivities.mockReturnValue({
      data: mockActivities,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      expect(
        screen.getByText('Started reading this amazing book')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Finished reading this incredible story')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('10/01/2024')).toBeInTheDocument();
  });

  it('renders book images for each activity', async () => {
    mockUseActivities.mockReturnValue({
      data: mockActivities,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      const bookImages = screen.getAllByTestId('book-image');
      expect(bookImages).toHaveLength(2);
      expect(bookImages[0]).toHaveAttribute('data-book-id', 'book-1');
    });
  });

  it('creates clickable links for each activity', async () => {
    mockUseActivities.mockReturnValue({
      data: mockActivities,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/books/book-1');
      expect(links[1]).toHaveAttribute('href', '/books/book-2');
    });
  });

  it('renders empty state when no activities are available', () => {
    mockUseActivities.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    expect(
      screen.getByText('No hay actividades disponibles.')
    ).toBeInTheDocument();
    expect(screen.getByText('💤')).toBeInTheDocument();
  });

  it('handles activities without formatted date', async () => {
    const activitiesWithoutDate = [
      {
        id: 'activity-3',
        bookId: 'book-3',
        message: 'Activity without formatted date',
        date: new Date('2024-01-01'),
      },
    ];

    mockUseActivities.mockReturnValue({
      data: activitiesWithoutDate,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      expect(
        screen.getByText('Activity without formatted date')
      ).toBeInTheDocument();
      // Should not render any formatted date
      expect(screen.queryByText(/\/\d{2}\/\d{4}/)).not.toBeInTheDocument();
    });
  });

  it('calls useActivities with correct user id', () => {
    mockUseActivities.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    expect(mockUseActivities).toHaveBeenCalledWith(mockUserId);
  });

  it('renders correct number of skeleton items when loading', () => {
    mockUseActivities.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    // Should render 10 skeleton items (2 per skeleton activity item * 5 items)
    const skeletonItems = screen.getAllByTestId('skeleton');
    expect(skeletonItems.length).toBe(10);
  });

  it('handles null or undefined activities gracefully', () => {
    mockUseActivities.mockReturnValue({
      data: null as any,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    expect(
      screen.getByText('No hay actividades disponibles.')
    ).toBeInTheDocument();
  });

  it('renders activity items with proper styling and accessibility', async () => {
    mockUseActivities.mockReturnValue({
      data: mockActivities,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('tabIndex', '0');
        expect(link).toHaveAttribute(
          'aria-label',
          expect.stringContaining('Go to book')
        );
      });
    });
  });

  it('generates correct unique keys for activity items', async () => {
    const activitiesWithSameBook = [
      {
        bookId: 'book-1',
        message: 'First activity',
        date: new Date('2024-01-15'),
        formattedDate: '15/01/2024',
      },
      {
        bookId: 'book-1', // Same book ID
        message: 'Second activity',
        date: new Date('2024-01-16'),
        formattedDate: '16/01/2024',
      },
    ];

    mockUseActivities.mockReturnValue({
      data: activitiesWithSameBook,
      isLoading: false,
      error: null,
    });

    render(<ActivityTab id={mockUserId} />);

    await waitFor(() => {
      expect(screen.getByText('First activity')).toBeInTheDocument();
      expect(screen.getByText('Second activity')).toBeInTheDocument();
    });
  });
});
