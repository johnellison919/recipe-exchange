import { slugify } from './slugify';

describe('slugify', () => {
  it('should convert a simple title to a slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('should handle multiple spaces and special characters', () => {
    expect(slugify('My  Awesome   Recipe!!!')).toBe('my-awesome-recipe');
  });

  it('should trim leading and trailing dashes', () => {
    expect(slugify('--Hello World--')).toBe('hello-world');
  });

  it('should handle numbers', () => {
    expect(slugify('Recipe 101')).toBe('recipe-101');
  });

  it('should handle already-lowercase input', () => {
    expect(slugify('already lowercase')).toBe('already-lowercase');
  });

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
});
