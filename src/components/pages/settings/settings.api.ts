import { apiClient } from "@/lib/api-client";
import type { BankAccount, Category, CategoryType, Currency } from "./types";

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  const { data } = await apiClient.get<{ bankAccounts: BankAccount[] }>(
    "/api/bank-accounts",
  );
  return data.bankAccounts;
}

export async function createBankAccount(input: {
  name: string;
  lastDigits: string;
  currency: Currency;
}) {
  const { data } = await apiClient.post("/api/bank-accounts", input);
  return data;
}

export async function deleteBankAccount(id: string) {
  const { data } = await apiClient.delete("/api/bank-accounts", {
    params: { id },
  });
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ categories: Category[] }>(
    "/api/categories",
  );
  return data.categories;
}

export async function createCategory(input: {
  name: string;
  type: CategoryType;
  description?: string;
}) {
  const { data } = await apiClient.post("/api/categories", input);
  return data;
}

export async function deleteCategory(id: string) {
  const { data } = await apiClient.delete("/api/categories", { params: { id } });
  return data;
}

