import express from "express";

import { loginUser, logoutUser, refreshAccessToken, signupUser } from "@/controllers/index.js";
import { asyncWrapper, validateRequestBody } from "@/middlewares/index.js";
import { loginInputSchema, signupInputSchema } from "@/schemas/auth.js";

export const authRouter = express.Router();

authRouter.post("/signup", validateRequestBody(signupInputSchema), asyncWrapper(signupUser));
authRouter.post("/login", validateRequestBody(loginInputSchema), asyncWrapper(loginUser));
authRouter.post("/logout", asyncWrapper(logoutUser));
authRouter.post("/refresh-token", asyncWrapper(refreshAccessToken));
