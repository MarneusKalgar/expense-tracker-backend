import IORedis from "ioredis";

import { env, logger } from "@/configs/index.js";

const Redis = IORedis.default;

class RedisService {
  get client() {
    return this._client;
  }

  get connectionStatus() {
    return this.isConnected && this._client.status === "ready";
  }

  private _client: IORedis.Redis;
  private isConnected = false;
  private readonly maxReconnectAttempts = 10;
  private reconnectAttempts = 0;

  async disconnect() {
    if (this._client) {
      await this._client.quit();
      logger.info("Redis disconnected gracefully");
    }
  }

  initialize() {
    this._client = new Redis({
      db: 0,
      host: env.redis.host,
      password: env.redis.password,
      port: env.redis.port,
      retryStrategy: times => {
        if (times > this.maxReconnectAttempts) {
          logger.error("Max Redis reconnection attempts reached");
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        logger.info(`Retrying Redis connection in ${delay}ms...`);
        return delay;
      },
      username: env.redis.user,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info("Connected to Redis Cloud!");
    });

    this.client.on("ready", () => {
      logger.info("Redis client is ready");
    });

    this.client.on("error", err => {
      this.isConnected = false;
      logger.error("Redis Connection Error:", err.message);
    });

    this.client.on("close", () => {
      this.isConnected = false;
      logger.warn("Redis connection closed");
    });

    this.client.on("reconnecting", () => {
      this.reconnectAttempts++;
      logger.info(`Reconnecting to Redis (attempt ${this.reconnectAttempts})...`);
    });
  }
}

export const redisService = new RedisService();
