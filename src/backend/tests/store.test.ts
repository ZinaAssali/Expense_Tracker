import { describe, it, expect, beforeEach } from 'vitest';
import { createUser, findUserByUsername, resetStore } from '../store.js';
import { createExpense, findExpenseByTitle, expenses } from '../store.js';

describe('User store', () => {
  beforeEach(() => {
    resetStore();
  });

  it('creates a user and stores it', async () => {
    const user = await createUser('john', 'password123');

    expect(user.username).toBe('john');
  });

  it('finds a user by username', async () => {
    await createUser('jane', 'password123');

    const found = findUserByUsername('jane');

    expect(found).toBeDefined();
    expect(found?.username).toBe('jane');
  });
});

describe('Expense store', () => {
  beforeEach(async () => {
    resetStore();
    // Create a user to associate expenses with
    await createUser('john', 'password123');
  });

  it('creates an expense and stores it', async () => {
    const expense = await createExpense('1', 'Lunch', 10, new Date(), 'Lunch with friends');

    expect(expenses.length).toBe(1);
    expect(expense).toBeDefined();
    expect(expense!.title).toBe('Lunch');
  });

  it('stores expense under correct user', async () => {
    const expense = await createExpense('1', 'Lunch', 10, new Date(), 'Lunch with friends');
    expect(expense).toBeDefined();
    expect(expense!.userId).toBe('1');
  });

  it('handles invalid user IDs', async () => {
    const expense = await createExpense('invalid-id', 'Lunch', 10, new Date(), 'Lunch with friends');

    expect(expenses.length).toBe(0);
    expect(expense).toBeUndefined();
  });

  it('finds an expense by title', async () => {
    await createExpense('1', 'Dinner', 20, new Date(), 'Dinner with family');

    const found = findExpenseByTitle('Dinner');

    expect(found).toBeDefined();
    expect(found?.title).toBe('Dinner');
  });
});

