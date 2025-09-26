/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureCard } from './FeatureCard';
import SearchIcon from '@mui/icons-material/Search';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, variant, ...props }: any) => (
    <span data-variant={variant} {...props}>
      {children}
    </span>
  ),
  Chip: ({ label, ...props }: any) => (
    <span data-testid="chip" {...props}>
      {label}
    </span>
  ),
}));

describe('FeatureCard', () => {
  const mockProps = {
    title: 'Search Books',
    description:
      'Find any book in our vast collection with advanced search filters.',
    features: [
      'Title search',
      'Author filter',
      'Genre categories',
      'Rating filter',
    ],
    icon: <SearchIcon />,
  };

  it('renders the feature card with all props', () => {
    render(<FeatureCard {...mockProps} />);

    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Find any book in our vast collection with advanced search filters.'
      )
    ).toBeInTheDocument();
  });

  it('displays the icon correctly', () => {
    render(<FeatureCard {...mockProps} />);

    // The icon should be rendered as part of the component
    const iconContainer =
      screen.getByText('Search Books').previousElementSibling;
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders all feature chips', () => {
    render(<FeatureCard {...mockProps} />);

    const chips = screen.getAllByTestId('chip');
    expect(chips).toHaveLength(4);

    expect(screen.getByText('Title search')).toBeInTheDocument();
    expect(screen.getByText('Author filter')).toBeInTheDocument();
    expect(screen.getByText('Genre categories')).toBeInTheDocument();
    expect(screen.getByText('Rating filter')).toBeInTheDocument();
  });

  it('applies correct typography variants', () => {
    render(<FeatureCard {...mockProps} />);

    const title = screen.getByText('Search Books');
    expect(title).toHaveAttribute('data-variant', 'h5');
  });

  it('handles empty features array', () => {
    const propsWithNoFeatures = {
      ...mockProps,
      features: [],
    };

    render(<FeatureCard {...propsWithNoFeatures} />);

    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Find any book in our vast collection with advanced search filters.'
      )
    ).toBeInTheDocument();

    const chips = screen.queryAllByTestId('chip');
    expect(chips).toHaveLength(0);
  });

  it('handles single feature', () => {
    const propsWithSingleFeature = {
      ...mockProps,
      features: ['Advanced search'],
    };

    render(<FeatureCard {...propsWithSingleFeature} />);

    const chips = screen.getAllByTestId('chip');
    expect(chips).toHaveLength(1);
    expect(screen.getByText('Advanced search')).toBeInTheDocument();
  });

  it('renders with different icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom</div>;
    const propsWithCustomIcon = {
      ...mockProps,
      icon: customIcon,
    };

    render(<FeatureCard {...propsWithCustomIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('handles long title and description', () => {
    const propsWithLongText = {
      ...mockProps,
      title:
        'This is a very long title that might wrap to multiple lines in the component',
      description:
        'This is a very long description that explains the feature in great detail and might span multiple lines when rendered in the actual component with proper styling and responsive design considerations.',
    };

    render(<FeatureCard {...propsWithLongText} />);

    expect(
      screen.getByText(
        'This is a very long title that might wrap to multiple lines in the component'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This is a very long description that explains the feature/
      )
    ).toBeInTheDocument();
  });

  it('renders with many features', () => {
    const propsWithManyFeatures = {
      ...mockProps,
      features: [
        'Feature 1',
        'Feature 2',
        'Feature 3',
        'Feature 4',
        'Feature 5',
        'Feature 6',
        'Feature 7',
        'Feature 8',
        'Feature 9',
        'Feature 10',
      ],
    };

    render(<FeatureCard {...propsWithManyFeatures} />);

    const chips = screen.getAllByTestId('chip');
    expect(chips).toHaveLength(10);

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 10')).toBeInTheDocument();
  });

  it('handles special characters in text', () => {
    const propsWithSpecialChars = {
      title: 'Books & Authors',
      description: 'Find books with special characters: @#$%^&*()!',
      features: ['Title with "quotes"', "Author's name", 'Category: Sci-Fi'],
      icon: <SearchIcon />,
    };

    render(<FeatureCard {...propsWithSpecialChars} />);

    expect(screen.getByText('Books & Authors')).toBeInTheDocument();
    expect(
      screen.getByText('Find books with special characters: @#$%^&*()!')
    ).toBeInTheDocument();
    expect(screen.getByText('Title with "quotes"')).toBeInTheDocument();
    expect(screen.getByText("Author's name")).toBeInTheDocument();
    expect(screen.getByText('Category: Sci-Fi')).toBeInTheDocument();
  });

  it('maintains component structure', () => {
    const { container } = render(<FeatureCard {...mockProps} />);

    // Should have a main container div
    expect(container.firstChild).toBeInTheDocument();

    // Should contain title, description and features
    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(
      screen.getByText(/Find any book in our vast collection/)
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('chip').length).toBeGreaterThan(0);
  });
});
