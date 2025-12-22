import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const MotionBox = motion(Box);

interface MobileHeaderProps {
  onLogoClick: () => void;
}

/**
 * Header para versión móvil
 * Solo muestra el logo que al hacer click abre el drawer
 */
export const MobileHeader = ({ onLogoClick }: MobileHeaderProps) => {
  return (
    <MotionBox
      component="img"
      onClick={onLogoClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        width: '48px',
        height: '48px',
        cursor: 'pointer',
        filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))',
        transition: 'filter 0.3s ease',
      }}
      src="/gy-logo.png"
      alt="logo"
    />
  );
};
