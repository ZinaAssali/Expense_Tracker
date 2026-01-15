import { pool } from './db.js';
import { random UUID } from 'crypto';

export async function createUser(username: string, password: string) {
  const id = randomUUID();
  const result = await pool.query(
    'INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING id, username, created_at',
    [id, username, password]
  );
  return result.rows[0];
}

export async function findUserByUsername(username: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] ?? null;
}
