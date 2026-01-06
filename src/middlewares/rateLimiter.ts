import { NextFunction, Request, Response } from "express";

import { logger } from "@/configs/index.js";
import { DEFAULT_WINDOW_SECONDS } from "@/constants/index.js";
import { redisService } from "@/services/index.js";
import { RateLimitError } from "@/utils/index.js";

interface RateLimitOptions {
  /**
   * Optional custom key generator function
   */
  keyGenerator?: (req: Request) => string;
  /**
   * Optional key prefix for Redis storage
   * @default "ratelimit"
   */
  keyPrefix?: string;
  /**
   * Maximum number of requests per window
   * @default 100
   */
  max?: number;
  /**
   * Message to send when rate limit is exceeded
   */
  message?: string;
  /**
   * Skip rate limiting based on request
   */
  skip?: (req: Request) => boolean;
  /**
   * Time window in seconds
   * @default 900 (15 minutes)
   */
  windowMs?: number;
}

export const rateLimiter = (options: RateLimitOptions = {}) => {
  const {
    keyGenerator = (req: Request) => {
      const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
      const userId = req.user?.userId ?? "anonymous";
      return `${userId}:${ip}`;
    },
    keyPrefix = "ratelimit",
    max = 100,
    message = "Too many requests, please try again later",
    skip = () => false,
    windowMs = DEFAULT_WINDOW_SECONDS, // 15 minutes in seconds
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip rate limiting if skip function returns true
      if (skip(req)) {
        return next();
      }

      const identifier = keyGenerator(req);
      const key = `${keyPrefix}:${identifier}`;

      // Get current request count
      const current = await redisService.client.incr(key);

      // Set expiration on first request
      if (current === 1) {
        await redisService.client.expire(key, windowMs);
      }

      // Get TTL for rate limit headers
      const ttl = await redisService.client.ttl(key);
      const resetTime = Date.now() + ttl * 1000;

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", max.toString());
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - current).toString());
      res.setHeader("X-RateLimit-Reset", resetTime.toString());

      // Check if limit exceeded
      if (current > max) {
        res.setHeader("Retry-After", ttl.toString());
        throw new RateLimitError(message);
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        next(error);
      } else {
        // Log Redis errors but don't block requests
        logger.error("Rate limiter error:", error);
        next();
      }
    }
  };
};

/**
 * Predefined rate limiters for different use cases
 */
export const rateLimiters = {
  /**
   * Standard rate limiter for general API endpoints
   * 100 requests per 15 minutes
   */
  api: rateLimiter({
    keyPrefix: "ratelimit:api",
    max: 100,
    windowMs: 900,
  }),

  /**
   * Strict rate limiter for authentication endpoints
   * 5 requests per 15 minutes
   */
  auth: rateLimiter({
    keyPrefix: "ratelimit:auth",
    max: 5,
    message: "Too many authentication attempts, please try again later",
    windowMs: 900,
  }),

  /**
   * Lenient rate limiter for read-only operations
   * 300 requests per 15 minutes
   */
  readOnly: rateLimiter({
    keyPrefix: "ratelimit:readonly",
    max: 300,
    windowMs: 900,
  }),

  /**
   * Strict rate limiter for resource creation
   * 20 requests per 15 minutes
   */
  write: rateLimiter({
    keyPrefix: "ratelimit:write",
    max: 20,
    message: "Too many write operations, please try again later",
    windowMs: 900,
  }),
};
