// import { logger } from '@/core/logger/logger.js';
import { NextFunction, Request, Response } from "express";

import { BaseError } from "@/utils/index.js";

export const errorLogger = (
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { errorLog } = res.locals;

  if (typeof errorLog === "function") {
    errorLog("HttpError", error);
  } else {
    // logger.error('HttpError', error);
  }

  next(error);
};
