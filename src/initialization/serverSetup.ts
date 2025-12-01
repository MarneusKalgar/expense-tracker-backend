import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import httpContext from "express-http-context";

import { router } from "@/routes/index.js";

import { setupErrorHandlers } from "./setupErrorHandlers.js";

export const serverSetup = async (app: Express) => {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(cors());
  app.use(httpContext.middleware);

  app.use("/api/v1", router);

  setupErrorHandlers(app);

  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
};
