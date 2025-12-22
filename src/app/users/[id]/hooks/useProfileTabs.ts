import { useState } from 'react';

/**
 * Hook para manejar la navegación entre tabs del perfil
 */
export const useProfileTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: unknown, newTab: number) => {
    setActiveTab(newTab);
  };

  return {
    activeTab,
    handleTabChange,
  };
};
