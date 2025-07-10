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
        text: 'Inicio',
        icon: React.createElement(MenuIcons.Home),
        route: '/',
      },
      {
        text: 'Perfil',
        icon: React.createElement(MenuIcons.Profile),
        route: '/profile',
      },
      {
        text: 'Amigos',
        icon: React.createElement(MenuIcons.Friends),
        route: '/users/friends',
      },
      {
        text: 'Notificaciones',
        icon: React.createElement(MenuIcons.Inbox),
        route: '/users/friends/request',
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
