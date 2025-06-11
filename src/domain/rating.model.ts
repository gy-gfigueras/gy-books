export interface Rating {
  bookId: string;
  rating: number;
  startDate: string | null;
  endDate: string | null;
  userId: string;
  id?: null;
}
