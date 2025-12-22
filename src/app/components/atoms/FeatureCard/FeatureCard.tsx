import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { lora } from '@/utils/fonts/fonts';
import type { Feature } from '@/utils/constants/homepage.constants';
import { useAnimations } from '@/hooks/useAnimations';

const MotionBox = motion(Box);

interface FeatureCardProps {
  feature: Feature;
}

/**
 * Componente para mostrar una tarjeta de característica
 * con icono, título, descripción y animaciones
 */
export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { itemFadeInUp } = useAnimations();
  const IconComponent = feature.icon;

  return (
    <MotionBox
      variants={itemFadeInUp}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      sx={{
        position: 'relative',
        height: '100%',
        p: { xs: 3, md: 3.5 },
        borderRadius: '20px',
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          border: `1px solid ${feature.color}60`,
          boxShadow: `0 12px 40px ${feature.color}30`,
          '& .feature-icon': {
            transform: 'scale(1.15) rotate(5deg)',
            background: `${feature.color}20`,
            borderColor: `${feature.color}60`,
          },
          '& .icon-svg': {
            color: feature.color,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <Box
        className="feature-icon"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '60px', md: '65px' },
          height: { xs: '60px', md: '65px' },
          borderRadius: '14px',
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          mb: 2.5,
          transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <IconComponent
          className="icon-svg"
          sx={{
            fontSize: { xs: '1.8rem', md: '2rem' },
            color: '#9333ea',
            transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontFamily: lora.style.fontFamily,
          fontWeight: '700',
          fontSize: { xs: '1.2rem', md: '1.3rem' },
          mb: 1.5,
          letterSpacing: '0.02rem',
        }}
      >
        {feature.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontFamily: lora.style.fontFamily,
          fontSize: { xs: '0.95rem', md: '1rem' },
          lineHeight: 1.7,
        }}
      >
        {feature.description}
      </Typography>
    </MotionBox>
  );
};
