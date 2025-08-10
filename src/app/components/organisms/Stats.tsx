import React from 'react';
import { UUID } from 'crypto';
import { useStats } from '@/hooks/useStats';
import AuthorsBarChart from '../molecules/AuthorsBarChart';
import { Box, Typography } from '@mui/material';
import DonutChart from '../molecules/DonutChart';
import { goudi } from '@/utils/fonts/fonts';
import StatsSkeleton from '../molecules/StatsSkeleton';

export default function StatsComponent({ id }: { id: UUID }) {
  const { data, isLoading, error } = useStats(id);
  if (isLoading) return <StatsSkeleton />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row ',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: goudi.style.fontFamily }}
          variant="h4"
        >
          Authors read
        </Typography>
        <AuthorsBarChart authors={data?.authors} />
      </Box>
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: goudi.style.fontFamily }}
          variant="h4"
        >
          Book status
        </Typography>
        <DonutChart bookStatus={data?.bookStatus} />
      </Box>
    </Box>
  );
}
