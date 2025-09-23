import React from 'react';
import { Box, Skeleton } from '@mui/material';

const BookDetailsSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        padding: '2rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: ['0rem', '0rem', '6rem'],
        paddingX: { xs: '1rem', md: '100px' },
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
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={30}
          sx={{
            marginBottom: '1rem',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
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
            width: ['250px', '250px', '300px'],
            height: ['375px', '375px', '500px'],
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
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
            bgcolor: 'rgba(140, 84, 255, 0.2)',
          }}
        />

        <Box display={'flex'} flexDirection="column" alignItems="center" mt={2}>
          {/* Rating */}
          <Skeleton
            variant="text"
            width={100}
            height={50}
            sx={{
              bgcolor: 'rgba(140, 84, 255, 0.3)',
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
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{
                bgcolor: 'rgba(255, 215, 0, 0.2)',
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
              bgcolor: 'rgba(255, 255, 255, 0.1)',
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
            bgcolor: 'rgba(255, 255, 255, 0.05)',
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
              bgcolor: 'rgba(140, 84, 255, 0.2)',
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
            bgcolor: 'rgba(255, 255, 255, 0.1)',
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
