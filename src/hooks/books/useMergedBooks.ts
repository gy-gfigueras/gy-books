import { useMemo } from 'react';
import useProfileBooks, { ProfileUserData } from './useProfileBooks';
import useHardcoverBatch from './useHardcoverBatch';
import type HardcoverBook from '../../domain/HardcoverBook';

type Result = {
  data: HardcoverBook[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * useMergedBooks
 *
 * Hook compuesto que combina datos de profile books con información detallada de Hardcover.
 *
 * ## Flujo de datos:
 * 1. Obtiene summaries del perfil (con userData básica)
 * 2. Extrae los IDs de los libros
 * 3. Solicita información detallada a Hardcover en batch
 * 4. Mezcla userData del profile con los datos completos de Hardcover
 *
 * ## Optimizaciones:
 * - Usa useMemo para estabilizar el array de IDs (evita peticiones duplicadas)
 * - Usa useMemo para el merge final (evita recalcular si los datos no cambian)
 * - Los hooks internos (useProfileBooks y useHardcoverBatch) tienen configuraciones
 *   de SWR optimizadas para evitar revalidaciones innecesarias
 *
 * @param profileId - ID del perfil del usuario
 * @returns Objeto con data (libros mergeados), isLoading y error
 */
export default function useMergedBooks(profileId?: string): Result {
  const {
    data: summaries,
    isLoading: loadingSummaries,
    error: errSummaries,
  } = useProfileBooks(profileId);

  // Memoiza los IDs para evitar que cambien la referencia en cada render
  // Esto previene peticiones duplicadas a useHardcoverBatch
  const ids = useMemo(() => {
    if (!summaries) return [] as string[];
    return summaries.map((s) => s.id);
  }, [summaries]);

  const {
    data: hardcoverData,
    isLoading: loadingHardcover,
    error: errHardcover,
  } = useHardcoverBatch(ids);

  const error = (errSummaries || errHardcover) ?? null;
  const isLoading = loadingSummaries || loadingHardcover;

  /**
   * Merge optimizado de datos:
   * - Crea un Map para búsqueda O(1) de userData por ID
   * - Solo recalcula si hardcoverData o summaries cambian
   * - Preserva userData del profile sobre la de Hardcover (más actualizada)
   */
  const data: HardcoverBook[] = useMemo(() => {
    if (!hardcoverData || hardcoverData.length === 0) return [];
    const summaryById = new Map<string, ProfileUserData | undefined>();
    (summaries || []).forEach((s) => summaryById.set(s.id, s.userData));

    return hardcoverData.map((hb) => ({
      ...hb,
      userData: summaryById.get(hb.id) || hb.userData,
    })) as unknown as HardcoverBook[];
  }, [hardcoverData, summaries]);

  return { data, isLoading, error };
}
