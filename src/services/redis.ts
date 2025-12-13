import IORedis from "ioredis";

import { env } from "@/configs/index.js";

const Redis = IORedis.default;

class RedisService {
  get client() {
    return this._client;
  }

  private _client: IORedis.Redis;
  private isConnected = false;
  private readonly maxReconnectAttempts = 10;
  private reconnectAttempts = 0;

  async disconnect() {
    if (this._client) {
      await this._client.quit();
      console.log("✅ Redis disconnected gracefully");
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
          console.error("Max Redis reconnection attempts reached");
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        console.log(`Retrying Redis connection in ${delay}ms...`);
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
      console.log("✅ Connected to Redis Cloud!");
    });

    this.client.on("ready", () => {
      console.log("✅ Redis client is ready");
    });

    this.client.on("error", err => {
      this.isConnected = false;
      console.error("❌ Redis Connection Error:", err.message);
    });

    this.client.on("close", () => {
      this.isConnected = false;
      console.warn("⚠️ Redis connection closed");
    });

    this.client.on("reconnecting", () => {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting to Redis (attempt ${this.reconnectAttempts})...`);
    });
  }
}

export const redisService = new RedisService();
