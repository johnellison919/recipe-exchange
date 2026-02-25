import { HttpErrorResponse } from '@angular/common/http';

/**
 * Known backend error messages that are safe to display to users.
 * Any error not in this set gets replaced with a generic message.
 */
const KNOWN_ERROR_MESSAGES = new Set([
  // Auth
  'Invalid email or password',
  'Invalid email or password.',
  'Email already in use',
  'Email already in use.',
  'Username already taken',
  'Username already taken.',
  'Password must be at least 8 characters.',
  'Password must contain at least one uppercase letter and one digit.',
  'Account is locked. Try again later.',
  'Account is locked. Please try again later.',
  'Email not confirmed. Please check your inbox.',
  'Invalid or expired confirmation link.',
  'Invalid or expired token.',
  'Invalid or expired reset link.',
  'Password reset failed.',
  'Email change confirmation failed.',
  'Confirmation failed.',
  'New password cannot be the same as the current password.',
  'Current password is incorrect.',
  'Current password is incorrect',
  // Recipes
  'Recipe not found.',
  'You can only edit your own recipes.',
  'You can only delete your own recipes.',
  // Upload
  'File must be under 5 MB.',
  'No file provided',
  'Invalid file type. Allowed: jpg, jpeg, png, gif, webp',
]);

const GENERIC_ERROR = 'Something went wrong. Please try again.';

/**
 * Extracts a user-friendly error message from an HTTP error response.
 * Only surfaces known/expected backend messages; everything else gets a generic fallback.
 *
 * @param err  The HttpErrorResponse (or unknown error)
 * @param fallback  Optional context-specific fallback (e.g. "Failed to update avatar.")
 */
export function getUserErrorMessage(err: unknown, fallback?: string): string {
  if (err instanceof HttpErrorResponse) {
    const serverMessage = err.error?.error;
    if (typeof serverMessage === 'string' && KNOWN_ERROR_MESSAGES.has(serverMessage)) {
      return serverMessage;
    }
  }
  return fallback ?? GENERIC_ERROR;
}
