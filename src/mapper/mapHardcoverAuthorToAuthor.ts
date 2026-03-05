/* eslint-disable @typescript-eslint/no-explicit-any */
import HardcoverAuthor, { AuthorBook } from '@/domain/HardcoverAuthor';

function extractSeriesName(bookSeries: any): string | null {
  if (!bookSeries) return null;
  if (Array.isArray(bookSeries)) {
    if (bookSeries.length === 0) return null;
    const first = bookSeries[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object')
      return first?.series?.name ?? first?.name ?? null;
    return null;
  }
  if (typeof bookSeries === 'string') return bookSeries;
  return null;
}

export function mapRawAuthorToAuthor(raw: any): HardcoverAuthor {
  const books: AuthorBook[] = (raw.contributions ?? [])
    .map((c: any) => {
      const b = c.book;
      const seriesName = extractSeriesName(b?.book_series);
      if (!b || !b.id || !seriesName || !b.image?.url) return null;
      return {
        id: b.id,
        title: b.title ?? '',
        description: b.description ?? '',
        releaseYear: b.release_year ?? null,
        cover: { url: b.image.url },
        series: seriesName,
      } satisfies AuthorBook;
    })
    .filter(Boolean) as AuthorBook[];

  // Sort: alphabetically by series, then newest first within each series
  books.sort((a, b) => {
    const seriesCmp = a.series.localeCompare(b.series);
    if (seriesCmp !== 0) return seriesCmp;
    return (b.releaseYear ?? 0) - (a.releaseYear ?? 0);
  });

  return {
    id: raw.id,
    name: raw.name ?? 'Unknown Author',
    bio: raw.bio ?? '',
    image: raw.image?.url ? { url: raw.image.url } : null,
    bornYear: raw.born_year ?? null,
    bornDate: raw.born_date ?? null,
    booksCount: raw.books_count ?? 0,
    books,
  };
}
