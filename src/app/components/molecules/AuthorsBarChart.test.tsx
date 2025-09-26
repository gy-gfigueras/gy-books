/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthorsBarChart from './AuthorsBarChart';

// Mock MUI X Charts
jest.mock('@mui/x-charts/BarChart', () => ({
  BarChart: ({ series, xAxis, colors, height, sx }: any) => (
    <div
      data-testid="bar-chart"
      data-series={JSON.stringify(series)}
      data-x-axis={JSON.stringify(xAxis)}
      data-colors={JSON.stringify(colors)}
      data-height={height}
      style={sx}
    >
      <div data-testid="chart-content">
        {xAxis?.[0]?.data?.map((author: string, index: number) => (
          <div key={author} data-testid="author-bar">
            <span data-testid="author-name">{author}</span>
            <span data-testid="author-count">{series?.[0]?.data?.[index]}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}));

describe('AuthorsBarChart', () => {
  const mockAuthorsData = {
    'Stephen King': 5,
    'J.K. Rowling': 7,
    'George R.R. Martin': 3,
    'Agatha Christie': 8,
    'Isaac Asimov': 4,
  };

  it('renders bar chart with correct data', () => {
    render(<AuthorsBarChart authors={mockAuthorsData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('displays authors sorted by book count (descending)', () => {
    render(<AuthorsBarChart authors={mockAuthorsData} />);

    const authorNames = screen.getAllByTestId('author-name');
    const authorCounts = screen.getAllByTestId('author-count');

    // Should be sorted by count descending: Agatha Christie (8), J.K. Rowling (7), Stephen King (5), Isaac Asimov (4), George R.R. Martin (3)
    expect(authorNames[0]).toHaveTextContent('Agatha Christie');
    expect(authorCounts[0]).toHaveTextContent('8');

    expect(authorNames[1]).toHaveTextContent('J.K. Rowling');
    expect(authorCounts[1]).toHaveTextContent('7');

    expect(authorNames[2]).toHaveTextContent('Stephen King');
    expect(authorCounts[2]).toHaveTextContent('5');

    expect(authorNames[3]).toHaveTextContent('Isaac Asimov');
    expect(authorCounts[3]).toHaveTextContent('4');

    expect(authorNames[4]).toHaveTextContent('George R.R. Martin');
    expect(authorCounts[4]).toHaveTextContent('3');
  });

  it('passes correct props to BarChart component', () => {
    render(<AuthorsBarChart authors={mockAuthorsData} />);

    const barChart = screen.getByTestId('bar-chart');

    // Check that height is set correctly
    expect(barChart).toHaveAttribute('data-height', '300');

    // Check that colors are provided
    const colors = JSON.parse(barChart.getAttribute('data-colors') || '[]');
    expect(colors).toEqual([
      '#8C54FF',
      '#A855F7',
      '#9333EA',
      '#7C3AED',
      '#6D28D9',
    ]);

    // Check series data structure
    const series = JSON.parse(barChart.getAttribute('data-series') || '[]');
    expect(series).toHaveLength(1);
    expect(series[0]).toHaveProperty('color', '#8C54FF');
    expect(series[0]).toHaveProperty('data');
  });

  it('handles empty authors data', () => {
    render(<AuthorsBarChart authors={{}} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

    const authorBars = screen.queryAllByTestId('author-bar');
    expect(authorBars).toHaveLength(0);
  });

  it('handles single author', () => {
    const singleAuthor = { 'Single Author': 10 };

    render(<AuthorsBarChart authors={singleAuthor} />);

    const authorNames = screen.getAllByTestId('author-name');
    const authorCounts = screen.getAllByTestId('author-count');

    expect(authorNames).toHaveLength(1);
    expect(authorNames[0]).toHaveTextContent('Single Author');
    expect(authorCounts[0]).toHaveTextContent('10');
  });

  it('passes styling configuration to BarChart component', () => {
    render(<AuthorsBarChart authors={mockAuthorsData} />);

    const barChart = screen.getByTestId('bar-chart');

    // Verify that the BarChart component receives the correct height prop
    expect(barChart).toHaveAttribute('data-height', '300');

    // Verify that the sx prop is passed (it will be an object)
    expect(barChart).toHaveAttribute('style');
  });

  it('handles authors with same count correctly', () => {
    const authorsWithSameCount = {
      'Author A': 5,
      'Author B': 5,
      'Author C': 3,
      'Author D': 7,
    };

    render(<AuthorsBarChart authors={authorsWithSameCount} />);

    const authorNames = screen.getAllByTestId('author-name');

    // Should be sorted by count, with ties maintaining some order
    expect(authorNames[0]).toHaveTextContent('Author D'); // 7 books
    // Authors A and B both have 5 books - order may vary but should be before Author C
    const firstTwoNames = [
      authorNames[1].textContent,
      authorNames[2].textContent,
    ];
    expect(firstTwoNames).toContain('Author A');
    expect(firstTwoNames).toContain('Author B');
    expect(authorNames[3]).toHaveTextContent('Author C'); // 3 books
  });

  it('handles authors with zero count', () => {
    const authorsWithZero = {
      'Author A': 5,
      'Author B': 0,
      'Author C': 3,
    };

    render(<AuthorsBarChart authors={authorsWithZero} />);

    const authorNames = screen.getAllByTestId('author-name');
    const authorCounts = screen.getAllByTestId('author-count');

    expect(authorNames).toHaveLength(3);

    // Should be sorted: Author A (5), Author C (3), Author B (0)
    expect(authorNames[0]).toHaveTextContent('Author A');
    expect(authorCounts[0]).toHaveTextContent('5');

    expect(authorNames[1]).toHaveTextContent('Author C');
    expect(authorCounts[1]).toHaveTextContent('3');

    expect(authorNames[2]).toHaveTextContent('Author B');
    expect(authorCounts[2]).toHaveTextContent('0');
  });

  it('passes correct xAxis configuration', () => {
    render(<AuthorsBarChart authors={mockAuthorsData} />);

    const barChart = screen.getByTestId('bar-chart');
    const xAxis = JSON.parse(barChart.getAttribute('data-x-axis') || '[]');

    expect(xAxis).toHaveLength(1);
    expect(xAxis[0]).toHaveProperty('data');
    expect(xAxis[0]).toHaveProperty('labelStyle');
    expect(xAxis[0].labelStyle).toEqual({
      fill: 'rgba(255, 255, 255, 0.9)',
      textShadow: '0 0 8px rgba(140, 84, 255, 0.5)',
    });
  });
});
