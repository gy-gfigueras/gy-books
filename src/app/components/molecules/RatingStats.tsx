import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { lora } from '@/utils/fonts/fonts';

interface RatingStatsProps {
  ratings: {
    distribution: Record<string, number>;
    averageRating: number;
    totalRatedBooks: number;
  };
  fontFamily: string;
}

const RatingStats: React.FC<RatingStatsProps> = ({ ratings }) => {
  // Guard clause
  if (!ratings || ratings.totalRatedBooks === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: lora.style.fontFamily,
            fontSize: 16,
          }}
        >
          No ratings available yet
        </Typography>
      </Box>
    );
  }

  // Crear array de ratings de 0.5 a 5 con incrementos de 0.5
  const ratingLevels = [];
  for (let i = 0.5; i <= 5; i += 0.5) {
    ratingLevels.push(i);
  }

  // Preparar datos para el BarChart y ordenar por rating
  const chartData = ratingLevels
    .map((level) => ({
      rating: `${level}★`,
      count: ratings.distribution[level.toString()] || 0,
      level,
    }))
    .sort((a, b) => a.level - b.level);

  const labels = chartData.map((item) => item.rating);
  const data = chartData.map((item) => item.count);

  // Colores morados de la app
  const colors = [
    '#9333ea',
    '#A855F7',
    '#9333EA',
    '#7C3AED',
    '#6D28D9',
    '#5B21B6',
    '#4C1D95',
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: 2,
      }}
    >
      {/* Average Rating Display */}
      <Box sx={{ textAlign: 'center', mb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Star sx={{ color: '#9333ea', fontSize: '24px' }} />
          <Typography
            sx={{
              color: '#9333ea',
              fontFamily: lora.style.fontFamily,
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            {ratings.averageRating.toFixed(1)}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: lora.style.fontFamily,
            fontSize: '1.1rem',
          }}
        >
          Average rating • {ratings.totalRatedBooks} books
        </Typography>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ width: '100%', height: '240px' }}>
        <BarChart
          series={[{ data, color: '#9333ea' }]}
          xAxis={[
            {
              data: labels,
              scaleType: 'band',
              labelStyle: { fill: 'white' },
            },
          ]}
          yAxis={[
            {
              labelStyle: { fill: 'white' },
            },
          ]}
          colors={colors}
          height={220}
          sx={{
            '& .MuiChartsAxis-root .MuiChartsAxis-tick': {
              stroke: 'white',
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-line': {
              stroke: 'white',
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
              fill: 'white',
            },
            '& .MuiChartsLegend-root': {
              display: 'none',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default RatingStats;
