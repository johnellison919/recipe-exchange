import { TimeDurationPipe } from './time-duration.pipe';

describe('TimeDurationPipe', () => {
  let pipe: TimeDurationPipe;

  beforeEach(() => {
    pipe = new TimeDurationPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return minutes for values under 60', () => {
    expect(pipe.transform(30)).toBe('30 mins');
  });

  it('should return singular minute for 1', () => {
    expect(pipe.transform(1)).toBe('1 min');
  });

  it('should return hours only when evenly divisible', () => {
    expect(pipe.transform(60)).toBe('1 hr');
    expect(pipe.transform(120)).toBe('2 hrs');
  });

  it('should return hours and minutes for mixed values', () => {
    expect(pipe.transform(90)).toBe('1 hr 30 mins');
    expect(pipe.transform(61)).toBe('1 hr 1 min');
    expect(pipe.transform(150)).toBe('2 hrs 30 mins');
  });
});
