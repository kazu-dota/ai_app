import { createClient, RedisClientType } from 'redis';
import logger from './logger';

const redisConfig = {
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
};

export const redisClient: RedisClientType = createClient(redisConfig);

redisClient.on('connect', () => {
  logger.info('Connected to Redis server');
});

redisClient.on('error', err => {
  logger.error('Redis client error:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  } catch (error) {
    logger.error('Failed to disconnect from Redis:', error);
  }
};

export const setCache = async (
  key: string,
  value: string,
  expireInSeconds?: number
): Promise<void> => {
  try {
    if (expireInSeconds) {
      await redisClient.setEx(key, expireInSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error('Redis set error:', error);
    throw error;
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Redis delete error:', error);
  }
};

export const existsCache = async (key: string): Promise<boolean> => {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Redis exists error:', error);
    return false;
  }
};

export default redisClient;
