import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  isTokenExpired,
  generateExpiryTime
} from './validation';

describe('validateUsername', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('john')).toEqual({ valid: true });
    expect(validateUsername('john_doe')).toEqual({ valid: true });
    expect(validateUsername('john-doe')).toEqual({ valid: true });
    expect(validateUsername('JohnDoe123')).toEqual({ valid: true });
    expect(validateUsername('abc')).toEqual({ valid: true }); // min length
    expect(validateUsername('a'.repeat(31))).toEqual({ valid: true }); // max length
  });

  it('rejects usernames that are too short', () => {
    const result = validateUsername('ab');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 3 characters');
  });

  it('rejects usernames that are too long', () => {
    const result = validateUsername('a'.repeat(32));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at most 31 characters');
  });

  it('rejects usernames with invalid characters', () => {
    expect(validateUsername('john doe').valid).toBe(false); // space
    expect(validateUsername('john@doe').valid).toBe(false); // @
    expect(validateUsername('john.doe').valid).toBe(false); // .
    expect(validateUsername('john!').valid).toBe(false); // !
  });

  it('trims whitespace before validation', () => {
    expect(validateUsername('  john  ')).toEqual({ valid: true });
  });

  it('rejects non-string input', () => {
    expect(validateUsername(null as any).valid).toBe(false);
    expect(validateUsername(undefined as any).valid).toBe(false);
    expect(validateUsername(123 as any).valid).toBe(false);
  });
});

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('test@example.com')).toEqual({ valid: true });
    expect(validateEmail('user.name@domain.co.uk')).toEqual({ valid: true });
    expect(validateEmail('user+tag@example.org')).toEqual({ valid: true });
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail').valid).toBe(false);
    expect(validateEmail('missing@domain').valid).toBe(false);
    expect(validateEmail('@nodomain.com').valid).toBe(false);
    expect(validateEmail('spaces in@email.com').valid).toBe(false);
  });

  it('rejects empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('required');
  });

  it('normalizes email to lowercase', () => {
    // The validation itself doesn't return the normalized value,
    // but it should accept uppercase emails as valid
    expect(validateEmail('TEST@EXAMPLE.COM')).toEqual({ valid: true });
  });

  it('trims whitespace', () => {
    expect(validateEmail('  test@example.com  ')).toEqual({ valid: true });
  });

  it('rejects non-string input', () => {
    expect(validateEmail(null as any).valid).toBe(false);
    expect(validateEmail(undefined as any).valid).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts valid passwords', () => {
    expect(validatePassword('validpassword1')).toEqual({ valid: true });
    expect(validatePassword('a'.repeat(12))).toEqual({ valid: true }); // min length
    expect(validatePassword('a'.repeat(255))).toEqual({ valid: true }); // max length
  });

  it('rejects passwords that are too short', () => {
    const result = validatePassword('short');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 12 characters');
  });

  it('rejects passwords that are too long', () => {
    const result = validatePassword('a'.repeat(256));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at most 255 characters');
  });

  it('allows special characters in passwords', () => {
    expect(validatePassword('P@ssw0rd!@#$%^')).toEqual({ valid: true });
  });

  it('trims whitespace before validation', () => {
    // 12 chars with padding should still be valid after trim
    expect(validatePassword('  validpassword1  ')).toEqual({ valid: true });
  });

  it('rejects non-string input', () => {
    expect(validatePassword(null as any).valid).toBe(false);
    expect(validatePassword(undefined as any).valid).toBe(false);
  });
});

describe('isTokenExpired', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false for tokens that have not expired', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const futureTime = now + 60 * 60 * 1000; // 1 hour from now
    expect(isTokenExpired(futureTime)).toBe(false);
  });

  it('returns true for tokens that have expired', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const pastTime = now - 1; // 1ms ago
    expect(isTokenExpired(pastTime)).toBe(true);
  });

  it('returns false for tokens expiring exactly now', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    // Token expiring at exactly now is not yet expired (uses < not <=)
    expect(isTokenExpired(now)).toBe(false);
  });
});

describe('generateExpiryTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('generates correct expiry time for 1 hour', () => {
    const now = 1000000;
    vi.setSystemTime(now);

    const expiry = generateExpiryTime(1);
    expect(expiry).toBe(now + 60 * 60 * 1000);
  });

  it('generates correct expiry time for 24 hours', () => {
    const now = 1000000;
    vi.setSystemTime(now);

    const expiry = generateExpiryTime(24);
    expect(expiry).toBe(now + 24 * 60 * 60 * 1000);
  });

  it('handles fractional hours', () => {
    const now = 1000000;
    vi.setSystemTime(now);

    const expiry = generateExpiryTime(0.5); // 30 minutes
    expect(expiry).toBe(now + 30 * 60 * 1000);
  });
});
