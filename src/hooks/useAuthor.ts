import fetchAuthorById from '@/app/actions/book/fetchAuthorById';
import HardcoverAuthor from '@/domain/HardcoverAuthor';
import { useEffect, useState } from 'react';

interface UseAuthorResult {
  author: HardcoverAuthor | null;
  isLoading: boolean;
  notFound: boolean;
}

export function useAuthor(id: number): UseAuthorResult {
  const [author, setAuthor] = useState<HardcoverAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setNotFound(false);
      const result = await fetchAuthorById(id);
      if (!cancelled) {
        if (!result) setNotFound(true);
        setAuthor(result);
        setIsLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { author, isLoading, notFound };
}
