/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookRatingMenu from './BookRatingMenu';
import { EStatus } from '@/utils/constants/EStatus';
import { BookRatingState, BookRatingHandlers } from './types';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Menu: ({ children, open, ...props }: any) =>
    open ? (
      <div data-testid="menu" {...props}>
        {children}
      </div>
    ) : null,
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Divider: (props: any) => <hr {...props} />,
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="apply-button"
      {...props}
    >
      {children}
    </button>
  ),
  IconButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="delete-button" {...props}>
      {children}
    </button>
  ),
}));

// Mock child components
jest.mock('../RatingStars/RatingStars', () => ({
  __esModule: true,
  default: ({ rating, onRatingChange, disabled, isLoading }: any) => (
    <div
      data-testid="rating-stars"
      data-rating={rating}
      data-disabled={disabled}
      data-loading={isLoading}
    >
      <button onClick={() => onRatingChange && onRatingChange(5)}>
        Set Rating
      </button>
    </div>
  ),
}));

jest.mock('./BookRatingStatusButtons', () => ({
  __esModule: true,
  default: ({ tempStatus, setTempStatus, fontFamily }: any) => (
    <div data-testid="status-buttons" data-font-family={fontFamily}>
      <button onClick={() => setTempStatus(EStatus.READING)}>
        Status: {tempStatus}
      </button>
    </div>
  ),
}));

