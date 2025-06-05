// config/redis.js
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  retryStrategy: (times) => {
    // Reconectar após 5 segundos
    return Math.min(times * 100, 5000);
  }
});

redisClient.on('error', (err) => {
  console.error('🚨 Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Conectado ao Redis');
});

export default redisClient;