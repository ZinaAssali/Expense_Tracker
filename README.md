# Expense_Tracker
Description:
A secure, production style backend API for tracking personal expenses.
Built with TypeScript, Node.js, Express, and PostgreSQL, featuring JWT authentication, per-user authorization, and full test coverage.
This project demonstrates real-world backend architecture, database design, and secure API practices.

Important features:
User registration and login with bcrypt password hashing
JWT-based authentication for protected routes
Per-user expense isolation (users can only access their own data)
CRUD operations for expenses
PostgreSQL persistence with foreign key constraints
Request validation using Zod
Comprehensive unit and integration tests with Vitest and Supertest

Tech stack used:
Language: TypeScript
Runtime: Node.js
Framework: Express
Database: PostgreSQL
Authentication: JWT + bcrypt
Validation: Zod
Testing: Vitest, Supertest
Database Driver: pg

Database schema:
Users Table
id (UUID, primary key)
username (unique)
password (hashed)
created_at

Expenses Table
id (UUID, primary key)
user_id (foreign key → users.id)
title
amount
date
notes
created_at

Testing:
Store-layer tests validate database logic and constraints
Route tests verify authentication, authorization, and request validation
Tests run against a real PostgreSQL database with isolated state
To run tests: npm test

To get started:
1. Install dependencies: npm install
2. Set up environment variables by creating a .env file: DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker
JWT_SECRET=your_secret_key
3. Start the server: npm run dev
4. Server will run on: http://localhost:3000

API endpoints:
Auth
POST /register
POST /login

Expenses (JWT required)
GET /expenses
POST /expenses
DELETE /expenses/:id

This project was built to practice:
Secure backend design
Authentication & authorization
Relational database modeling
Test-driven backend development
Clean separation of concerns
It is designed as a foundation that can be extended with a frontend or deployed as a full-stack application.