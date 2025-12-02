import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

import { ValidationError } from "@/utils/errors.js";

export const validateRequestBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const message =
          result.error.issues
            ?.map(el => `Field: ${el.path.join(".")}, Error: ${el.message}`)
            .join(", ") || "Invalid request body";
        throw new ValidationError(message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
