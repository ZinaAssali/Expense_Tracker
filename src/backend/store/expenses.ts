import { pool } from './db.js';
import {randomUUID } from 'crypto';

export async function createExpense(userId: string, title: string, amount: number, date: string, notes?: string) {
  const id = randomUUID();
  const result = await pool.query(
    'INSERT INTO expenses (id, user_id, title, amount, date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, userId, title, amount, date, notes]
  );
  return result.rows[0];
}

export async function getExpensesByUser(
    userId: string,
    limit = 10,
    offset = 0
) {
    const result = await pool.query(
        'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
    );
    return result.rows;
}
