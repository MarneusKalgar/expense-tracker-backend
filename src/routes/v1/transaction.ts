import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from "@/controllers/index.js";
import {
  asyncWrapper,
  authenticate,
  validateRequestBody,
  validateRequestParams,
} from "@/middlewares/index.js";
import { createTransactionSchema, paramsSchema, updateTransactionSchema } from "@/schemas/index.js";

export const transactionRouter = express.Router();

transactionRouter.get("/", authenticate, asyncWrapper(getAllTransactions));
transactionRouter.get(
  "/:id",
  authenticate,
  validateRequestParams(paramsSchema),
  asyncWrapper(getTransaction),
);
transactionRouter.post(
  "/",
  authenticate,
  validateRequestBody(createTransactionSchema),
  asyncWrapper(createTransaction),
);
transactionRouter.put(
  "/:id",
  authenticate,
  validateRequestParams(paramsSchema),
  validateRequestBody(updateTransactionSchema),
  asyncWrapper(updateTransaction),
);
transactionRouter.delete(
  "/:id",
  authenticate,
  validateRequestParams(paramsSchema),
  asyncWrapper(deleteTransaction),
);
