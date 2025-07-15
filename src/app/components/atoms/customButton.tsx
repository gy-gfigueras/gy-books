import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

interface CustomButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'contained' | 'outlined';
  endIcon?: React.ReactNode;
  sx?: SxProps;
  variantComponent?: 'button' | 'link';
  href?: string;
  target?: string;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
}

export const CustomButton = ({
  onClick,
  children,
  variant = 'contained',
  endIcon,
  startIcon,
  sx,
  variantComponent = 'button',
  href,
  target,
  isLoading,
}: CustomButtonProps) => {
  return (
    <Button
      loading={isLoading}
      component={variantComponent === 'link' ? 'a' : 'button'}
      href={variantComponent === 'link' ? href : undefined}
      variant={variant}
      onClick={onClick}
      target={target}
      sx={{
        background:
          variant === 'contained'
            ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
            : 'transparent',
        border: variant === 'outlined' ? '1px solid #9333ea' : 'none',
        color: '#ffffff',
        fontWeight: 600,
        px: 3,
        py: 1.5,
        borderRadius: '12px',
        boxShadow:
          variant === 'contained'
            ? '0 4px 14px rgba(147, 51, 234, 0.4)'
            : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(147, 51, 234, 0.6)',
          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
      endIcon={endIcon}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};
