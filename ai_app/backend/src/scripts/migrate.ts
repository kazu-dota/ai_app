import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../config/logger';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  database: process.env.POSTGRES_DB ?? 'ai_app_db',
  user: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'password',
});

const migrationsDir = path.join(__dirname, '../../../database/migrations');

async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    const appliedMigrations = (
      await client.query('SELECT name FROM migrations')
    ).rows.map((row: { name: string }) => row.name);
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        logger.info(`Applying migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        logger.info(`Successfully applied migration: ${file}`);
      } else {
        logger.info(`Migration already applied: ${file}`);
      }
    }

    await client.query('COMMIT');
    logger.info('All migrations applied successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error applying migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(error => {
  logger.error('Migration process failed:', error);
  process.exit(1);
});
