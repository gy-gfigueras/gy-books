'use client';

import React from 'react';
import { ReactNode } from 'react';
import { MenuIcons } from './MenuIcons';
import { useRouter } from 'next/navigation';

interface MenuItem {
  text: string;
  icon: ReactNode;
  action: () => void;
}

interface User {
  email?: string;
  name?: string;
  picture?: string;
}

export const getMenuItems = (user: User | null): MenuItem[] => {
  const router = useRouter();

  if (user) {
    return [
      {
        text: 'Perfil',
        icon: React.createElement(MenuIcons.Profile),
        action: () => router.push('/profile'),
      },
      {
        text: 'Inicio',
        icon: React.createElement(MenuIcons.Home),
        action: () => router.push('/'),
      },
      {
        text: 'Cerrar Sesión',
        icon: React.createElement(MenuIcons.Logout),
        action: () => router.push('/api/auth/logout'),
      },
    ];
  }

  return [
    {
      text: 'Inicio',
      icon: React.createElement(MenuIcons.Home),
      action: () => router.push('/'),
    },
    {
      text: 'Iniciar Sesión',
      icon: React.createElement(MenuIcons.Login),
      action: () => router.push('/api/auth/login'),
    },
  ];
};
