import { Box, Container } from '@mui/material';
import { ProfileHeaderSkeleton } from '@/app/profile/components/ProfileHeader/ProfileHeaderSkeleton';
import { BooksListSkeleton } from '@/app/profile/components/BooksList/BooksListSkeleton';

/**
 * Skeleton loader para la página de perfil
 * Muestra placeholders mientras carga la información del usuario
 */
export const UserProfileSkeleton = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 6 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%' },
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <ProfileHeaderSkeleton canEdit={false} />
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <BooksListSkeleton />
        </Box>
      </Box>
    </Container>
  );
};
