/* eslint-disable @typescript-eslint/no-unused-vars */
import getAccountsUser from '@/app/actions/accounts/user/fetchAccountsUser';
import { Profile } from '@gycoding/nebula';
import useSWR from 'swr';

interface UseUserProfilesResult {
  profiles: Record<string, Profile>;
  isLoading: boolean;
}

/**
 * Fetcher que obtiene múltiples perfiles en paralelo
 * y retorna un mapa de userId -> Profile
 */
async function fetchMultipleProfiles(
  profileIds: string[]
): Promise<Record<string, Profile>> {
  if (!profileIds || profileIds.length === 0) {
    return {};
  }

  try {
    // Hacer todas las peticiones en paralelo
    const profilePromises = profileIds.map(async (userId) => {
      try {
        const profile = await getAccountsUser(userId);
        return { userId, profile: profile || null };
      } catch (error) {
        return { userId, profile: null };
      }
    });

    const results = await Promise.all(profilePromises);

    // Crear mapa de userId -> Profile
    const profilesMap: Record<string, Profile> = {};
    results.forEach(({ userId, profile }) => {
      if (profile) {
        profilesMap[userId] = profile;
      }
    });

    return profilesMap;
  } catch (error) {
    return {};
  }
}

/**
 * Hook optimizado para obtener múltiples perfiles de usuario con caché SWR
 *
 * @param profileIds - Array de IDs de usuario
 * @returns Mapa de userId -> Profile y estado de carga
 */
export function useUserProfiles(profileIds: string[]): UseUserProfilesResult {
  // Crear key única basada en los IDs (ordenados para evitar re-fetches)
  const sortedIds = [...profileIds].sort().join(',');
  const cacheKey = profileIds.length > 0 ? `profiles:${sortedIds}` : null;

  const { data, isLoading, error } = useSWR(
    cacheKey,
    () => fetchMultipleProfiles(profileIds),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      dedupingInterval: 60000, // 1 minuto
      keepPreviousData: true,
      // Reintentar 3 veces con delay exponencial
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    profiles: data || {},
    isLoading,
  };
}
