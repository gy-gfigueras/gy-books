import { Box, Skeleton } from '@mui/material';
import React from 'react';

const BookDetailsSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        padding: { xs: '1.5rem 1rem', md: '3rem' },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: { xs: 0, md: '4rem' },
        paddingX: { xs: '1rem', md: '100px' },
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Mobile title and author (visible only on mobile) */}
      <Box
        sx={{
          display: ['flex', 'flex', 'none'],
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Skeleton
          variant="text"
          width={250}
          height={50}
          sx={{
            marginBottom: '1rem',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={30}
          sx={{
            marginBottom: '1rem',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
          }}
        />
      </Box>

      {/* Book cover and rating section */}
      <Box
        sx={{
          width: { xs: '100%', md: '300px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: { xs: '220px', sm: '250px', md: '280px' },
            height: { xs: '330px', sm: '375px', md: '420px' },
            borderRadius: '14px',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />

        {/* Mobile series chip */}
        <Skeleton
          variant="rectangular"
          width={120}
          height={32}
          sx={{
            display: ['flex', 'flex', 'none'],
            marginTop: '1rem',
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
          }}
        />

        <Box display={'flex'} flexDirection="column" alignItems="center" mt={2}>
          {/* Rating */}
          <Skeleton
            variant="text"
            width={100}
            height={50}
            sx={{
              bgcolor: 'rgba(251, 191, 36, 0.15)',
            }}
          />

          {/* Rating and Hall of Fame buttons */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mt={2}
            flexDirection={'row'}
          >
            <Skeleton
              variant="rectangular"
              width={120}
              height={40}
              sx={{
                borderRadius: '12px',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{
                bgcolor: 'rgba(251, 191, 36, 0.1)',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Content section */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          color: 'white',
        }}
      >
        {/* Desktop title (visible only on desktop) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '0rem', md: '1rem' },
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          <Skeleton
            variant="text"
            width={400}
            height={60}
            sx={{
              display: ['none', 'none', 'block'],
              marginBottom: '1rem',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
          />
        </Box>

        {/* Desktop author (visible only on desktop) */}
        <Skeleton
          variant="text"
          width={300}
          height={35}
          sx={{
            display: ['none', 'none', 'block'],
            marginBottom: '1rem',
            marginTop: '-1rem',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
          }}
        />

        {/* Desktop series chip */}
        <Box
          sx={{
            display: ['none', 'none', 'flex'],
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          <Skeleton
            variant="rectangular"
            width={150}
            height={32}
            sx={{
              borderRadius: '16px',
              bgcolor: 'rgba(255, 255, 255, 0.04)',
            }}
          />
        </Box>

        {/* Mobile divider */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={1}
          sx={{
            marginTop: '2rem',
            display: ['flex', 'flex', 'none'],
            bgcolor: 'rgba(255, 255, 255, 0.06)',
          }}
        />

        {/* Description */}
        <Box sx={{ marginTop: '2rem', paddingX: ['1.5rem', '1.5rem', '0'] }}>
          <Skeleton
            variant="text"
            width="100%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            width="95%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            width="98%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            width="92%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            width="96%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            width="89%"
            height={25}
            sx={{
              marginBottom: '0.5rem',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetailsSkeleton;
