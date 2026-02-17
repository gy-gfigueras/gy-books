import { lora } from '@/utils/fonts/fonts';
import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

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
          stroke: 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-line': {
          stroke: 'rgba(255, 255, 255, 0.15)',
        },
        '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
          fill: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '500',
          textShadow: 'none',
        },
        '& .MuiChartsLegend-root': {
          display: 'none',
        },
        '& .MuiChartsBar-root': {
          filter: 'none',
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
            textShadow: 'none',
          },
        },
      ]}
      series={[
        {
          data: authorCounts,
          color: '#9333ea',
        },
      ]}
      colors={['#9333ea', '#a855f7', '#7e22ce', '#7c3aed', '#6d28d9']}
      height={300}
    />
  );
}
