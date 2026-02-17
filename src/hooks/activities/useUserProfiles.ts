import { Profile } from '@gycoding/nebula';
import useSWR from 'swr';

export interface UseUserProfilesResult {
  profiles: Record<string, Profile | null>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetch batch de perfiles desde el endpoint centralizado.
 * UNA sola petición HTTP en lugar de N peticiones individuales.
 */
async function fetchProfilesBatch(
  profileIds: string[]
): Promise<Record<string, Profile | null>> {
  if (profileIds.length === 0) return {};

  const response = await fetch('/api/public/books/profiles/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: profileIds }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profiles batch: ${response.status}`);
  }

  return response.json();
}

/**
 * Hook optimizado para obtener múltiples perfiles de usuario con UNA sola petición.
 *
 * Mejoras respecto a la versión anterior:
 * - 1 petición HTTP en lugar de N (eliminación del problema N+1)
 * - Caché SWR con deduplicación agresiva
 * - Keep previous data para evitar flashes de loading
 *
 * @param profileIds - Array de IDs de usuario
 * @returns Mapa de userId -> Profile y estado de carga
 */
export function useUserProfiles(profileIds: string[]): UseUserProfilesResult {
  const sortedKey =
    profileIds.length > 0
      ? `profiles-batch:${[...profileIds].sort().join(',')}`
      : null;

  const { data, isLoading, error } = useSWR(
    sortedKey,
    () => fetchProfilesBatch(profileIds),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      dedupingInterval: 120000,
      keepPreviousData: true,
      errorRetryCount: 2,
      errorRetryInterval: 2000,
    }
  );

  return {
    profiles: data ?? {},
    isLoading,
    error: error ?? null,
  };
}
