import express from "express";

import { authRouter } from "./auth.js";
import { transactionRouter } from "./transaction.js";

export const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/transactions", transactionRouter);
