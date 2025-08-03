import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function AuthorsBarChart({
  authors,
}: {
  authors: Record<string, number>;
}) {
  const authorNames = Object.keys(authors);
  const authorCounts = Object.values(authors);

  return (
    <BarChart
      title="Autores"
      sx={{
        '& .MuiBarChart-root': {
          backgroundColor: 'transparent',
        },
        width: ['300px', '500px'],
        height: ['250px', '300px'],
        backgroundColor: 'transparent',
        borderRadius: '16px',
      }}
      xAxis={[{ data: authorNames, label: 'Autores' }]}
      series={[{ data: authorCounts, label: 'Libros por autor' }]}
      colors={['#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9']}
      height={300}
    />
  );
}
