import { Express, NextFunction, Request, Response } from "express";

import { errorLogger, errorResponder } from "@/middlewares/index.js";
import { NotFoundError } from "@/utils/index.js";

export const setupErrorHandlers = (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError("Not found"));
  });

  app.use(errorLogger);
  app.use(errorResponder);
};
