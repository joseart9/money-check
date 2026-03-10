"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createCategory } from "./settings.api";
import type { CategoryType } from "./types";
import { sileo } from "sileo";

type Props = {
  onDone?: () => void;
};

export function CategoryForm({ onDone }: Props) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      return createCategory({
        name,
        type,
        description: description.trim().length ? description : undefined,
      });
    },
    onSuccess: async () => {
      setName("");
      setDescription("");
      setError(null);
      await qc.invalidateQueries({ queryKey: ["settings:categories"] });
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "No se pudo guardar.";
      setError(message);
    },
  }); 

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Close the drawer first for snappy UX
    onDone?.();

    // Then run the mutation wrapped in sileo.promise for notifications
    void sileo.promise(mutation.mutateAsync(), {
      loading: { title: "Guardando categoría..." },
      success: { title: "Categoría registrada correctamente" },
      error: { title: "No se pudo guardar" },
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la categoría"
        className="h-11 rounded-2xl"
        autoComplete="off"
        aria-label="Nombre de la categoría"
      />

      <Select
        value={type}
        onChange={(e) => setType(e.target.value as CategoryType)}
        aria-label="Tipo"
      >
        <option value="EXPENSE">Gasto</option>
        <option value="INCOME">Ingreso</option>
      </Select>

      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)"
        className="h-11 rounded-2xl"
        autoComplete="off"
        aria-label="Descripción"
      />

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

