process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';


import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { pool } from '../db.js';

beforeAll(async () => {
  await resetTestDatabase();
});

async function registerAndLogin(username: string, password = 'password123') {
  // Register
  await request(app)
    .post('/register')
    .send({ username, password })
    .expect(201);

  // Login
  const res = await request(app)
    .post('/login')
    .send({ username, password })
    .expect(200);

  expect(res.body.token).toBeDefined();
  return res.body.token;
}

describe('Auth routes', () => {
  it('registers and logs in a user, returning a JWT', async () => {
    const token = await registerAndLogin('testuser');
    expect(typeof token).toBe('string');
  });

  it('rejects login with wrong password', async () => {
    await request(app)
      .post('/register')
      .send({ username: 'badlogin', password: 'correct123' });

    const res = await request(app)
      .post('/login')
      .send({ username: 'badlogin', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });
});

describe('Expenses routes', () => {
  it('allows an authenticated user to create and fetch expenses', async () => {
    const token = await registerAndLogin('spender');

    // Create expense
    await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Coffee',
        amount: 5,
        date: new Date().toISOString()
      })
      .expect(201);

    // Fetch expenses
    const res = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Coffee');
  });

  it('does not allow one user to see another user’s expenses', async () => {
    const tokenA = await registerAndLogin('userA');
    const tokenB = await registerAndLogin('userB');

    // User A creates expense
    await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Private Expense',
        amount: 100,
        date: new Date().toISOString()
      })
      .expect(201);

    // User B fetches expenses
    const res = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    expect(res.body).toEqual([]);
  });
});

it('rejects invalid expense payload', async () => {
  const token = await registerAndLogin('testuser123', 'password123');

  await request(app)
    .post('/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: '',
      amount: -5,
      date: 'not-a-date',
    })
    .expect(400);
});


async function resetTestDatabase() {
  await pool.query('TRUNCATE expenses RESTART IDENTITY CASCADE');
  await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
}
