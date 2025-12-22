import { lora } from '@/utils/fonts/fonts';
import { Tab, Tabs } from '@mui/material';

interface ProfileTabsNavigationProps {
  tab: number;
  onTabChange: (tab: number) => void;
}

export function ProfileTabsNavigation({
  tab,
  onTabChange,
}: ProfileTabsNavigationProps) {
  return (
    <Tabs
      value={tab}
      onChange={(_, v) => onTabChange(v)}
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
      <Tab label="Books" />
      <Tab label="Hall of Fame" />
      <Tab label="Stats" />
      <Tab label="Activity" />
    </Tabs>
  );
}
