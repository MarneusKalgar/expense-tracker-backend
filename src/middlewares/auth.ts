import { NextFunction, Response } from "express";

import { tokenService } from "@/services/index.js";
import { AuthError } from "@/utils/index.js";

export const authenticate = async (req: RequestWithPayload, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = tokenService.verifyAccessToken(token!);

    req.user = { email: decoded.email as string, userId: decoded.userId as string };

    next();
  } catch (error) {
    next(error);
  }
};
