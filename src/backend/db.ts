import { Pool } from 'pg'; //pool manages reusable database connections, no new connection for every query

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Connected to PostgreSQL');
  }
});


