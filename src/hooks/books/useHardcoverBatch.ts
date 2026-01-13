import useSWR from 'swr';
import { useMemo } from 'react';
import type HardcoverBook from '../../domain/HardcoverBook';

type Result = {
  data: HardcoverBook[] | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * useHardcoverBatch
 *
 * Obtiene información detallada de múltiples libros de Hardcover en una sola petición batch.
 *
 * ## Optimizaciones de SWR:
 * - **dedupingInterval: 10000ms** - Evita duplicados durante 10 segundos (datos menos volátiles)
 * - **keepPreviousData: true** - Mantiene datos previos mientras revalida (UX fluida)
 * - **revalidateOnFocus: false** - No revalida al hacer foco (datos externos estables)
 * - **revalidateOnReconnect: false** - No revalida al reconectar (datos externos no cambian)
 * - **shouldRetryOnError: false** - No reintenta automáticamente (evita spam al backend)
 *
 * ## Key estable:
 * - Ordena los IDs alfabéticamente para generar una key consistente
 * - Esto permite que ["id1", "id2"] y ["id2", "id1"] compartan cache
 * - Mejora el hit rate del cache de SWR
 *
 * @param ids - Array de IDs de libros para obtener de Hardcover
 * @returns Objeto con data (array de HardcoverBook), isLoading y error
 */
export function useHardcoverBatch(ids: string[] | undefined | null): Result {
  // Crear una key estable ordenando los IDs
  // Esto asegura que el orden no afecte el cache de SWR
  const swrKey = useMemo(() => {
    if (!ids || ids.length === 0) return null;
    const sortedIds = [...ids].sort();
    return `hardcover-batch|${sortedIds.join(',')}`;
  }, [ids]);

  // Fetcher que hace el POST a /api/hardcover
  const fetcher = async (key: string) => {
    // Extraer los IDs ordenados del key
    const [, idsStr] = key.split('|');
    const idsArray = idsStr.split(',');

    const res = await fetch('/api/hardcover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: idsArray }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as HardcoverBook[];
    return json || [];
  };

  const { data, error, isLoading } = useSWR<HardcoverBook[], Error>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false, // No revalidar al hacer foco (datos externos)
      revalidateOnReconnect: false, // No revalidar al reconectar (datos estables)
      dedupingInterval: 10000, // Evitar duplicados durante 10 segundos
      keepPreviousData: true, // Mantener datos previos mientras carga
      shouldRetryOnError: false, // No reintentar automáticamente
    }
  );

  // Retornar null cuando no hay data (mantiene compatibilidad con interfaz original)
  return {
    data: data ?? null,
    isLoading,
    error: error ?? null,
  };
}

export default useHardcoverBatch;
