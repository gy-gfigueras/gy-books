import Book from './book.model';

export interface Library {
  books: Book[];
  stats: {
    totalBooks: number;
    totalRatings: number;
    averageRating: number;
  };
}
