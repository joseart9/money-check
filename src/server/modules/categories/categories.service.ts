import prisma from "@/db/prisma.service";

export class CategoriesService {
  async list(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });
  }

  async create(userId: string, input: { name: string; type: "INCOME" | "EXPENSE"; description?: string }) {
    return prisma.category.create({
      data: {
        userId,
        name: input.name,
        type: input.type,
        description: input.description?.trim().length ? input.description.trim() : undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    return prisma.category.delete({
      where: { id, userId },
    });
  }
}

