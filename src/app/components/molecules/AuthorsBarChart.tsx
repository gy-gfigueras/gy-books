import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';

export default function AuthorsBarChart({
  authors,
}: {
  authors: Record<string, number>;
}) {
  // Guard clause: si no hay autores, mostrar empty state
  if (!authors || Object.keys(authors).length === 0) {
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
          No author data available yet
        </Typography>
      </Box>
    );
  }

  // Convertir en array de pares y ordenarlo por número
  const sortedEntries = Object.entries(authors).sort((a, b) => b[1] - a[1]);
  // Extraer nombres y conteos ya ordenados
  const authorNames = sortedEntries.map(([name]) => name);
  const authorCounts = sortedEntries.map(([, count]) => count);

  return (
    <BarChart
      sx={{
        '& .MuiBarChart-root': {
          backgroundColor: 'transparent',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-tick': {
          stroke: 'rgba(140, 84, 255, 0.6)',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-line': {
          stroke: 'rgba(140, 84, 255, 0.8)',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
          fill: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '500',
          textShadow: '0 0 10px rgba(140, 84, 255, 0.4)',
        },
        '& .MuiChartsLegend-root': {
          display: 'none',
        },
        '& .MuiChartsBar-root': {
          filter: 'drop-shadow(0 0 8px rgba(140, 84, 255, 0.6))',
        },
        width: ['300px', '500px'],
        height: ['250px', '300px'],
        backgroundColor: 'transparent',
        borderRadius: '16px',
      }}
      xAxis={[
        {
          data: authorNames,
          labelStyle: {
            fill: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 0 8px rgba(140, 84, 255, 0.5)',
          },
        },
      ]}
      series={[
        {
          data: authorCounts,
          color: '#8C54FF',
        },
      ]}
      colors={['#8C54FF', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9']}
      height={300}
    />
  );
}
