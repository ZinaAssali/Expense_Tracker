//import same pool as server
import { pool } from '../db.js';
import { hashPassword } from '../auth.ts';
import type { User } from '../model.ts';
//make sure everything is async

export async function createUser(username: string, password: string): Promise<User> {
    // Hash the password
    const hashedPassword = await hashPassword(password);
    // Insert user into the database
    const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
    );
    return {
        userId: result.rows[0].id,
        username,
        password: hashedPassword
    };
}

export async function findUserByUsername(username: string) {
    //run query to replace findUserByUsername
    const result = await pool.query(
        'SELECT id, username, password FROM users WHERE username = $1',
        [username]
    );
    if (result.rows.length === 0)
    {
        return null;
    }

    return {
        userId: result.rows[0].id,
        username: result.rows[0].username,
        password: result.rows[0].password
    };
}

export async function findUserById(userId: string) {
    const result = await pool.query(
        'SELECT id, username, password FROM users WHERE id = $1',
        [userId]
    );
    if (result.rows.length === 0) {
        return null;
    }

    return {
        userId: result.rows[0].id,
        username: result.rows[0].username,
        password: result.rows[0].password
    };
}
