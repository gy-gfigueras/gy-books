export interface Stats {
  totalBooks: number;
  totalPages: number;
  wantToReadPages: number;
  authors: Record<string, number>;
  bookStatus: Record<string, number>;
  ratings: {
    distribution: Record<string, number>;
    averageRating: number;
    totalRatedBooks: number;
  };
  booksReadThisYear: number;
  booksReadLastYear: number;
  avgReadingDays: number;
  reviewedBooks: number;
  seriesTracked: number;
  longestBook: { title: string; pages: number } | null;
  readingCompletionRate: number;
  monthlyBooksRead: number[]; // 12 values (Jan–Dec) for current year
}
