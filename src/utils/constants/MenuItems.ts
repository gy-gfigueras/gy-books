'use client';

import React from 'react';
import { MenuIcons } from './MenuIcons';
import { MenuItem } from '@/domain/menu.model';

interface User {
  email?: string;
  name?: string;
  picture?: string;
}

export const getMenuItems = (user: User | null): MenuItem[] => {
  if (user) {
    return [
      {
        text: 'Perfil',
        icon: React.createElement(MenuIcons.Profile),
        route: '/profile',
      },
      {
        text: 'Inicio',
        icon: React.createElement(MenuIcons.Home),
        route: '/',
      },
      {
        text: 'Cerrar Sesión',
        color: 'red',
        icon: React.createElement(MenuIcons.Logout),
        route: '/api/auth/logout',
      },
    ];
  }

  return [
    {
      text: 'Inicio',
      icon: React.createElement(MenuIcons.Home),
      route: '/',
    },
    {
      text: 'Iniciar Sesión',
      icon: React.createElement(MenuIcons.Login),
      route: '/api/auth/login',
    },
  ];
};
