import express from "express";

import { loginUser, logoutUser, refreshAccessToken, signupUser } from "@/controllers/index.js";
import { asyncWrapper, rateLimiters, validateRequestBody } from "@/middlewares/index.js";
import { loginInputSchema, signupInputSchema } from "@/schemas/auth.js";

export const authRouter = express.Router();

authRouter.post(
  "/signup",
  rateLimiters.auth,
  validateRequestBody(signupInputSchema),
  asyncWrapper(signupUser),
);
authRouter.post(
  "/login",
  rateLimiters.auth,
  validateRequestBody(loginInputSchema),
  asyncWrapper(loginUser),
);
authRouter.post("/logout", rateLimiters.api, asyncWrapper(logoutUser));
authRouter.post("/refresh-token", rateLimiters.auth, asyncWrapper(refreshAccessToken));
