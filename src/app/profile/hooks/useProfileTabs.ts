import { useState } from 'react';

export function useProfileTabs() {
  const [tab, setTab] = useState(0);

  return {
    tab,
    setTab,
  };
}
