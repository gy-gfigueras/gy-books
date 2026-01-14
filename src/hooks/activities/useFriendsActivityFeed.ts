/* eslint-disable @typescript-eslint/no-unused-vars */
import { Activity, feedActivity } from '@/domain/activity.model';
import { useMemo } from 'react';
import useSWR from 'swr';
import {
  cleanActivityMessage,
  extractBookId,
  formatRelativeDate,
  sortActivitiesByDate,
} from './utils/activityHelpers';
import { useUserProfiles } from './useUserProfiles';

/**
 * Interface para actividades de amigos con información del usuario
 */
export interface FriendActivity extends Activity {
  userId: string;
  username: string | null;
  userPicture: string | null;
}

/**
 * Interface para el resultado del hook
 */
export interface UseFriendsActivityFeedResult {
  activities: FriendActivity[];
  bookIds: string[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetcher para obtener actividades
 */
async function fetchFriendsActivityFeed(): Promise<feedActivity[]> {
  const response = await fetch('/api/auth/books/activity', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 401) {
      return [];
    }
    throw new Error(`Failed to fetch friends activity: ${response.status}`);
  }

  const data = await response.json();
  return data as feedActivity[];
}

/**
 * Hook para obtener el feed de actividades de amigos
 *
 * Optimizaciones:
 * - Muestra actividades inmediatamente (sin esperar perfiles)
 * - Perfiles se cargan en paralelo con caché SWR
 * - Caché de perfiles persiste entre renders
 */
export function useFriendsActivityFeed(): UseFriendsActivityFeedResult {
  // 1. Obtener actividades
  const {
    data: activities,
    isLoading: loadingActivities,
    error,
  } = useSWR('/api/auth/books/activity', fetchFriendsActivityFeed, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 30000,
    keepPreviousData: true,
  });

  // 2. Extraer profileIds únicos (usando profileId del modelo FeedActivity)
  const uniqueProfileIds = useMemo(() => {
    if (!activities) {
      return [];
    }
    const ids = Array.from(
      new Set(
        activities
          .map((activity) => activity.profileId)
          .filter((id): id is string => Boolean(id))
      )
    );
    return ids;
  }, [activities]);

  // 3. Obtener perfiles con hook optimizado (con caché SWR)
  const { profiles, isLoading: loadingProfiles } =
    useUserProfiles(uniqueProfileIds);

  // 4. Procesar actividades: agregar username y picture
  const processedActivities: FriendActivity[] = useMemo(() => {
    if (!activities || activities.length === 0) {
      return [];
    }

    const processed = activities
      .map((activity) => {
        // Obtener perfil usando profileId (puede estar cargando aún)
        const userProfile = profiles[activity.profileId];

        // Extraer datos del perfil o null para mostrar skeleton
        const username = userProfile?.username || null;
        const userPicture = userProfile?.picture || null;

        // Procesar datos de la actividad
        const bookId = extractBookId(activity.message);
        const cleanedMessage = cleanActivityMessage(activity.message);
        const formattedDate = formatRelativeDate(activity.date);

        return {
          userId: activity.userId,
          username,
          userPicture,
          bookId: bookId || activity.bookId,
          message: cleanedMessage,
          date: new Date(activity.date),
          formattedDate,
        };
      })
      .sort(sortActivitiesByDate);

    return processed;
  }, [activities, profiles]);

  // 5. Extraer bookIds únicos
  const bookIds = useMemo(() => {
    const ids = processedActivities
      .map((activity) => activity.bookId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [processedActivities]);

  return {
    activities: processedActivities,
    bookIds,
    isLoading: loadingActivities,
    error: error || null,
  };
}
