import { RedisClientOptions } from "redis";
import { createClient } from "redis";

export const redisConfigs: RedisClientOptions = {};

export const bullRedisOptions: {
  redis: any;
} = {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
};

export const checkRedisReady = () =>
  new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Redis connection timeout !!!");
    }, 5000);
    console.log(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });
    try {
      await client.connect();
      clearTimeout(timeout);
      resolve(true);
    } catch (e) {
      console.log("Redis is not running");
      clearTimeout(timeout);
      reject(e);
    }
  });
