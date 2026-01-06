import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

import { ValidationError } from "@/utils/errors.js";
import { extractZodErrors } from "@/utils/index.js";

type RequestFields = "body" | "params" | "query";

const messagePrefixMap: Record<RequestFields, string> = {
  body: "Invalid request body",
  params: "Invalid URL parameters",
  query: "Invalid query parameters",
};

export const validateRequest = (schema: ZodType, field: RequestFields = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[field]);

      if (!result.success) {
        const message = extractZodErrors(result.error, messagePrefixMap[field]);
        throw new ValidationError(message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateRequestBody = (schema: ZodType) => validateRequest(schema, "body");
export const validateRequestParams = (schema: ZodType) => validateRequest(schema, "params");
export const validateRequestQuery = (schema: ZodType) => validateRequest(schema, "query");
