export interface Stats {
  totalBooks: number;
  totalPages: number;
  authors: Record<string, number>;
  bookStatus: Record<string, number>;
}
