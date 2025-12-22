import { Tab, Tabs } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';

interface ProfileTabsNavigationProps {
  activeTab: number;
  onTabChange: (_: unknown, newTab: number) => void;
}

/**
 * Navegación por tabs del perfil de usuario
 * Books, Hall of Fame, Stats, Activity
 */
export const ProfileTabsNavigation = ({
  activeTab,
  onTabChange,
}: ProfileTabsNavigationProps) => {
  return (
    <Tabs
      value={activeTab}
      onChange={onTabChange}
      textColor="primary"
      indicatorColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        borderBottom: '1px solid #FFFFFF30',
        background: 'transparent',
        '.MuiTab-root': {
          color: '#fff',
          fontWeight: 'bold',
          fontFamily: lora.style.fontFamily,
          fontSize: 20,
          textTransform: 'none',
          minWidth: 120,
        },
        '.Mui-selected': { color: '#FFFFFF' },
        '& .MuiTabs-scrollButtons': {
          color: '#fff',
        },
      }}
    >
      <Tab
        sx={{
          fontSize: { xs: 15, md: 20 },
          letterSpacing: '.05rem',
          fontFamily: lora.style.fontFamily,
        }}
        label="Books"
      />
      <Tab
        sx={{
          fontSize: { xs: 15, md: 20 },
          letterSpacing: '.05rem',
          fontFamily: lora.style.fontFamily,
        }}
        label="Hall of Fame"
      />
      <Tab
        sx={{
          fontSize: { xs: 15, md: 20 },
          letterSpacing: '.05rem',
          fontFamily: lora.style.fontFamily,
        }}
        label="Stats"
      />
      <Tab
        sx={{
          fontSize: { xs: 15, md: 20 },
          letterSpacing: '.05rem',
          fontFamily: lora.style.fontFamily,
        }}
        label="Activity"
      />
    </Tabs>
  );
};
