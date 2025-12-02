import express from "express";

import { loginUser, logoutUser, refreshAccessToken, signupUser } from "@/controllers/index.js";
import { asyncWrapper, validateRequestBody } from "@/middlewares/index.js";
import { LoginInputSchema, SignupInputSchema } from "@/schemas/auth.js";

export const authRouter = express.Router();

authRouter.post("/signup", validateRequestBody(SignupInputSchema), asyncWrapper(signupUser));
authRouter.post("/login", validateRequestBody(LoginInputSchema), asyncWrapper(loginUser));
authRouter.post("/logout", asyncWrapper(logoutUser));
authRouter.post("/refresh-token", asyncWrapper(refreshAccessToken));
