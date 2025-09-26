/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchActivities } from '@/app/actions/book/activities/fetchActivities';
import { Activity } from '@/domain/activity.model';
import { UUID } from 'crypto';
import useSWR from 'swr';

interface useActivitiesProps {
  data: any | undefined;
  isLoading: boolean;
  error: Error | null;
  formattedActivities?: Activity[];
}

export function useActivities(id?: UUID): useActivitiesProps {
  const { data, isLoading, error } = useSWR(
    `/api/public/books/activities?userId=${id}`,
    () => fetchActivities(id!)
  );

  // Filtrar, ordenar y formatear las actividades
  const formattedActivities =
    data
      ?.filter((activity: any) => activity.date) // Filtrar actividades con fecha válida
      .sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Ordenar de más reciente a más antigua
      })
      .map((activity: any) => ({
        bookId: activity.message.match(/\[(.*?)\]/)?.[1] || '', // Extraer el ID del mensaje
        message: activity.message.replace(/\[.*?\]\s*/, ''),
        date: activity.date,
        formattedDate: new Date(activity.date).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      })) || undefined;

  return {
    data: formattedActivities,
    isLoading,
    error,
  };
}
