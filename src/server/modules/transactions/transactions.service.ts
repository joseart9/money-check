import prisma from "@/db/prisma.service";
import { Prisma } from "@/generated/prisma/client";

export class TransactionsService {

  async createTransaction(data: Prisma.TransactionCreateInput) {
    return prisma.transaction.create({
      data,
    });
  }

  async getTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}