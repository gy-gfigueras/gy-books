import { useCallback, useState } from 'react';

interface LikeResponse {
  id: string;
  message: string;
  profileId: string;
  likes: string[];
}

interface UseActivityLikeResult {
  /** Toggle like on an activity. Returns updated likes array or null on error. */
  toggleLike: (
    activityId: string,
    activityAuthorProfileId: string
  ) => Promise<string[] | null>;
  /** Whether a like request is currently in flight */
  isLoading: boolean;
  /** Last error message, if any */
  error: string | null;
}

/**
 * Hook to toggle likes on friend activities.
 *
 * Calls PATCH /api/auth/books/activity/like
 * - If the user hasn't liked the activity yet → adds like
 * - If the user already liked it → removes like
 *
 * Returns the updated likes array from the server for reconciliation.
 *
 * @param activityId - The ID of the activity to like/unlike
 * @param activityAuthorProfileId - The profileId of the activity's AUTHOR (not the current user)
 */
export function useActivityLike(): UseActivityLikeResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = useCallback(
    async (
      activityId: string,
      activityAuthorProfileId: string
    ): Promise<string[] | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/books/activity/like', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activityId,
            profileId: activityAuthorProfileId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            (errorData as { error?: string }).error ||
            `Failed to toggle like: ${response.status}`;
          setError(errorMessage);
          return null;
        }

        const data = (await response.json()) as LikeResponse;
        return data.likes ?? [];
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error toggling like';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { toggleLike, isLoading, error };
}
