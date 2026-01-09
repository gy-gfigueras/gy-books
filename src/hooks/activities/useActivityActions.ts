import { useState, useCallback } from 'react';
import { sendActivity } from '@/app/actions/activities/sendActivity';
import { Activity } from '@/domain/activity.model';

interface UseActivityActionsResult {
  createActivity: (message: string) => Promise<Activity | null>;
  isCreating: boolean;
  error: string | null;
  clearError: () => void;
}

export function useActivityActions(
  mutate?: () => void
): UseActivityActionsResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createActivity = useCallback(
    async (message: string): Promise<Activity | null> => {
      if (!message || message.trim() === '') {
        setError('Message cannot be empty');
        return null;
      }

      setIsCreating(true);
      setError(null);

      try {
        const activity = await sendActivity(message);

        // Revalidate SWR cache after creating
        if (mutate) {
          mutate();
        }

        return activity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create activity';
        setError(errorMessage);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [mutate]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createActivity,
    isCreating,
    error,
    clearError,
  };
}
