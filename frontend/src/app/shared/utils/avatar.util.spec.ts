import { generateLetterAvatar, getAvatarUrl } from './avatar.util';

describe('avatar.util', () => {
  describe('generateLetterAvatar', () => {
    it('should return a data URI SVG', () => {
      const result = generateLetterAvatar('Alice');
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it('should use the first letter of the username uppercased', () => {
      const result = generateLetterAvatar('bob');
      const svg = atob(result.replace('data:image/svg+xml;base64,', ''));
      expect(svg).toMatch(/>\s*B\s*</);
    });

    it('should use ? for empty username', () => {
      const result = generateLetterAvatar('');
      const svg = atob(result.replace('data:image/svg+xml;base64,', ''));
      expect(svg).toMatch(/>\s*\?\s*</);
    });

    it('should return consistent results for the same username', () => {
      const a = generateLetterAvatar('TestUser');
      const b = generateLetterAvatar('TestUser');
      expect(a).toBe(b);
    });
  });

  describe('getAvatarUrl', () => {
    it('should return the avatarUrl when provided', () => {
      expect(getAvatarUrl('https://example.com/pic.jpg', 'user')).toBe(
        'https://example.com/pic.jpg',
      );
    });

    it('should generate a letter avatar when avatarUrl is null', () => {
      const result = getAvatarUrl(null, 'user');
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it('should generate a letter avatar when avatarUrl is undefined', () => {
      const result = getAvatarUrl(undefined, 'user');
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
    });
  });
});
