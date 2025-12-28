import { Express, NextFunction, Request, Response } from "express";

import { logger } from "@/configs/logger.js";
import { errorLogger, errorResponder } from "@/middlewares/index.js";
import { NotFoundError } from "@/utils/index.js";

export const setupErrorHandlers = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    next(new NotFoundError("Resource not found"));
  });

  app.use(errorLogger);
  app.use(errorResponder);
};
