'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified community page with Discover tab active
    router.replace('/users/community');
  }, [router]);

  return null;
}
