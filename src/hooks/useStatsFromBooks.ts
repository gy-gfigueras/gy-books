import type HardcoverBook from '@/domain/HardcoverBook';
import { Stats } from '@/domain/stats.model';
import { calculateStats } from '@/utils/stats/calculateStats';
import { useMemo } from 'react';

interface UseStatsFromBooksResult {
  data: Stats | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook que calcula estadísticas de libros en memoria.
 *
 * Este hook recibe un array de libros y calcula todos los KPIs necesarios
 * de forma eficiente en el cliente, sin necesidad de llamadas adicionales al backend.
 *
 * **Ventajas:**
 * - ⚡ Cálculo instantáneo (sin esperar fetch)
 * - 🔄 Se actualiza automáticamente cuando cambia el array de libros
 * - 📊 Aprovecha useMemo para evitar recálculos innecesarios
 * - 🎯 Sin overhead de red
 *
 * @param books - Array de libros del usuario (con userData incluido)
 * @param isLoading - Indica si los libros aún se están cargando
 * @returns Object con data (Stats), isLoading y error
 *
 * @example
 * ```typescript
 * const { data: books, isLoading } = useMergedBooksIncremental(userId);
 * const { data: stats } = useStatsFromBooks(books, isLoading);
 *
 * ```
 */
export function useStatsFromBooks(
  books: HardcoverBook[] | undefined,
  isLoading: boolean
): UseStatsFromBooksResult {
  const data = useMemo(() => {
    if (!books || books.length === 0) {
      // Retornar stats vacíos en lugar de undefined
      return {
        totalBooks: 0,
        totalPages: 0,
        wantToReadPages: 0,
        authors: {},
        bookStatus: {},
        ratings: {
          distribution: {},
          averageRating: 0,
          totalRatedBooks: 0,
        },
      };
    }
    const stats = calculateStats(books);
    return stats;
  }, [books]);

  return {
    data,
    isLoading,
    error: null,
  };
}
