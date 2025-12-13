import { Server } from "node:http";

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
      console.log("Shutdown already in progress...");
      return;
    }

    isShuttingDown = true;
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    const forceShutdownTimer = setTimeout(() => {
      console.error("⚠️ Forced shutdown after timeout");
      process.exit(1);
    }, 30000);

    try {
      if (server.listening) {
        await closeServer();
        console.log("✅ HTTP server closed (no new connections)");
      } else {
        console.log("⚠️ HTTP server already closed");
      }

      if (dataSource.isInitialized) {
        await dataSource.destroy();
        console.log("✅ Database connection closed");
      }

      await redisService.disconnect();

      clearTimeout(forceShutdownTimer);
      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      clearTimeout(forceShutdownTimer);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", error => {
    console.error("Uncaught Exception:", error);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown("unhandledRejection");
  });
};
