import { hashPassword } from './auth.js';
import type { User } from './model.js';
import type { Expense } from './model.js';

export const users: User[] = [];
export const expenses: Expense[] = [];

export function generateUserId(): string {
	return (users.length + 1).toString();
}

export async function createUser(username: string, password: string): Promise<User> {
	const user: User = {
		userId: generateUserId(),
		username,
		password: await hashPassword(password) // Store hashed password
	};
	users.push(user);
	return user;
}

export function createExpense(userId: string, title: string, amount: number, date: Date, notes?: string): Expense | undefined {
	const userExists = users.some(user => user.userId === userId);
	if (!userExists) {
		return undefined;
	}
	const expense: Expense = {
		expenseId: (expenses.length + 1).toString(),
		userId, // set to the provided user's ID
		title,
		amount,
		date,
		notes
	};
	expenses.push(expense);
	return expense;
}



export function findUserByUsername(username: string): User | undefined {
    return users.find(user => user.username === username);
}

export function findExpenseByTitle(title: string): Expense | undefined {
    return expenses.find(expense => expense.title === title);
}

export function resetStore() {
  users.length = 0;
  expenses.length = 0;
}
