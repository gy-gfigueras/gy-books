export interface AuthorBook {
  id: number;
  title: string;
  description: string;
  releaseYear: number | null;
  cover: { url: string };
  series: string;
}

export default interface HardcoverAuthor {
  id: number;
  name: string;
  bio: string;
  image: { url: string } | null;
  bornYear: number | null;
  bornDate: string | null;
  booksCount: number;
  books: AuthorBook[];
}
