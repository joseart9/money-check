export type Currency = "USD" | "MXN";
export type CategoryType = "INCOME" | "EXPENSE";

export type BankAccount = {
  id: string;
  name: string;
  lastDigits: string;
  currency: Currency;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  description: string | null;
  createdAt: string;
};

