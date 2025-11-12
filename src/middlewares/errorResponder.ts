import { Request, Response } from "express";

import { HttpStatusCodes } from "@/constants/index.js";
import { BaseError } from "@/utils/index.js";

export const errorResponder = (error: BaseError, req: Request, res: Response) => {
  const { httpCode, message } = error;
  const defaultHttpCode = httpCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR;

  console.log(error);

  res.status(defaultHttpCode).json({
    code: defaultHttpCode,
    error: true,
    message,
    status: HttpStatusCodes[defaultHttpCode],
  });
};
