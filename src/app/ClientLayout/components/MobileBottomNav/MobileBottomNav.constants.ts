import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export interface BottomNavItem {
  label: string;
  icon: typeof HomeRoundedIcon;
  route: string;
  /** Si true, solo se muestra cuando el usuario está logueado */
  requiresAuth?: boolean;
}

/**
 * Items de navegación para el bottom nav bar en mobile.
 * Separados en constantes para facilitar mantenimiento y testing.
 */
export const BOTTOM_NAV_ITEMS_LOGGED_IN: BottomNavItem[] = [
  { label: 'Home', icon: HomeRoundedIcon, route: '/' },
  { label: 'Library', icon: MenuBookRoundedIcon, route: '/books' },
  { label: 'Community', icon: PeopleRoundedIcon, route: '/users/community' },
  {
    label: 'Profile',
    icon: PersonRoundedIcon,
    route: '/profile',
    requiresAuth: true,
  },
];

export const BOTTOM_NAV_ITEMS_LOGGED_OUT: BottomNavItem[] = [
  { label: 'Home', icon: HomeRoundedIcon, route: '/' },
  { label: 'Library', icon: MenuBookRoundedIcon, route: '/books' },
  { label: 'Login', icon: LoginRoundedIcon, route: '/auth/login' },
];

/** Altura del bottom nav incluyendo safe area */
export const BOTTOM_NAV_HEIGHT = 72;

/** Padding extra para safe area en dispositivos con home indicator (iPhone X+) */
export const BOTTOM_NAV_SAFE_AREA_PADDING = 'env(safe-area-inset-bottom, 0px)';
