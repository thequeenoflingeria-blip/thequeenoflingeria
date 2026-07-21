import { Redis } from '@upstash/redis';

// Only create the instance if the env variables are present to prevent build errors
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

export const CACHE_TTL = {
  storeData: 60 * 5,      // 5 mins
  product: 60 * 10,       // 10 mins
  categories: 60 * 15,    // 15 mins
  searchResults: 60 * 2,  // 2 mins
  adminStats: 60,         // 1 min
};

export async function getCached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  if (!redis) return fetcher(); // Fallback if Redis is not configured

  try {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
    
    const fresh = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(fresh));
    return fresh;
  } catch (error) {
    console.error('Redis cache error:', error);
    return fetcher(); // Fallback to direct fetch on Redis error
  }
}
