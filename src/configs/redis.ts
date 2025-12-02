import IORedis from "ioredis";

import { env } from "@/configs/index.js";

const Redis = IORedis.default;

const redisClient = new Redis({
  db: 0,
  host: env.redis.host,
  password: env.redis.password,
  port: env.redis.port,
  username: env.redis.user,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis Cloud!");
});

redisClient.on("error", err => {
  console.error("Redis Cloud Connection Error:", err);
});

export { redisClient };
