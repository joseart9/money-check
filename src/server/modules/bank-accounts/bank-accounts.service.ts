import prisma from "@/db/prisma.service";

export class BankAccountsService {
  async list(userId: string) {
    return prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        lastDigits: true,
        currency: true,
        createdAt: true,
      },
    });
  }

  async create(userId: string, input: { name: string; lastDigits: string; currency: "USD" | "MXN" }) {
    return prisma.bankAccount.create({
      data: {
        userId,
        name: input.name,
        lastDigits: input.lastDigits,
        currency: input.currency,
      },
    });
  }

  async remove(userId: string, id: string) {
    return prisma.bankAccount.delete({
      where: { id, userId },
    });
  }
}

