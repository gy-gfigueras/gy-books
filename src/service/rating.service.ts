import { Rating } from '@/domain/rating.model';

export default async function getBookRating(
  id: string
): Promise<Rating | null> {
  try {
    const url = id;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      console.log('No hay calificaciones para este libro');
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getBookRating service - Error response:', errorText);
      throw new Error(
        `No se pudo cargar la calificación: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    return data.rating as Rating;
  } catch (err) {
    console.error('getBookRating service - Error:', err);
    throw err;
  }
}
