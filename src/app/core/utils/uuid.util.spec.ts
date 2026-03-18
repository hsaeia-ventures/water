import { describe, it, expect, vi } from 'vitest';
import { generateId } from './uuid.util';

describe('generateId', () => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('should return a valid UUID v4 string', () => {
    const id = generateId();
    expect(id).toMatch(UUID_REGEX);
  });

  it('should return unique values on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('should use fallback when crypto.randomUUID is not available', () => {
    const originalRandomUUID = crypto.randomUUID;
    // @ts-expect-error — forcing undefined for test
    crypto.randomUUID = undefined;

    const id = generateId();
    expect(id).toMatch(UUID_REGEX);

    crypto.randomUUID = originalRandomUUID;
  });
});
