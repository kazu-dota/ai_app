import { pool } from '@/config/database';
import logger from '@/config/logger';
import fs from 'fs';
import path from 'path';

const seedsDir = path.join(__dirname, '../../../database/seeds');

async function runSeeds(): Promise<void> {
  logger.info('Starting database seeding...');
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const seedFilePath = path.join(seedsDir, '001_initial_data.sql');
    const seedSql = fs.readFileSync(seedFilePath, 'utf8');

    await client.query(seedSql);
    await client.query('COMMIT');
    logger.info('Database seeding completed successfully.');
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    logger.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end(); // Close the pool after seeding
  }
}

runSeeds().catch((error) => {
  logger.error('Seeding failed:', error);
  process.exit(1);
});
