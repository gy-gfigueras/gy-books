/* eslint-disable @typescript-eslint/no-explicit-any */
export function calculateStats(
  bookData: any,
  authors: Record<string, number>,
  stats: { totalPages: number; totalBooks: number }
) {
  stats.totalBooks++;
  const pages =
    bookData.data.books_by_pk?.pages ||
    bookData.data.books_by_pk?.dto_combined?.page_count ||
    0;
  stats.totalPages += pages;

  // Solo el primer autor
  const contributions =
    bookData.data.books_by_pk?.contributions ||
    bookData.data.books_by_pk?.dto_combined?.contributions ||
    [];
  if (contributions.length > 0) {
    const contrib = contributions[0];
    let authorName = '';
    if (contrib.author && contrib.author.name) {
      authorName = contrib.author.name;
    }
    if (authorName) {
      authors[authorName] = (authors[authorName] || 0) + 1;
    }
  }
}
