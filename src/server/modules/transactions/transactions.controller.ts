import prisma from "@/db/prisma.service";
import { Prisma } from "@/generated/prisma/client";
import { TransactionsService } from "./transactions.service";

export type TransactionMeta = {
  categories: Array<{ id: string; name: string; type: "INCOME" | "EXPENSE" }>;
  bankAccounts: Array<{
    id: string;
    name: string;
    lastDigits: string;
    currency: "USD" | "MXN";
  }>;
};

export type TransactionListItem = {
  id: string;
  amount: number;
  currency: "USD" | "MXN";
  type: "INCOME" | "EXPENSE";
  description: string | null;
  createdAt: string;
  categoryId: string | null;
  bankAccountId: string | null;
};

export async function getTransactionMeta(userId: string): Promise<TransactionMeta> {
  const [categories, bankAccounts] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true },
    }),
    prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, lastDigits: true, currency: true },
    }),
  ]);

  return { categories, bankAccounts };
}

export async function listTransactions(userId: string): Promise<TransactionListItem[]> {
  const service = new TransactionsService();
  const rows = await service.getTransactions(userId);
  return rows.map((t) => ({
    id: t.id,
    amount: t.amount,
    currency: t.currency,
    type: t.type,
    description: t.description ?? null,
    createdAt: t.createdAt.toISOString(),
    categoryId: t.categoryId ?? null,
    bankAccountId: t.bankAccountId ?? null,
  }));
}

export type CreateTransactionInput = {
  amount: number;
  currency: "USD" | "MXN";
  type: "INCOME" | "EXPENSE";
  description?: string;
  categoryId?: string;
  bankAccountId?: string;
};

export async function createTransaction(userId: string, input: CreateTransactionInput) {
  const service = new TransactionsService();

  const data: Prisma.TransactionCreateInput = {
    user: { connect: { id: userId } },
    amount: input.amount,
    currency: input.currency,
    type: input.type,
    description: input.description?.trim().length ? input.description.trim() : undefined,
    category: input.categoryId ? { connect: { id: input.categoryId } } : undefined,
    bankAccount: input.bankAccountId
      ? { connect: { id: input.bankAccountId } }
      : undefined,
  };

  return service.createTransaction(data);
}

export type UpdateTransactionInput = Partial<CreateTransactionInput> & {
  id: string;
};

export async function updateTransaction(userId: string, input: UpdateTransactionInput) {
  return prisma.transaction.update({
    where: { id: input.id, userId },
    data: {
      amount: input.amount,
      currency: input.currency,
      type: input.type,
      description: input.description,
      categoryId: input.categoryId ?? null,
      bankAccountId: input.bankAccountId ?? null,
    },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  return prisma.transaction.delete({
    where: { id, userId },
  });
}

