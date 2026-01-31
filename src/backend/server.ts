//This is the entry point, starts the server and listens on a port
import app from './app.js';
import { pool } from './db.js';

await pool.query('SELECT 1');
console.log('DB check passed');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

