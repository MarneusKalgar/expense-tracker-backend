import express from "express";

import { loginUser, signupUser } from "@/controllers/index.js";
import { asyncWrapper } from "@/middlewares/asyncWrapper.js";

export const authRouter = express.Router();

authRouter.post("/signup", asyncWrapper(signupUser));
authRouter.post("/login", asyncWrapper(loginUser));
