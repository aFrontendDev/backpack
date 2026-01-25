export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUsername(username: string): ValidationResult {
  if (typeof username !== 'string') {
    return { valid: false, error: 'Username must be a string' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmed.length > 31) {
    return { valid: false, error: 'Username must be at most 31 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }

  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }

  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Email is required' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: 'Invalid email address' };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (typeof password !== 'string') {
    return { valid: false, error: 'Password must be a string' };
  }

  const trimmed = password.trim();

  if (trimmed.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Password must be at most 255 characters' };
  }

  return { valid: true };
}

export function isTokenExpired(expiresAt: number): boolean {
  return expiresAt < Date.now();
}

export function generateExpiryTime(hoursFromNow: number): number {
  return Date.now() + hoursFromNow * 60 * 60 * 1000;
}
