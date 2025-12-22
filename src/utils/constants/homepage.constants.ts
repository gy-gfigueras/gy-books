import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TimelineIcon from '@mui/icons-material/Timeline';
import type { SvgIconComponent } from '@mui/icons-material';

export interface Feature {
  icon: SvgIconComponent;
  title: string;
  description: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const HERO_STATS: Stat[] = [
  { value: '10K+', label: 'Books' },
  { value: 'Real-time', label: 'Updates' },
  { value: '5+', label: 'Features' },
];

export const FEATURES: Feature[] = [
  {
    icon: LocalLibraryIcon,
    title: 'Smart Library Management',
    description:
      'Organize your books with custom filters: Want to Read, Reading, Read. Filter by ratings and track your progress effortlessly.',
    color: '#9333ea',
  },
  {
    icon: SearchIcon,
    title: 'Discover & Explore',
    description:
      'Search through thousands of books, find detailed information, and browse multiple editions to pick your perfect cover.',
    color: '#a855f7',
  },
  {
    icon: PeopleIcon,
    title: 'Social Reading Network',
    description:
      'Search for readers, add friends, and follow their reading activities. See what your friends are reading in real-time.',
    color: '#c084fc',
  },
  {
    icon: WorkspacePremiumIcon,
    title: 'Hall of Fame',
    description:
      'Curate your favorite books in a personal Hall of Fame and add your favorite quotes from each masterpiece.',
    color: '#FFD700',
  },
  {
    icon: AutoStoriesIcon,
    title: 'Multiple Editions',
    description:
      'Choose from different book editions to customize your library with the cover art you love most.',
    color: '#8b5cf6',
  },
  {
    icon: TimelineIcon,
    title: 'Activity Feed',
    description:
      "Stay connected with your reading community. View your activity and your friends' reading progress and updates.",
    color: '#7c3aed',
  },
];

export const CTA_FEATURES: string[] = [
  'Follow readers with similar tastes',
  'Share your reading activity',
];
