/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookRatingDrawer from './BookRatingDrawer';
import { EStatus } from '@/utils/constants/EStatus';
import { BookRatingState, BookRatingHandlers } from './types';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Drawer: ({ children, open, ...props }: any) =>
    open ? (
      <div data-testid="drawer" {...props}>
        {children}
      </div>
    ) : null,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  IconButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="icon-button" {...props}>
      {children}
    </button>
  ),
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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
  TextField: ({ label, value, onChange, ...props }: any) => (
    <input
      aria-label={label}
      value={value}
      onChange={onChange}
      data-testid={`textfield-${label?.toLowerCase()}`}
      {...props}
    />
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
jest.mock('@mui/icons-material/Close', () => {
  const CloseIcon = () => <span>Close</span>;
  CloseIcon.displayName = 'CloseIcon';
  return CloseIcon;
});
jest.mock('@mui/icons-material/Delete', () => {
  const DeleteIcon = () => <span>Delete</span>;
  DeleteIcon.displayName = 'DeleteIcon';
  return DeleteIcon;
});

describe('BookRatingDrawer', () => {
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
    tempRating: 3,
    tempStatus: EStatus.WANT_TO_READ,
    tempStartDate: '2023-01-01',
    tempEndDate: '2023-01-31',
    tempProgress: 25,
    isSubmitting: false,
    isProgressPercent: true,
  };

  const defaultProps = {
    open: true,
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
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const props = { ...defaultProps, open: false };
    render(<BookRatingDrawer {...props} />);
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
  });

  it('renders close button and calls onClose when clicked', () => {
    render(<BookRatingDrawer {...defaultProps} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders rating section with correct title', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
  });

  it('renders status section with correct title', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByTestId('status-buttons')).toBeInTheDocument();
  });

  it('renders progress input', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.getByTestId('progress-input')).toBeInTheDocument();
  });

  it('renders date inputs with correct values', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    const startDateInput = screen.getByLabelText('Start');
    const endDateInput = screen.getByLabelText('End');
    expect(startDateInput).toHaveValue('2023-01-01');
    expect(endDateInput).toHaveValue('2023-01-31');
  });

  it('renders apply button', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders delete button when book is saved and handler is provided', () => {
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: jest.fn(),
    };

    render(<BookRatingDrawer {...props} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render delete button when book is not saved', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('does not render delete button when no handler provided', () => {
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: undefined,
    };

    render(<BookRatingDrawer {...props} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls handleDeleteBook when delete button is clicked', () => {
    const mockHandleDeleteBook = jest.fn();
    const props = {
      ...defaultProps,
      isBookSaved: true,
      handleDeleteBook: mockHandleDeleteBook,
    };

    render(<BookRatingDrawer {...props} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteBook).toHaveBeenCalledTimes(1);
  });

  it('calls handleApply when apply button is clicked', () => {
    render(<BookRatingDrawer {...defaultProps} />);

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(mockHandlers.handleApply).toHaveBeenCalledTimes(1);
  });

  it('disables apply button when isSubmitting is true', () => {
    const props = {
      ...defaultProps,
      isSubmitting: true,
    };
    render(<BookRatingDrawer {...props} />);
    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('passes correct props to RatingStars', () => {
    render(<BookRatingDrawer {...defaultProps} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-rating', '3');
    expect(ratingStars).toHaveAttribute('data-disabled', 'false');
    expect(ratingStars).toHaveAttribute('data-loading', 'false');
  });

  it('passes loading state to RatingStars', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };

    render(<BookRatingDrawer {...props} />);

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-loading', 'true');
    expect(ratingStars).toHaveAttribute('data-disabled', 'true');
  });

  it('handles date input changes', () => {
    render(<BookRatingDrawer {...defaultProps} />);
    const startDateInput = screen.getByLabelText('Start');
    fireEvent.change(startDateInput, { target: { value: '2023-02-01' } });
    expect(mockHandlers.setTempStartDate).toHaveBeenCalledWith('2023-02-01');
    const endDateInput = screen.getByLabelText('End');
    fireEvent.change(endDateInput, { target: { value: '2023-02-28' } });
    expect(mockHandlers.setTempEndDate).toHaveBeenCalledWith('2023-02-28');
  });

  it('uses default fontFamily when not provided', () => {
    const { fontFamily, ...propsWithoutFont } = defaultProps;
    render(<BookRatingDrawer {...propsWithoutFont} />);

    // Should render without errors
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  it('applies custom fontFamily to child components', () => {
    const props = {
      ...defaultProps,
      fontFamily: 'Custom Font',
    };

    render(<BookRatingDrawer {...props} />);

    const statusButtons = screen.getByTestId('status-buttons');
    const progressInput = screen.getByTestId('progress-input');

    expect(statusButtons).toHaveAttribute('data-font-family', 'Custom Font');
    expect(progressInput).toHaveAttribute('data-font-family', 'Custom Font');
  });

  it('handles rating change interaction', () => {
    render(<BookRatingDrawer {...defaultProps} />);

    const ratingButton = screen.getByText('Set Rating');
    fireEvent.click(ratingButton);

    expect(mockHandlers.setTempRating).toHaveBeenCalledWith(5);
  });

  it('handles status change interaction', () => {
    render(<BookRatingDrawer {...defaultProps} />);

    const statusButton = screen.getByText(/Status:/);
    fireEvent.click(statusButton);

    expect(mockHandlers.setTempStatus).toHaveBeenCalledWith(EStatus.READING);
  });

  it('handles progress change interaction', () => {
    render(<BookRatingDrawer {...defaultProps} />);

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
    render(<BookRatingDrawer {...props} />);
    expect(screen.getByLabelText('Start')).toHaveValue('2023-06-01');
    expect(screen.getByLabelText('End')).toHaveValue('2023-06-30');
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

    render(<BookRatingDrawer {...props} />);

    const applyButton = screen.getByTestId('apply-button');
    expect(applyButton).toBeDisabled();

    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-disabled', 'true');
  });
});
