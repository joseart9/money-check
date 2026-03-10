 "use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { TransactionForm } from "./transaction-form";
import { Category, BankAccount, Currency, TransactionType } from "@/generated/prisma/browser";

type MetaResponse = {
  meta: {
    categories: Array<Partial<Category>>;
    bankAccounts: Array<Partial<BankAccount>>;
  };
  transactions: unknown[];
};

type CreateTransactionBody = {
  amount: number;
  currency: Currency;
  type: TransactionType;
  description?: string;
  categoryId?: string;
  bankAccountId?: string;
};

export default function RegisterTransactionPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const metaQuery = useQuery({
    queryKey: ["transactions:bootstrap"],
    queryFn: async () => {
      const { data } = await apiClient.get<MetaResponse>("/api/transactions");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: CreateTransactionBody) => {
      const { data } = await apiClient.post("/api/transactions", body);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["transactions:bootstrap"] });
      router.push("/app/transactions");
    },
  });

  const categories = useMemo(
    () => metaQuery.data?.meta.categories ?? [],
    [metaQuery.data],
  );
  const bankAccounts = useMemo(
    () => metaQuery.data?.meta.bankAccounts ?? [],
    [metaQuery.data],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="w-full flex justify-center flex-col h-full">

        {metaQuery.isLoading ? (
          <div className="text-base text-muted-foreground">Cargando...</div>
        ) : metaQuery.isError ? (
          <div className="text-base text-red-500">
            No se pudo cargar la información.
          </div>
        ) : (
          <TransactionForm
            categories={categories}
            bankAccounts={bankAccounts}
            isSubmitting={createMutation.isPending}
            onSubmit={async (values) => {
              const amount = Number(values.amount.replace(",", "."));
              if (!Number.isFinite(amount)) return;

              await createMutation.mutateAsync({
                amount,
                currency: values.currency,
                type: values.type,
                description: values.description,
                categoryId: values.categoryId,
                bankAccountId: values.bankAccountId,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

