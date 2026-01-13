import { Profile } from '@gycoding/nebula';
import getAccountsUser from '@/app/actions/accounts/user/fetchAccountsUser';
import useSWR from 'swr';

/**
 * Hook optimizado para obtener múltiples perfiles de usuario con caché
 * Usa SWR para cachear cada perfil individualmente
 */
export function useUserProfiles(profileIds: string[]) {
  // Crear un fetcher que obtenga todos los perfiles en paralelo
  const fetcher = async (ids: string[]) => {
    if (!ids || ids.length === 0) return {};

    const profilePromises = ids.map((id) =>
      getAccountsUser(id).catch(() => null)
    );

    const profiles = await Promise.all(profilePromises);

    // Crear mapa profileId -> Profile
    const profilesMap: Record<string, Profile> = {};
    profiles.forEach((profile, index) => {
      if (profile) {
        profilesMap[ids[index]] = profile;
      }
    });

    return profilesMap;
  };

  // Usar SWR con una key única basada en los IDs
  // Esto permite caché automático
  const key =
    profileIds.length > 0 ? `profiles-${profileIds.sort().join(',')}` : null;

  const { data, isLoading, error } = useSWR(key, () => fetcher(profileIds), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minuto - caché más largo para perfiles
    keepPreviousData: true,
    // Caché de 5 minutos para perfiles
    revalidateIfStale: false,
  });

  return {
    profiles: data || {},
    isLoading,
    error,
  };
}
