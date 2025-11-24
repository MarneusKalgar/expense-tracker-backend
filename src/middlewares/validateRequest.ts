import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

interface ZodErrorMessage {
  code: string;
  expected: string;
  message: string;
  path: (number | string)[];
}

export const validateRequestBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (result.error) {
        const parsed: ZodErrorMessage[] = JSON.parse(result.error as unknown as string);
        const message = parsed?.map(el => el.message).join(", ") || "Invalid request body";

        return res.status(422).json({
          message,
          success: false,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
