import React from 'react';
import { render, screen } from '@testing-library/react';
import { BooksList } from './BooksList';
import Book from '@/domain/book.model';

jest.mock('@/app/components/atoms/BookCardCompact', () => ({
  BookCardCompact: ({ book }: { book: Book }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));

const mockBooks: Book[] = [
  { id: '1', title: 'Book One' } as Book,
  { id: '2', title: 'Book Two' } as Book,
];

describe('BooksList', () => {
  it('renders book cards for each book', () => {
    render(<BooksList books={mockBooks} hasMore={true} />);
    expect(screen.getAllByTestId('book-card')).toHaveLength(mockBooks.length);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });

  it('shows "All books loaded" when hasMore is false and books exist', () => {
    render(<BooksList books={mockBooks} hasMore={false} />);
    expect(screen.getByText('All books loaded')).toBeInTheDocument();
  });

  it('does not show "All books loaded" when hasMore is true', () => {
    render(<BooksList books={mockBooks} hasMore={true} />);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });

  it('does not show "All books loaded" when books list is empty', () => {
    render(<BooksList books={[]} hasMore={false} />);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });
});
