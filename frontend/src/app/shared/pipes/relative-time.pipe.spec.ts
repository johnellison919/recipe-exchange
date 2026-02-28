import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;

  beforeEach(() => {
    pipe = new RelativeTimePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "just now" for dates less than 60 seconds ago', () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(pipe.transform(date)).toBe('just now');
  });

  it('should return minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(date)).toBe('5 minutes ago');
  });

  it('should return singular minute', () => {
    const date = new Date(Date.now() - 1 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 minute ago');
  });

  it('should return hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('3 hours ago');
  });

  it('should return singular hour', () => {
    const date = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 hour ago');
  });

  it('should return days ago', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('3 days ago');
  });

  it('should return weeks ago', () => {
    const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('2 weeks ago');
  });

  it('should return months ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('2 months ago');
  });

  it('should return years ago', () => {
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 year ago');
  });
});
