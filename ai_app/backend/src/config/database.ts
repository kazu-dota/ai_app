import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const dbConfig: PoolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_MAX_CONNECTIONS ?? '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT ?? '30000'),
      connectionTimeoutMillis: parseInt(
        process.env.DB_CONNECTION_TIMEOUT ?? '2000'
      ),
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }
  : {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      database: process.env.POSTGRES_DB ?? 'ai_app_db',
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'password',
      max: parseInt(process.env.DB_MAX_CONNECTIONS ?? '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT ?? '30000'),
      connectionTimeoutMillis: parseInt(
        process.env.DB_CONNECTION_TIMEOUT ?? '2000'
      ),
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };

export const pool = new Pool(dbConfig);

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', err => {
  logger.error('PostgreSQL pool error:', err);
});

export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed: ${text} (${duration}ms)`);
    return res.rows as T[];
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async (): Promise<import('pg').PoolClient> => {
  return await pool.connect();
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await query('SELECT NOW()');
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
};

export default pool;
