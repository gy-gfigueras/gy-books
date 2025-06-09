import { ReactNode } from 'react';

export interface MenuItem {
  text: string;
  icon: ReactNode;
  route: string;
  color?: string;
}
