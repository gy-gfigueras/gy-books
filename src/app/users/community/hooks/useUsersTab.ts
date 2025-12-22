import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useUsersTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const [tab, setTab] = useState(tabParam ? parseInt(tabParam) : 0);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 0) {
      params.delete('tab');
    } else {
      params.set('tab', tab.toString());
    }
    router.push(`/users/community?${params.toString()}`, { scroll: false });
  }, [tab, router, searchParams]);

  return {
    tab,
    setTab,
  };
}
