import { CategoriesService } from "./categories.service";

export type CategoryDTO = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  createdAt: string;
};

export async function listCategories(userId: string): Promise<CategoryDTO[]> {
  const service = new CategoriesService();
  const rows = await service.list(userId);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    description: r.description ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}

export type CreateCategoryInput = {
  name: string;
  type: "INCOME" | "EXPENSE";
  description?: string;
};

export async function createCategory(userId: string, input: CreateCategoryInput) {
  const name = input.name.trim();
  const type = input.type === "EXPENSE" ? "EXPENSE" : "INCOME";
  const description = input.description?.trim();

  if (!name) throw new Error("Name required");

  const service = new CategoriesService();
  return service.create(userId, { name, type, description });
}

export async function deleteCategory(userId: string, id: string) {
  const service = new CategoriesService();
  return service.remove(userId, id);
}

