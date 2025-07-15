import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface DonutChartProps {
  bookStatus?: Record<string, number>;
}

const COLORS = [
  '#00de1e', // azul
  '#0087ff', // verde
  '#d5bb00', // amarillo
];

export default function DonutChart({ bookStatus }: DonutChartProps) {
  if (!bookStatus) return null;
  const statusKeys = Object.keys(bookStatus);
  const data = statusKeys.map((status, idx) => ({
    label: status,
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
      title="Estado de los libros"
      sx={{
        '& .MuiPieChart-root': {
          backgroundColor: 'white',
        },
      }}
      series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
      {...settings}
    />
  );
}
