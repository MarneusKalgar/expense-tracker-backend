import { NextFunction, Request, Response } from "express";

import { HttpStatusCodes, HttpStatusMessages } from "@/constants/index.js";
import { BaseError } from "@/utils/index.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorResponder = (
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { httpCode, message } = error;

  const defaultHttpCode = httpCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR;

  console.log(message);

  res.status(defaultHttpCode).json({
    error: true,
    message,
    status: HttpStatusMessages[HttpStatusCodes[defaultHttpCode] as keyof typeof HttpStatusMessages],
  });
};
