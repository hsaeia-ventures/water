import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;

  beforeEach(() => {
    pipe = new RelativeTimePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for invalid date', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('should format a date a few seconds ago', () => {
    const date = new Date(Date.now() - 30 * 1000); // 30 seconds ago
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should format a date a few minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
    // Should contain some reference to minutes
    expect(result.length).toBeGreaterThan(0);
  });

  it('should format a date hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should format a date days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should accept string input', () => {
    const dateStr = new Date(Date.now() - 60000).toISOString();
    const result = pipe.transform(dateStr);
    expect(result).toBeTruthy();
  });

  it('should accept number (timestamp) input', () => {
    const timestamp = Date.now() - 120000;
    const result = pipe.transform(timestamp);
    expect(result).toBeTruthy();
  });

  it('should format future dates', () => {
    const date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in the future
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});
