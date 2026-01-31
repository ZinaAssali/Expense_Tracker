import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ALWAYS load env explicitly
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
});

console.log('ENV CHECK', {
  PGUSER: process.env.PGUSER,
  PGDATABASE: process.env.PGDATABASE,
});

export const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
});
