export interface Stats {
  totalBooks: number;
  totalPages: number;
  wantToReadPages: number; // Páginas de libros en want to read
  authors: Record<string, number>;
  bookStatus: Record<string, number>;
  ratings: {
    distribution: Record<string, number>; // "0.5": 5, "1": 10, "1.5": 15, etc.
    averageRating: number; // Media de todas las valoraciones
    totalRatedBooks: number; // Libros que tienen rating
  };
}
