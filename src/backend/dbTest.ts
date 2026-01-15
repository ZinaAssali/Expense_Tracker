import { pool } from './db.js';

async function testDB() {
  const result = await pool.query('SELECT NOW()');
  console.log('DB time:', result.rows[0]);
  await pool.end();
}

testDB().catch(console.error);
