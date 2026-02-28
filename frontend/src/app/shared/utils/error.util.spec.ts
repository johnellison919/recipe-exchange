import { HttpErrorResponse } from '@angular/common/http';
import { getUserErrorMessage } from './error.util';

describe('getUserErrorMessage', () => {
  it('should return a known backend error message', () => {
    const err = new HttpErrorResponse({
      error: { error: 'Invalid email or password' },
      status: 401,
    });
    expect(getUserErrorMessage(err)).toBe('Invalid email or password');
  });

  it('should return generic message for unknown backend error', () => {
    const err = new HttpErrorResponse({
      error: { error: 'Some internal server error details' },
      status: 500,
    });
    expect(getUserErrorMessage(err)).toBe('Something went wrong. Please try again.');
  });

  it('should return custom fallback for unknown error', () => {
    const err = new HttpErrorResponse({
      error: { error: 'Unknown error' },
      status: 500,
    });
    expect(getUserErrorMessage(err, 'Custom fallback')).toBe('Custom fallback');
  });

  it('should return generic message for non-HttpErrorResponse', () => {
    expect(getUserErrorMessage(new Error('random'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('should return fallback for non-HttpErrorResponse when provided', () => {
    expect(getUserErrorMessage('string error', 'Fallback')).toBe('Fallback');
  });

  it('should handle HttpErrorResponse with no error body', () => {
    const err = new HttpErrorResponse({ error: null, status: 500 });
    expect(getUserErrorMessage(err)).toBe('Something went wrong. Please try again.');
  });

  it('should recognise known recipe error messages', () => {
    const err = new HttpErrorResponse({
      error: { error: 'Recipe not found.' },
      status: 404,
    });
    expect(getUserErrorMessage(err)).toBe('Recipe not found.');
  });
});
