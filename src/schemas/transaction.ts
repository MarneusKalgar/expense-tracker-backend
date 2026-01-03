import z from "zod";

import { TransactionType } from "@/db/entity/index.js";

export const createTransactionSchema = z.object({
  accountId: z.uuid(),
  amount: z.number().positive(),
  categoryId: z.uuid(),
  date: z.coerce.date(),
  name: z.string().min(1).max(100),
  type: z.enum(Object.values(TransactionType)),
});

export const updateTransactionSchema = createTransactionSchema.omit({ type: true }).partial();

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
