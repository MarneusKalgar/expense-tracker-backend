import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from "@/controllers/index.js";
import { asyncWrapper, authenticate, validateRequestBody } from "@/middlewares/index.js";
import { createTransactionSchema, updateTransactionSchema } from "@/schemas/index.js";

export const transactionRouter = express.Router();

transactionRouter.get("/", authenticate, asyncWrapper(getAllTransactions));
transactionRouter.get("/:id", authenticate, asyncWrapper(getTransaction));
transactionRouter.post(
  "/",
  authenticate,
  validateRequestBody(createTransactionSchema),
  asyncWrapper(createTransaction),
);
transactionRouter.put(
  "/:id",
  authenticate,
  validateRequestBody(updateTransactionSchema),
  asyncWrapper(updateTransaction),
);
transactionRouter.delete("/:id", authenticate, asyncWrapper(deleteTransaction));
