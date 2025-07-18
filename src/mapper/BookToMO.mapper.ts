/* eslint-disable @typescript-eslint/no-explicit-any */
import Book, { Author, AuthorImage, Cover, Series } from '@/domain/book.model';
import { EStatus } from '@/utils/constants/EStatus';

export function mapHardcoverToBook(data: any): Book {
  const seriesEntry = data.book_series?.[0]?.series;

  const series: Series | null = seriesEntry
    ? {
        id: parseInt(seriesEntry.id),
        name: seriesEntry.name,
      }
    : null;

  const authorData = data.contributions?.[0]?.author;

  const authorImage: AuthorImage = {
    url: authorData?.image?.url ?? '',
  };

  const author: Author = {
    id: parseInt(authorData?.id),
    name: authorData?.name ?? '',
    image: authorImage,
    biography: authorData?.bio ?? '',
  };

  const cover: Cover = {
    url: data.image?.url ?? '',
  };

  const book: Book = {
    id: data.id.toString(),
    title: data.title,
    description: data.description ?? '',
    releaseDate: data.release_date ?? '',
    pageCount: 0,
    cover,
    author,
    series,
    status: EStatus.WANT_TO_READ,
  };

  return book;
}
