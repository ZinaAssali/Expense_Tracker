import { pool } from '../db.js';
import type { Expense } from '../model.js';

export async function createExpense(userId: string, title: string, amount: number, date: Date, notes?: string): Promise<Expense> {
    //insert the expense into the database
    const result = await pool.query(
        'INSERT INTO expenses (user_id, title, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, title, amount, date, notes ?? null]
    );
    return {
        expenseId: result.rows[0].id,
        userId,
        title,
        amount,
        date,
        notes
    };
}

export async function getExpensesByUser(userId: string, limit = 10, offset = 0): Promise<Expense[]> {
    const result = await pool.query(
        'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
    );
    return result.rows.map((row) => ({
        expenseId: row.id,
        userId: row.user_id,
        title: row.title,
        amount: row.amount,
        date: row.date,
        notes: row.notes
    }));
}

export async function findExpenseByTitle(userId: string, title: string): Promise<Expense | null> {
    const result = await pool.query(
        'SELECT * FROM expenses WHERE user_id = $1 AND title = $2',
        [userId, title]
    );
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        expenseId: row.id,
        userId: row.user_id,
        title: row.title,
        amount: row.amount,
        date: row.date,
        notes: row.notes ?? undefined
    };
}

export async function deleteExpense(expenseId: string): Promise<boolean> {
    const result = await pool.query(
        'DELETE FROM expenses WHERE id = $1',
        [expenseId]
    );
    return (result.rowCount ?? 0) > 0;
}

