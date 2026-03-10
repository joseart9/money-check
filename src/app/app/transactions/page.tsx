"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { TransactionSkeleton } from "@/components/pages/transactions/skeleton";
import { sileo } from "sileo";
import { formatMoney, formatDate } from "@/lib/utils";

type TransactionsResponse = {
  meta: {
    categories: Array<{ id: string; name: string; type: "INCOME" | "EXPENSE" }>;
    bankAccounts: Array<{
      id: string;
      name: string;
      lastDigits: string;
      currency: "USD" | "MXN";
    }>;
  };
  transactions: Array<{
    id: string;
    amount: number;
    currency: "USD" | "MXN";
    type: "INCOME" | "EXPENSE";
    description: string | null;
    createdAt: string;
    categoryId: string | null;
    bankAccountId: string | null;
  }>;
};

export default function TransactionsPage() {
  const query = useQuery<TransactionsResponse>({
    queryKey: ["transactions:bootstrap"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<TransactionsResponse>("/api/transactions");
      return data;
    },
  });

  const data = query.data;

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of data?.meta.categories ?? []) {
      map.set(c.id, c.name);
    }
    return map;
  }, [data?.meta.categories]);

  const bankMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of data?.meta.bankAccounts ?? []) {
      map.set(b.id, `${b.name} ••••${b.lastDigits}`);
    }
    return map;
  }, [data?.meta.bankAccounts]);

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-sm">
        <header className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Transacciones
          </h1>
        </header>

        {query.isLoading ? (
          <TransactionSkeleton />
        ) : query.isError ? (
          sileo.error({ title: "No se pudieron cargar las transacciones" })
        ) : !data || data.transactions.length === 0 ? (
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-base font-medium">Aún no hay movimientos</p>
            <p className="mt-1 text-base text-muted-foreground">
              Crea tu primera transacción desde “+”.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-24">
            {data.transactions.map((t) => {
              const isIncome = t.type === "INCOME";
              const sign = isIncome ? "" : "-";
              const category = t.categoryId ? categoryMap.get(t.categoryId) : null;
              const bank = t.bankAccountId ? bankMap.get(t.bankAccountId) : null;
              const subtitle = [category, bank, formatDate(t.createdAt)]
                .filter(Boolean)
                .join(" · ");

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm bg-accent/50 dark:bg-accent/50"
                >

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-base text-accent-foreground font-medium">
                        {t.description?.trim().length ? t.description : "Sin descripción"}
                      </p>
                      <p className={`shrink-0 text-xl text-accent-foreground font-semibold`}>
                        {sign}
                        {formatMoney(Math.abs(t.amount), t.currency)}
                      </p>
                    </div>
                    {subtitle.length > 0 && (
                      <p className="mt-1 truncate text-base text-accent-foreground/50">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}