import { Request, Response } from "express";

import { logger } from "@/configs/index.js";
import { dataSource } from "@/db/data-source.js";
import { redisService } from "@/services/redis.js";

interface Health {
  services: Record<string, ServiceStatus>;
  status: OverallStatus;
  timestamp: string;
  uptime: number;
}
type OverallStatus = "degraded" | "down" | "ok";

type ServiceStatus = "connected" | "disconnected" | "unknown";

/**
 * Health check endpoint - returns overall system health
 */
export const healthCheck = async (req: Request, res: Response) => {
  const timeoutPromise = new Promise<Health>((_, reject) =>
    setTimeout(() => reject(new Error("Health check timeout")), 5000),
  );

  const performHealthCheck = async (): Promise<Health> => {
    const health: Health = {
      services: {
        database: "unknown" as ServiceStatus,
        redis: "unknown" as ServiceStatus,
      },
      status: "ok" as OverallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    try {
      if (dataSource.isInitialized) {
        await dataSource.query("SELECT 1");
        health.services.database = "connected";
      } else {
        health.services.database = "disconnected";
      }
      // eslint-disable-next-line
    } catch (error) {
      health.services.database = "disconnected";
    }

    try {
      await redisService.client.ping();
      health.services.redis = "connected";
      // eslint-disable-next-line
    } catch (error) {
      health.services.redis = "disconnected";
    }

    const allConnected = Object.values(health.services).every(status => status === "connected");
    const allDisconnected = Object.values(health.services).every(
      status => status === "disconnected",
    );

    if (allDisconnected) {
      health.status = "down";
    } else if (!allConnected) {
      health.status = "degraded";
    }

    return health;
  };

  try {
    const result = await Promise.race([performHealthCheck(), timeoutPromise]);

    const httpStatus = result.status === "ok" ? 200 : 503;
    res.status(httpStatus).json(result);
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(503).json({
      error: true,
      message: "Health check failed",
    });
  }
};

/**
 * Readiness probe - checks if app is ready to receive traffic
 */
export const readinessCheck = async (req: Request, res: Response) => {
  try {
    const isDatabaseReady = dataSource.isInitialized;
    let isRedisReady = false;

    try {
      await redisService.client.ping();
      isRedisReady = true;
    } catch {
      isRedisReady = false;
    }

    const isReady = isDatabaseReady && isRedisReady;

    if (isReady) {
      res.status(200).json({
        services: {
          database: isDatabaseReady,
          redis: isRedisReady,
        },
        status: "ok",
      });
    } else {
      res.status(503).json({
        services: {
          database: isDatabaseReady,
          redis: isRedisReady,
        },
        status: "down",
      });
    }
  } catch (error) {
    logger.error("Readiness check failed:", error);
    res.status(503).json({
      error: true,
      message: "Readiness check failed",
    });
  }
};

/**
 * Liveness probe - simple check if the app is running
 */
export const livenessCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
};
