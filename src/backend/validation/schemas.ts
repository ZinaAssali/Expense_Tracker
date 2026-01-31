import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username too short'),
  password: z.string().min(6, 'Password too short'),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});
