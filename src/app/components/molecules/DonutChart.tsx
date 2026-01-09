import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { lora } from '@/utils/fonts/fonts';

interface DonutChartProps {
  bookStatus?: Record<string, number>;
}

const COLORS = [
  '#00de1e', // Verde brillante para "Read"
  '#FFD700', // Dorado brillante para "Reading"
  '#8C54FF', // Morado principal para "Want to read"
  '#A855F7', // Morado claro adicional
  '#9333EA', // Morado medio adicional
];

export default function DonutChart({ bookStatus }: DonutChartProps) {
  // Guard clause: si no hay datos o está vacío
  if (!bookStatus || Object.keys(bookStatus).length === 0) {
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
          No book status data available
        </Typography>
      </Box>
    );
  }

  // Función para formatear los nombres de estados
  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case 'READ':
        return 'Read';
      case 'READING':
        return 'Reading';
      case 'WANT_TO_READ':
        return 'Want to read';
      case 'READ':
        return 'Read';
      default:
        return status;
    }
  };

  // Filtrar "unknown" y crear los datos formateados
  const statusKeys = Object.keys(bookStatus).filter(
    (status) => status !== 'unknown'
  );

  // Si después de filtrar no hay datos
  if (statusKeys.length === 0) {
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
          No books with valid status
        </Typography>
      </Box>
    );
  }

  const data = statusKeys.map((status, idx) => ({
    label: formatStatusLabel(status),
    value: bookStatus[status],
    color: COLORS[idx % COLORS.length],
    legend: {
      position: { vertical: 'bottom', horizontal: 'center' },
      color: 'white',
    },
  }));

  const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: false,
  };

  return (
    <PieChart
      sx={{
        width: ['300px', '500px'],
        height: ['250px', '300px'],
        '& .MuiPieChart-root': {
          backgroundColor: 'transparent',
        },
        '& .MuiChartsLegend-root': {
          '& .MuiChartsLegend-series text': {
            fill: 'rgba(255, 255, 255, 0.9) !important',
            fontWeight: '500',
            textShadow: '0 0 8px rgba(140, 84, 255, 0.5)',
          },
        },
        '& .MuiPieChart-arc': {
          filter: 'drop-shadow(0 0 12px rgba(140, 84, 255, 0.4))',
          stroke: 'rgba(140, 84, 255, 0.3)',
          strokeWidth: 1,
        },
        '& .MuiChartsTooltip-root': {
          backgroundColor: 'rgba(140, 84, 255, 0.95)',
          border: '1px solid rgba(140, 84, 255, 0.5)',
          borderRadius: '8px',
        },
      }}
      series={[
        {
          innerRadius: 50,
          outerRadius: 100,
          data,
          arcLabel: 'value',
        },
      ]}
      {...settings}
    />
  );
}
