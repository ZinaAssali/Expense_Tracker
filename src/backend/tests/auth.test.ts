process.env.JWT_SECRET = 'test_secret';

import { describe, it, expect } from 'vitest';
import jwt from '../jwt.js';
import { hashPassword, verifyPassword } from '../auth.js';

describe('Authentication', () => {
  it('hashes a password', async () => {
    const hashed = await hashPassword('password123');
    expect(hashed).toBeDefined();
  });

  it('verifies a password', async () => {
    const hashed = await hashPassword('password123');
    const isValid = await verifyPassword('password123', hashed);
    expect(isValid).toBe(true);
  });

  it('fails to verify an invalid password', async () => {
    const hashed = await hashPassword('password123');
    const isValid = await verifyPassword('wrongpassword', hashed);
    expect(isValid).toBe(false);
  });
});

describe('JWT', () => {
  it('creates a token', () => {
    const token = jwt.createToken('1');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('verifies a valid token', () => {
    const token = jwt.createToken('1');
    const decoded = jwt.verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe('1');
  });

  it('fails to verify an invalid token', () => {
    const decoded = jwt.verifyToken('invalid-token');
    expect(decoded).toBeUndefined();
  });
});
