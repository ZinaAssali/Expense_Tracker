import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Connected to PostgreSQL');
  }
});


