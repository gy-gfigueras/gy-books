/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DonutChart from './DonutChart';

// Mock MUI X Charts
jest.mock('@mui/x-charts/PieChart', () => ({
  PieChart: ({ series, sx, ...props }: any) => (
    <div
      data-testid="pie-chart"
      data-series={JSON.stringify(series)}
      style={sx}
      {...props}
    >
      <div data-testid="chart-content">
        {series?.[0]?.data?.map((item: any, index: number) => (
          <div key={index} data-testid="chart-segment">
            <span data-testid="segment-label">{item.label}</span>
            <span data-testid="segment-value">{item.value}</span>
            <span
              data-testid="segment-color"
              style={{ backgroundColor: item.color }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  ),
}));

describe('DonutChart', () => {
  const mockBookStatus = {
    READ: 15,
    READING: 5,
    WANT_TO_READ: 8,
    unknown: 2, // This should be filtered out
  };

  it('renders pie chart with correct data when bookStatus is provided', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('returns null when bookStatus is not provided', () => {
    const { container } = render(<DonutChart />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when bookStatus is undefined', () => {
    const { container } = render(<DonutChart bookStatus={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('formats status labels correctly', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const labels = screen.getAllByTestId('segment-label');
    const labelTexts = labels.map((label) => label.textContent);

    expect(labelTexts).toContain('Read');
    expect(labelTexts).toContain('Reading');
    expect(labelTexts).toContain('Want to read');
    expect(labelTexts).not.toContain('unknown'); // Should be filtered out
  });

  it('displays correct values for each status', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const segments = screen.getAllByTestId('chart-segment');

    // Find segments and check their values
    const readSegment = segments.find(
      (segment) =>
        segment.querySelector('[data-testid="segment-label"]')?.textContent ===
        'Read'
    );
    expect(
      readSegment?.querySelector('[data-testid="segment-value"]')?.textContent
    ).toBe('15');

    const readingSegment = segments.find(
      (segment) =>
        segment.querySelector('[data-testid="segment-label"]')?.textContent ===
        'Reading'
    );
    expect(
      readingSegment?.querySelector('[data-testid="segment-value"]')
        ?.textContent
    ).toBe('5');

    const wantToReadSegment = segments.find(
      (segment) =>
        segment.querySelector('[data-testid="segment-label"]')?.textContent ===
        'Want to read'
    );
    expect(
      wantToReadSegment?.querySelector('[data-testid="segment-value"]')
        ?.textContent
    ).toBe('8');
  });

  it('filters out unknown status', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const labels = screen.getAllByTestId('segment-label');
    const labelTexts = labels.map((label) => label.textContent);

    expect(labelTexts).not.toContain('unknown');
    expect(labels).toHaveLength(3); // Should only have 3 segments (excluding unknown)
  });

  it('assigns colors from the COLORS array', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const colorElements = screen.getAllByTestId('segment-color');

    // Check that colors are assigned (they should have backgroundColor style)
    colorElements.forEach((colorEl) => {
      const style = colorEl.getAttribute('style');
      expect(style).toContain('background-color');
    });
  });

  it('handles empty bookStatus object', () => {
    render(<DonutChart bookStatus={{}} />);

    const segments = screen.queryAllByTestId('chart-segment');
    expect(segments).toHaveLength(0);
  });

  it('handles bookStatus with only unknown status', () => {
    render(<DonutChart bookStatus={{ unknown: 5 }} />);

    const segments = screen.queryAllByTestId('chart-segment');
    expect(segments).toHaveLength(0);
  });

  it('renders PieChart component successfully', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const pieChart = screen.getByTestId('pie-chart');

    // Verify that the PieChart component is rendered
    expect(pieChart).toBeInTheDocument();

    // Verify that it has chart content
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('passes correct series configuration to PieChart', () => {
    render(<DonutChart bookStatus={mockBookStatus} />);

    const pieChart = screen.getByTestId('pie-chart');
    const series = JSON.parse(pieChart.getAttribute('data-series') || '[]');

    expect(series).toHaveLength(1);
    expect(series[0]).toHaveProperty('innerRadius', 50);
    expect(series[0]).toHaveProperty('outerRadius', 100);
    expect(series[0]).toHaveProperty('data');
    expect(series[0]).toHaveProperty('arcLabel', 'value');
  });

  it('handles single status correctly', () => {
    const singleStatus = { READ: 10 };

    render(<DonutChart bookStatus={singleStatus} />);

    const labels = screen.getAllByTestId('segment-label');
    const values = screen.getAllByTestId('segment-value');

    expect(labels).toHaveLength(1);
    expect(labels[0]).toHaveTextContent('Read');
    expect(values[0]).toHaveTextContent('10');
  });

  it('handles status with zero values', () => {
    const statusWithZero = {
      read: 0,
      READING: 5,
      WANT_TO_READ: 0,
    };

    render(<DonutChart bookStatus={statusWithZero} />);

    const segments = screen.getAllByTestId('chart-segment');
    expect(segments).toHaveLength(3);

    // All segments should be included even with zero values
    const values = screen.getAllByTestId('segment-value');
    const valueTexts = values.map((value) => value.textContent);
    expect(valueTexts).toContain('0');
    expect(valueTexts).toContain('5');
  });

  it('formats different status variations correctly', () => {
    const mixedStatusFormats = {
      read: 5, // lowercase
      READ: 10, // uppercase
      READING: 3, // uppercase
      WANT_TO_READ: 7, // underscore format
    };

    render(<DonutChart bookStatus={mixedStatusFormats} />);

    const labels = screen.getAllByTestId('segment-label');
    const labelTexts = labels.map((label) => label.textContent);

    // Should format all correctly regardless of input format
    expect(labelTexts).toContain('Read');
    expect(labelTexts).toContain('Reading');
    expect(labelTexts).toContain('Want to read');
  });
});
