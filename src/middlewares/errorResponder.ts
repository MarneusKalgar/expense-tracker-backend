import { NextFunction, Response } from "express";

import { env } from "@/configs/index.js";
import { HttpStatusCodes, HttpStatusMessages } from "@/constants/index.js";
import { BaseError } from "@/utils/index.js";

interface ErrorResponse {
  error: boolean;
  message: string;
  requestId?: string;
  stack?: string;
  status: string;
}

export const errorResponder = (
  error: BaseError,
  req: RequestWithPayload,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const { httpCode, message } = error;

  const defaultHttpCode = httpCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const responseMessage =
    env.nodeEnv === "production" && defaultHttpCode === 500 ? "Internal server error" : message;

  const response: ErrorResponse = {
    error: true,
    message: responseMessage,
    status: HttpStatusMessages[HttpStatusCodes[defaultHttpCode] as keyof typeof HttpStatusMessages],
  };

  if (req.id) {
    response.requestId = req.id;
  }

  if (env.nodeEnv === "development" && error.stack) {
    response.stack = error.stack;
  }

  res.status(defaultHttpCode).json(response);
};
