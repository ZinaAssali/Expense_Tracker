import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
process.env.NODE_ENV = 'test';
import { pool } from '../db.js';
import { createUser, findUserByUsername} from '../store/users.js';
import { createExpense, findExpenseByTitle, getExpensesByUser, deleteExpense} from '../store/expenses.js';

beforeEach(async () => {
  await resetTestDatabase();
});


describe('Users store', () => {
  it('should create a user', async () => {
    const user = await createUser('testuser', 'password');
    expect(user).toHaveProperty('userId');
    expect(user.username).toBe('testuser');
  });

  it('should find a user by username', async () => {
    await createUser('testuser', 'password');
    const user = await findUserByUsername('testuser');
    expect(user).not.toBeNull();
    expect(user!.userId).toBeDefined();
    expect(user?.username).toBeDefined();
  });
});

describe('Expenses store', () => {
  it('should create an expense', async () => {
    const user = await createUser('testuser', 'password');
    const expense = await createExpense(user.userId, 'Test Expense', 100, new Date());
    expect(expense).toHaveProperty('expenseId');
    expect(expense.title).toBe('Test Expense');
  });

  it('should find an expense by title', async () => {
    const user = await createUser('testuser', 'password');
    await createExpense(user.userId, 'Test Expense', 100, new Date());
    const expense = await findExpenseByTitle(user.userId, 'Test Expense');
    expect(expense).not.toBeNull();
    expect(expense!.expenseId).toBeDefined();
    expect(expense?.title).toBe('Test Expense');
  });

  it('should not allow one user to access another user’s expense', async () => {
  const userA = await createUser('userA', 'password');
  const userB = await createUser('userB', 'password');

  const title = `Private Expense ${userA.userId}`;

  await createExpense(userA.userId, 'Private Expense', 50, new Date());

  const result = await findExpenseByTitle(userB.userId, 'Private Expense');

  expect(result).toBeNull();
  });

  it('returns empty array when user has no expenses', async () => {
  const user = await createUser('lonelyuser', 'password');

  const expenses = await getExpensesByUser(user.userId);

  expect(expenses).toEqual([]);
  });

  it('deletes an expense successfully', async () => {
  const user = await createUser('deleter', 'password');
  const expense = await createExpense(user.userId, 'Trash', 10, new Date());

  const deleted = await deleteExpense(expense.expenseId);
  expect(deleted).toBe(true);

  const found = await findExpenseByTitle(user.userId, 'Trash');
  expect(found).toBeNull();
  });




});
async function resetTestDatabase() {
  await pool.query('TRUNCATE expenses RESTART IDENTITY CASCADE');
  await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
}

