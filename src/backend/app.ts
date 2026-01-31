import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { verifyPassword } from './auth.js';
import { findUserByUsername, createUser } from './store/users.js';
import { createExpense, getExpensesByUser } from './store/expenses.js';
import jwt from './jwt.js';
import { validate } from './middleware/validate.js';
import { registerSchema, loginSchema, expenseSchema } from './validation/schemas.js';


const app = express();
app.use(express.json());


app.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await createUser(username, password);

    res.status(201).send({
      message: 'User registered',
      user: { id: user.userId, username }
    });
  } 
  catch (err: any) {
    if (err.code === '23505') {
      // unique violation
      return res.status(409).send({ message: 'Username already exists' });
    }
    throw err;
  }
});


app.post('/login', validate(loginSchema),async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  const token = jwt.createToken(user.userId);
  res.send({ token });
});



function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  const decoded = jwt.verifyToken(token);

  if (!decoded) {
    return res.sendStatus(401);
  }

  (req as any).userId = decoded.userId;
  next();
}


app.post('/expenses', authenticateToken, validate(expenseSchema), async (req, res) => {
  try {
    const { title, amount, date, notes } = req.body;
    const userId = (req as any).userId;

    // normalize date (ISO string -> Date)
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).send({ message: 'Invalid date' });
    }

    // IMPORTANT: argument order must match your store function:
    // createExpense(userId, title, amount, date, notes)
    const expense = await createExpense(
      userId,
      title,
      Number(amount),
      parsedDate,
      notes
    );

    return res.status(201).send({ 
      id: expense.expenseId,
      userId: expense.userId,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      notes: expense.notes
    });
  } catch (err) {
    console.error('POST /expenses failed:', err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});


app.get('/expenses', authenticateToken, async (req, res) => {
  const userId = (req as any).userId;
  const expenses = await getExpensesByUser(userId);
  res.status(200).send(expenses);
});


export default app;


