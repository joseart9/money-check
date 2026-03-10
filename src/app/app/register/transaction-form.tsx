"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  CategoryType,
  TransactionType,
  Currency,
  Category,
} from "@/generated/prisma/browser";
import { sileo } from "sileo";


type BankAccount = {
  id: string;
  name: string;
  lastDigits: string;
  currency: Currency;
};

type FormValues = {
  type: TransactionType;
  currency: Currency;
  categoryId?: string;
  bankAccountId?: string;
  amount: string;
  description?: string;
};

type Props = {
  categories: Partial<Category>[];
  bankAccounts: Partial<BankAccount>[];
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function TransactionForm({
  categories,
  bankAccounts,
  onSubmit,
  isSubmitting,
}: Props) {
  const [type, setType] = useState<FormValues["type"]>(TransactionType.EXPENSE);
  const [currency, setCurrency] = useState<FormValues["currency"]>(Currency.MXN);
  const [categoryId, setCategoryId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const filteredCategories = categories.filter(
    (c) => c.type === type,
  );
  const hasCategories = filteredCategories.length > 0;
  const hasBankAccounts = bankAccounts.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: FormValues = {
      type,
      currency,
      categoryId: categoryId || undefined,
      bankAccountId: bankAccountId || undefined,
      amount,
      description: description.trim().length ? description : undefined,
    };

    void sileo.promise(onSubmit(payload), {
      loading: { title: "Guardando", description: "Por favor espera" },
      success: { title: "Exitoso", description: "La transacción se ha registrado correctamente" },
      error: { title: "Error", description: "No se pudo guardar la transacción" },
    });

    setAmount("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        aria-label="Tipo"
        value={type}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setType(e.target.value as TransactionType)
        }
      >
        <option value={TransactionType.INCOME}>Ingreso</option>
        <option value={TransactionType.EXPENSE}>Gasto</option>
      </Select>

      <Select
        aria-label="Moneda"
        value={currency}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setCurrency(e.target.value as Currency)
        }
      >
        <option value={Currency.MXN}>MXN</option>
        <option value={Currency.USD}>USD</option>
      </Select>

      {hasCategories && (
        <Select
          aria-label="Categoría"
          value={categoryId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setCategoryId(e.target.value)
          }
        >
          <option value="">Seleccionar categoría</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </Select>
      )}

      {hasBankAccounts && (
        <Select
          aria-label="Cuenta"
          value={bankAccountId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setBankAccountId(e.target.value)
          }
        >
          <option value="">Seleccionar cuenta</option>
          {bankAccounts.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name} ••••{b.lastDigits} ({b.currency})
            </option>
          ))}
        </Select>
      )}

      <Input
        id="amount"
        name="amount"
        aria-label="Monto"
        inputMode="decimal"
        placeholder="Monto"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-11 rounded-xl"
      />

      <Input
        id="description"
        name="description"
        aria-label="Descripción"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-11 rounded-xl"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl"
        size="lg"
      >
        {isSubmitting ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}

