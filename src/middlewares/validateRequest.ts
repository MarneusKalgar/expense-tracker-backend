import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

import { ValidationError } from "@/utils/errors.js";
import { extractZodErrors } from "@/utils/index.js";

export const validateRequestBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const message = extractZodErrors(result.error, "Invalid request body");
        throw new ValidationError(message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
