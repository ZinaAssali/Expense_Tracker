
import 'dotenv/config';
import { pool } from './db.js';

await pool.query('SELECT 1');
console.log('DB check passed');

//receives http request, runs functions in order, sends http response
//components of express: import express module
//create an application instance
//define routes
//start server
import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { verifyPassword } from './auth.js';
import { createUser, findUserByUsername, createExpense } from './store.js';
import jwt  from './jwt.js';


const app = express();

app.use(express.json());

//middleware functions
//receives req, res, next and decides whether to modify request, end response
//post sends data to the server in order to create/process a resource
//client sends data, server processes it and responds
app.post('/register', async (req: Request, res) => {
  const { username, password } = req.body;
  //hash the password from the given password
  const user = await createUser(username, password);
  // Save user to database
  res.status(201).send({ message: 'User registered', user: { id: user.userId, username} });
});

//mock function to simulate database user lookup
app.post('/login', async (req: Request, res) => {
  //username and password from requests
  const { username, password } = req.body;
  //attempt to find the user by the username
  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  //if username valid, check for password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return res.status(401).send({ message: 'Invalid password' });
  }
  // Generate JWT token
  const token = jwt.createToken(user.userId);

  res.send({ token });
});

app.post('/createExpense', async (req: Request, res) => {
  const { title, amount, date, notes } = req.body;
  const expense = createExpense(title, amount, date, notes);
  res.status(201).send({ message: 'Expense created', expense });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
