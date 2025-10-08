import React from 'react';
import { render } from '@testing-library/react';
import BookRatingReviewInput from './BookRatingReviewInput';

describe('BookRatingReviewInput', () => {
  const mockSetTempReview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BookRatingReviewInput tempReview="" setTempReview={mockSetTempReview} />
    );
  });

  it('renders with review value', () => {
    const reviewText = 'This is a great book!';
    render(
      <BookRatingReviewInput
        tempReview={reviewText}
        setTempReview={mockSetTempReview}
      />
    );
  });

  it('renders when loading', () => {
    render(
      <BookRatingReviewInput
        tempReview=""
        setTempReview={mockSetTempReview}
        isLoading={true}
      />
    );
  });

  it('renders with custom font family', () => {
    const customFont = 'Arial, sans-serif';
    render(
      <BookRatingReviewInput
        tempReview=""
        setTempReview={mockSetTempReview}
        fontFamily={customFont}
      />
    );
  });
});
