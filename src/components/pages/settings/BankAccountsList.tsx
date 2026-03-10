"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteBankAccount, fetchBankAccounts } from "./settings.api";

export function BankAccountsList() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["settings:bank-accounts"],
    queryFn: fetchBankAccounts,
  });

  const del = useMutation({
    mutationFn: async (id: string) => deleteBankAccount(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["settings:bank-accounts"] });
    },
  });

  if (query.isLoading) {
    return <p className="text-base text-muted-foreground">Cargando...</p>;
  }

  if (query.isError) {
    return (
      <p className="text-base text-red-500">No se pudieron cargar las cuentas.</p>
    );
  }

  if (query.data?.length === 0) {
    return (
      <p className="text-base text-muted-foreground">
        Aún no tienes cuentas registradas.
      </p>
    );
  }

  return (
    <div className="space-y-3 h-full overflow-y-auto flex flex-col">
      {query.data?.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm bg-accent/50 dark:bg-accent/50"
        >
          <div className="min-w-0">
            <p className="truncate text-base text-accent-foreground font-medium">{a.name}</p>
            <p className="mt-1 truncate text-base text-accent-foreground/50">
              ••••{a.lastDigits} · {a.currency}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="rounded-2xl"
            onClick={() => del.mutate(a.id)}
            disabled={del.isPending}
            aria-label="Eliminar cuenta"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

