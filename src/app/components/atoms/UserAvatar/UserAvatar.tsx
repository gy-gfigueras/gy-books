import PersonIcon from '@mui/icons-material/Person';
import { Avatar, SxProps, Theme } from '@mui/material';
import Image from 'next/image';
import React, { memo } from 'react';

interface UserAvatarProps {
  src?: string | null;
  alt: string;
  size?: number;
  sx?: SxProps<Theme>;
  priority?: boolean;
}

/**
 * Componente optimizado para mostrar avatares de usuario
 * Usa Next.js Image para caché automático y optimización
 * Memo para evitar re-renders innecesarios
 */
const UserAvatarComponent: React.FC<UserAvatarProps> = ({
  src,
  alt,
  size = 40,
  sx,
  priority = false,
}) => {
  // Si no hay imagen, mostrar el avatar con icono por defecto
  if (!src) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: 'rgba(59, 130, 246, 0.2)',
          ...sx,
        }}
      >
        <PersonIcon sx={{ fontSize: size * 0.6 }} />
      </Avatar>
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        style={{
          objectFit: 'cover',
        }}
        priority={priority}
        quality={75}
        // Next.js cachea automáticamente las imágenes optimizadas
        unoptimized={false}
      />
    </Avatar>
  );
};

export const UserAvatar = memo(UserAvatarComponent);