jest.mock('./BookRatingProgressInput', () => ({
  __esModule: true,
  default: ({ tempProgress, setTempProgress, fontFamily }: any) => (
    <div data-testid="progress-input" data-font-family={fontFamily}>
      <button onClick={() => setTempProgress(100)}>
        Progress: {tempProgress}
      </button>
    </div>
  ),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Delete', () => {
  const DeleteIcon = () => <span>Delete</span>;
  DeleteIcon.displayName = 'DeleteIcon';
  return DeleteIcon;
});

describe('BookRatingMenu', () => {
  const mockHandlers: BookRatingHandlers = {
    setTempRating: jest.fn(),
    setTempStatus: jest.fn(),
    setTempStartDate: jest.fn(),
    setTempEndDate: jest.fn(),
    setTempProgress: jest.fn(),
    setIsProgressPercent: jest.fn(),
    handleApply: jest.fn(),
  };

  const mockState: BookRatingState = {
    tempRating: 4,
    tempStatus: EStatus.READING,
    tempStartDate: '2023-01-01',
    tempEndDate: '2023-01-31',
    tempProgress: 50,
    isSubmitting: false,
    isProgressPercent: true,
  };

  const defaultProps = {
    open: true,
    anchorEl: document.createElement('div'),
    onClose: jest.fn(),
    state: mockState,
    handlers: mockHandlers,
    isBookSaved: false,
    isLoading: false,
    isSubmitting: false,
    fontFamily: 'Arial',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open is true', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const props = { ...defaultProps, open: false };
    render(<BookRatingMenu {...props} />);
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('renders rating section with correct title', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
  });

  it('renders status section with correct title', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByTestId('status-buttons')).toBeInTheDocument();
  });

  it('renders progress input', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByTestId('progress-input')).toBeInTheDocument();
  });

  it('renders dates section with inputs', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByText('Dates')).toBeInTheDocument();

    const dateInputs = screen.getAllByDisplayValue('2023-01-01');
    expect(dateInputs).toHaveLength(1);

    const endDateInputs = screen.getAllByDisplayValue('2023-01-31');
    expect(endDateInputs).toHaveLength(1);
  });

  it('renders apply button', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders delete button when book is saved and handler is provided', () => {
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: jest.fn(),
    };

    render(<BookRatingMenu {...props} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render delete button when book is not saved', () => {
    render(<BookRatingMenu {...defaultProps} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('does not render delete button when no handler provided', () => {
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: undefined,
    };

    render(<BookRatingMenu {...props} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls handleDeleteBook when delete button is clicked', () => {
    const mockHandleDeleteBook = jest.fn();
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: mockHandleDeleteBook,
    };

    render(<BookRatingMenu {...props} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteBook).toHaveBeenCalledTimes(1);
  });

  it('calls handleApply when apply button is clicked', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(mockHandlers.handleApply).toHaveBeenCalledTimes(1);
  });

  it('disables apply button when isSubmitting is true', () => {
    const props = {
      ...defaultProps,
      isSubmitting: true,
    };

    render(<BookRatingMenu {...props} />);

    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('passes correct props to RatingStars', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-rating', '4');
    expect(ratingStars).toHaveAttribute('data-disabled', 'false');
    expect(ratingStars).toHaveAttribute('data-loading', 'false');
  });

  it('passes loading state to RatingStars', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };

    render(<BookRatingMenu {...props} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-loading', 'true');
    expect(ratingStars).toHaveAttribute('data-disabled', 'true');
  });

  it('handles date input changes', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const startDateInput = screen.getByDisplayValue('2023-01-01');
    fireEvent.change(startDateInput, { target: { value: '2023-02-01' } });

    expect(mockHandlers.setTempStartDate).toHaveBeenCalledWith('2023-02-01');

    const endDateInput = screen.getByDisplayValue('2023-01-31');
    fireEvent.change(endDateInput, { target: { value: '2023-02-28' } });

    expect(mockHandlers.setTempEndDate).toHaveBeenCalledWith('2023-02-28');
  });

  it('uses default fontFamily when not provided', () => {
    const propsWithoutFont = { ...defaultProps };
    delete propsWithoutFont.fontFamily;
    render(<BookRatingMenu {...propsWithoutFont} />);

    // Should render without errors
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('applies custom fontFamily to child components and typography', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Custom Font',
    };

    render(<BookRatingMenu {...props} />);

    const statusButtons = screen.getByTestId('status-buttons');
    const progressInput = screen.getByTestId('progress-input');

    expect(statusButtons).toHaveAttribute('data-font-family', 'Custom Font');
    expect(progressInput).toHaveAttribute('data-font-family', 'Custom Font');
  });

  it('handles rating change interaction', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const ratingButton = screen.getByText('Set Rating');
    fireEvent.click(ratingButton);

    expect(mockHandlers.setTempRating).toHaveBeenCalledWith(5);
  });

  it('handles status change interaction', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const statusButton = screen.getByText(/Status:/);
    fireEvent.click(statusButton);

    expect(mockHandlers.setTempStatus).toHaveBeenCalledWith(EStatus.READING);
  });

  it('handles progress change interaction', () => {
    render(<BookRatingMenu {...defaultProps} />);

    const progressButton = screen.getByText(/Progress:/);
    fireEvent.click(progressButton);

    expect(mockHandlers.setTempProgress).toHaveBeenCalledWith(100);
  });

  it('renders with different state values', () => {
    const differentState: BookRatingState = {
      tempRating: 5,
      tempStatus: EStatus.READ,
      tempStartDate: '2023-06-01',
      tempEndDate: '2023-06-30',
      tempProgress: 100,
      isSubmitting: false,
      isProgressPercent: false,
    };

    const props = {
      ...defaultProps,
      state: differentState,
    };

    render(<BookRatingMenu {...props} />);

    expect(screen.getByDisplayValue('2023-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-06-30')).toBeInTheDocument();

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-rating', '5');
  });

  it('handles submitting state correctly', () => {
    const props = {
      ...defaultProps,
      state: {
        ...mockState,
        isSubmitting: true,
      },
      isSubmitting: true,
    };

    render(<BookRatingMenu {...props} />);

    const applyButton = screen.getByTestId('apply-button');
    expect(applyButton).toBeDisabled();

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-disabled', 'true');
  });

  it('renders with null anchorEl', () => {
    const props = {
      ...defaultProps,
      anchorEl: null,
    };

    render(<BookRatingMenu {...props} />);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('handles empty date values', () => {
    const stateWithEmptyDates: BookRatingState = {
      ...mockState,
      tempStartDate: '',
      tempEndDate: '',
    };

    const props = {
      ...defaultProps,
      state: stateWithEmptyDates,
    };

    render(<BookRatingMenu {...props} />);

    const dateInputs = screen.getAllByDisplayValue('');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it('passes correct disabled and loading states', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
      isSubmitting: true,
    };

    render(<BookRatingMenu {...props} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-disabled', 'true');
    expect(ratingStars).toHaveAttribute('data-loading', 'true');
  });

  it('renders with WANT_TO_READ status', () => {
    const stateWithWantToRead: BookRatingState = {
      ...mockState,
      tempStatus: EStatus.WANT_TO_READ,
    };

    const props = {
      ...defaultProps,
      state: stateWithWantToRead,
    };

    render(<BookRatingMenu {...props} />);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('handles zero rating correctly', () => {
    const stateWithZeroRating: BookRatingState = {
      ...mockState,
      tempRating: 0,
    };

    const props = {
      ...defaultProps,
      state: stateWithZeroRating,
    };

    render(<BookRatingMenu {...props} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-rating', '0');
  });

  it('handles high progress values correctly', () => {
    const stateWithHighProgress: BookRatingState = {
      ...mockState,
      tempProgress: 500,
      isProgressPercent: false,
    };

    const props = {
      ...defaultProps,
      state: stateWithHighProgress,
    };

    render(<BookRatingMenu {...props} />);
    expect(screen.getByTestId('progress-input')).toBeInTheDocument();
  });
});
