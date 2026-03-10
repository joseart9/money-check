import { BankAccountsService } from "./bank-accounts.service";

export type BankAccountDTO = {
  id: string;
  name: string;
  lastDigits: string;
  currency: "USD" | "MXN";
  createdAt: string;
};

export async function listBankAccounts(userId: string): Promise<BankAccountDTO[]> {
  const service = new BankAccountsService();
  const rows = await service.list(userId);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    lastDigits: r.lastDigits,
    currency: r.currency,
    createdAt: r.createdAt.toISOString(),
  }));
}

export type CreateBankAccountInput = {
  name: string;
  lastDigits: string;
  currency: "USD" | "MXN";
};

export async function createBankAccount(userId: string, input: CreateBankAccountInput) {
  const name = input.name.trim();
  const lastDigits = input.lastDigits.trim();
  const currency = input.currency === "USD" ? "USD" : "MXN";

  if (!name) throw new Error("Name required");
  if (!/^\d{4}$/.test(lastDigits)) throw new Error("Last digits must be 4 numbers");

  const service = new BankAccountsService();
  return service.create(userId, { name, lastDigits, currency });
}

export async function deleteBankAccount(userId: string, id: string) {
  const service = new BankAccountsService();
  return service.remove(userId, id);
}

