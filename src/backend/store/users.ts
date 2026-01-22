import { pool } from '../db.js';
export async function findUserByUsername(username: string) {
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

