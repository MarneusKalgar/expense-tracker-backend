import "reflect-metadata";
import express from "express";

import { serverSetup, setupDb, setupGracefulShutdown } from "./initialization/index.js";
import { redisService } from "./services/redis.js";

const app = express();

const start = async () => {
  try {
    redisService.initialize();
    await setupDb();
    const server = await serverSetup(app);
    setupGracefulShutdown(server);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

start();
