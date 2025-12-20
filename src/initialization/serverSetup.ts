import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

import { logger } from "@/configs/index.js";
import { apiVersion } from "@/middlewares/index.js";
import { healthRouter, v1Router } from "@/routes/index.js";

import { setupErrorHandlers } from "./setupErrorHandlers.js";

export const serverSetup = async (app: Express) => {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(cors());

  app.use("/", healthRouter);
  app.use("/api", apiVersion);
  app.use("/api/v1", v1Router);
  setupErrorHandlers(app);

  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server is listening on port ${process.env.PORT}`);
  });

  return server;
};
