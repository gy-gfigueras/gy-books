import { Box, Container, Skeleton, Paper } from '@mui/material';
import React from 'react';

export default function ProfileSkeleton() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 6,
        mb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          maxWidth: 1200,
          mx: 'auto',
          p: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: { xs: 2, md: 6 },
            minHeight: 20,
          }}
        >
          <Skeleton
            variant="circular"
            width={160}
            height={160}
            sx={{ ml: 2, mb: { xs: 2, md: 0 } }}
          />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Skeleton variant="text" width={220} height={48} />
            <Skeleton variant="text" width={180} height={28} />
            <Box sx={{ width: 400, maxWidth: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  border: '2px solid #FFFFFF30',
                  borderRadius: '12px',
                  background: 'transparent',
                  p: 1.5,
                  mb: 1,
                }}
              >
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="90%" height={32} />
              </Paper>
            </Box>
            <Skeleton variant="text" width={100} height={24} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 1,
              alignItems: { xs: 'center', md: 'flex-end' },
              ml: 'auto',
              mt: { xs: 2, md: 0 },
            }}
          >
            <Skeleton
              variant="rectangular"
              width={140}
              height={40}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width={140}
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              minWidth: { xs: '100%', md: 220 },
              maxWidth: { xs: '100%', md: 260 },
              p: 3,
              borderRadius: '18px',
              background: 'rgba(35, 35, 35, 0.85)',
              border: '1px solid #FFFFFF30',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={36}
                sx={{ borderRadius: 2, mb: 1 }}
              />
            ))}
          </Paper>
          <Box
            sx={{
              flex: 1,
              display: { xs: 'grid', sm: 'grid', md: 'flex' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: 'none' },
              flexWrap: { xs: 'unset', md: 'wrap' },
              gap: 2,
              overflowY: 'auto',
              maxHeight: 560,
              minHeight: 340,
              alignItems: 'center',
              justifyContent: 'center',
              py: 1,
              background: 'transparent',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                sx={{
                  borderRadius: 3,
                  width: { xs: '100%', md: 140 },
                  height: 220,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
