import { pool } from '../db.js';
import type { Expense } from '../model.js';
import {randomUUID } from 'crypto';

export async function createExpense(userId: string, title: string, amount: number, date: Date, notes?: string): Promise<Expense | undefined> {
    //insert the expense into the database
    const result = await pool.query(
        'INSERT INTO expenses (user_id, title, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, title, amount, date, notes]
    );
    if (result.rows.length === 0) {
        return undefined;
    }
    return {
        expenseId: result.rows[0].id,
        userId,
        title,
        amount,
        date,
        notes
    };
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
