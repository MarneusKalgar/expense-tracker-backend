import { Server } from "node:http";

import { logger } from "@/configs/logger.js";
import { dataSource } from "@/db/data-source.js";
import { redisService } from "@/services/index.js";

export const setupGracefulShutdown = (server: Server) => {
  let isShuttingDown = false;

  const closeServer = async () => {
    return new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      logger.info("Shutdown already in progress...");
      return;
    }

    isShuttingDown = true;
    logger.info(`\n${signal} received. Starting graceful shutdown...`);

    const forceShutdownTimer = setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 30000);

    try {
      if (server.listening) {
        await closeServer();
        logger.info("HTTP server closed (no new connections)");
      } else {
        logger.info("HTTP server already closed");
      }

      if (dataSource.isInitialized) {
        await dataSource.destroy();
        logger.info("Database connection closed");
      }

      await redisService.disconnect();

      clearTimeout(forceShutdownTimer);
      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", error => {
    logger.error("Uncaught Exception:", error);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown("unhandledRejection");
  });
};
