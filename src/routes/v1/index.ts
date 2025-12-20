import express from "express";

import { authRouter } from "./auth.js";

export const v1Router = express.Router();

v1Router.use("/auth", authRouter);
