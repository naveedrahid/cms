import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema/user.db'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('Database connected successfully');
})

pool.on('error', (err) => {
  console.error('Database connection error', err);
})

export const db = drizzle(pool, {schema});
