"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createBankAccount } from "./settings.api";
import type { Currency } from "./types";
import { sileo } from "sileo";

type Props = {
  onDone?: () => void;
};

export function BankAccountForm({ onDone }: Props) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [lastDigits, setLastDigits] = useState("");
  const [currency, setCurrency] = useState<Currency>("MXN");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      return createBankAccount({
        name,
        lastDigits,
        currency,
      });
    },
    onSuccess: async () => {
      setName("");
      setLastDigits("");
      setError(null);
      await qc.invalidateQueries({ queryKey: ["settings:bank-accounts"] });
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "No se pudo guardar.";
      setError(message);
    },
  });

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!/^\d{4}$/.test(lastDigits.trim())) return false;
    return true;
  }, [name, lastDigits]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    onDone?.();

    // Then run the mutation with sileo notifications
    void sileo.promise(mutation.mutateAsync(), {
      loading: { title: "Guardando cuenta..." },
      success: { title: "Cuenta registrada correctamente" },
      error: { title: "No se pudo guardar" },
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la cuenta"
        className="h-11 rounded-2xl"
        autoComplete="off"
        aria-label="Nombre de la cuenta"
      />

      <div className="flex gap-3">
        <Input
          value={lastDigits}
          onChange={(e) => setLastDigits(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
          placeholder="Últimos 4 dígitos"
          className="h-11 flex-1 rounded-2xl"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Últimos 4 dígitos"
        />

        <div className="w-28">
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Moneda"
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

      {error && (
        <p className="text-base text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-2xl"
        disabled={!canSubmit || mutation.isPending}
      >
        {mutation.isPending ? "Guardando..." : "Agregar"}
      </Button>
    </form>
  );
}

