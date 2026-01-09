/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import useSWR from 'swr';
import { useFriends } from '@/hooks/useFriends';
import { fetchActivities } from '@/app/actions/book/activities/fetchActivities';
import { Activity } from '@/domain/activity.model';
import { UUID } from 'crypto';

interface FriendActivity extends Activity {
  userId: UUID;
  username: string;
  userPicture: string;
}

interface UseFriendsActivityProps {
  data: FriendActivity[] | undefined;
  isLoading: boolean;
  error: Error | null;
  uniqueBookIds: string[];
}

export function useFriendsActivity(): UseFriendsActivityProps {
  const { data: friends, isLoading: friendsLoading } = useFriends();

  // Crear keys para SWR basadas en los IDs de los amigos
  const friendIds = useMemo(() => {
    return friends?.map((friend) => friend.id) || [];
  }, [friends]);

  // Usar SWR para obtener las actividades de cada amigo
  const activitiesQueries = friendIds.map((friendId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWR(
      friendId ? `/api/public/books/activities?userId=${friendId}` : null,
      () => fetchActivities(friendId)
    );
  });

  // Combinar todas las actividades y errores
  const isLoading =
    friendsLoading || activitiesQueries.some((query) => query.isLoading);
  const error = activitiesQueries.find((query) => query.error)?.error || null;

  // Formatear y combinar todas las actividades
  const allActivities: FriendActivity[] | undefined = useMemo(() => {
    if (!friends || activitiesQueries.some((query) => query.isLoading)) {
      return undefined;
    }

    const combined: FriendActivity[] = [];

    activitiesQueries.forEach((query, index) => {
      const friend = friends[index];
      const activities = query.data;

      if (activities && friend) {
        activities
          .filter((activity: any) => activity.date)
          .forEach((activity: any) => {
            combined.push({
              bookId: activity.message.match(/\[(.*?)\]/)?.[1] || '',
              message: activity.message.replace(/\[.*?\]\s*/, ''),
              date: activity.date,
              formattedDate: new Date(activity.date).toLocaleDateString(
                'es-ES',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }
              ),
              userId: friend.id,
              username: friend.username,
              userPicture: friend.picture,
            });
          });
      }
    });

    // Ordenar todas las actividades por fecha (más reciente primero)
    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [friends, activitiesQueries]);

  // Extraer IDs únicos de libros
  const uniqueBookIds = useMemo(() => {
    if (!allActivities) return [];
    const ids = allActivities
      .map((activity) => activity.bookId)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(ids));
  }, [allActivities]);

  return {
    data: allActivities,
    isLoading,
    error,
    uniqueBookIds,
  };
}
