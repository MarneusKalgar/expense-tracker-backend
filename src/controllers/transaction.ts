import { Request, Response } from "express";

import { transactionService } from "@/services/index.js";

export const getAllTransactions = async (req: Request, res: Response) => {
  const { userId } = req.user!;

  const data = await transactionService.getAllTransactions(userId);
  res.status(200).json({
    data,
    message: "Fetched all transactions",
    success: true,
  });
};

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user!;

  const data = await transactionService.getTransaction(id!, userId);
  res.status(200).json({
    data,
    message: "Fetched transaction successfully",
    success: true,
  });
};

export const createTransaction = async (req: Request, res: Response) => {
  const { userId } = req.user!;

  const data = await transactionService.createTransaction(userId, req.body);

  res.status(201).json({
    data,
    message: "Transaction created successfully",
    success: true,
  });
};

export const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user!;

  const data = await transactionService.updateTransaction(id!, userId, req.body);

  res.status(200).json({
    data,
    message: "Transaction updated successfully",
    success: true,
  });
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  await transactionService.deleteTransaction(id!);

  res.status(200).json({
    message: "Transaction deleted successfully",
    success: true,
  });
};
