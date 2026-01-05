import { dataSource } from "@/db/data-source.js";
import { Transaction } from "@/db/entity/index.js";
import { CreateTransactionInput, UpdateTransactionInput } from "@/schemas/index.js";
import { getPagination, UpdatedError } from "@/utils/index.js";

interface Filters {
  accountId?: string;
  categoryId?: string;
  currencyId?: string;
  page?: number;
  perPage?: number;
  search?: string;
}

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

  async getAllTransactions(userId: string, filters: Filters) {
    const repository = dataSource.getRepository(Transaction);
    const { accountId, categoryId, currencyId, page, perPage, search } = filters;

    const queryBuilder = repository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.account", "account")
      .leftJoinAndSelect("transaction.category", "category")
      .leftJoinAndSelect("account.currency", "currency")
      .where("transaction.userId = :userId", { userId })
      .select([
        "transaction",
        "account.id",
        "account.name",
        "category.id",
        "category.name",
        "currency.id",
        "currency.name",
      ])
      .orderBy("transaction.date", "DESC");

    if (search) {
      queryBuilder.andWhere("transaction.name ILIKE :search", { search: `%${search}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere("transaction.categoryId = :categoryId", { categoryId });
    }

    if (currencyId) {
      queryBuilder.andWhere("account.currencyId = :currencyId", { currencyId });
    }

    if (accountId) {
      queryBuilder.andWhere("transaction.accountId = :accountId", { accountId });
    }

    const { currentPage, limit, offset } = getPagination({ page, perPage });
    queryBuilder.skip(offset).take(limit);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      currentPage: currentPage,
      perPage: limit,
      total,
      transactions,
    };
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
    const transaction = await repository.findOneBy({ id: transactionId, userId });

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

    const updatedTransaction = await repository.findOneBy({ id: transactionId, userId });
    return updatedTransaction;
  }
}

export const transactionService = new TransactionService();
