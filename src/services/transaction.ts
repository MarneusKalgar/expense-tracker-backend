import { dataSource } from "@/db/data-source.js";
import { Transaction } from "@/db/entity/index.js";
import { CreateTransactionInput, UpdateTransactionInput } from "@/schemas/index.js";
import { UpdatedError } from "@/utils/index.js";

class TransactionService {
  async createTransaction(userId: string, transactionData: CreateTransactionInput) {
    const { accountId, amount, categoryId, date, name, type } = transactionData;
    const repository = dataSource.getRepository(Transaction);
    const newTransaction = repository.create({
      accountId,
      amount,
      categoryId,
      date,
      name,
      type,
      userId,
    });
    await repository.save(newTransaction);
    return newTransaction.id;
  }

  async deleteTransaction(transactionId: string) {
    const repository = dataSource.getRepository(Transaction);
    await repository.softDelete(transactionId);
  }

  async getAllTransactions(userId: string) {
    const repository = dataSource.getRepository(Transaction);
    const transactions = await repository.find({
      relations: {
        account: true,
        category: true,
      },
      select: {
        account: { id: true, name: true },
        category: { id: true, name: true },
      },
      where: { userId },
    });
    return transactions;
  }

  async getTransaction(transactionId: string, userId: string) {
    const repository = dataSource.getRepository(Transaction);
    const transaction = await repository.findOne({
      relations: {
        account: true,
        category: true,
      },
      select: {
        account: { id: true, name: true },
        category: { id: true, name: true },
      },
      where: { id: transactionId, userId },
    });

    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    userId: string,
    transactionData: UpdateTransactionInput,
  ) {
    const { accountId, amount, categoryId, date, name } = transactionData;
    const repository = dataSource.getRepository(Transaction);
    const query = repository.findOneBy({ id: transactionId, userId });
    const transaction = await query;
    if (!transaction) {
      throw new UpdatedError("Transaction not found");
    }

    await repository.update(transactionId, {
      ...(accountId && { accountId }),
      ...(amount && { amount }),
      ...(categoryId && { categoryId }),
      ...(date && { date }),
      ...(name && { name }),
    });

    const updatedTransaction = await query;
    return updatedTransaction;
  }
}

export const transactionService = new TransactionService();
