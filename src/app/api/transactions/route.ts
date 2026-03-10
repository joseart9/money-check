import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  createTransaction,
  deleteTransaction,
  getTransactionMeta,
  listTransactions,
  updateTransaction,
} from "@/server/modules/transactions/transactions.controller";

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}

export async function GET() {
  try {
    const userId = await requireUserId();
    const [meta, transactions] = await Promise.all([
      getTransactionMeta(userId),
      listTransactions(userId),
    ]);
    return NextResponse.json({ meta, transactions });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = (await req.json()) as {
      amount: number | string;
      currency?: "USD" | "MXN" | string;
      type?: "INCOME" | "EXPENSE" | string;
      description?: string;
      categoryId?: string;
      bankAccountId?: string;
    };

    const amount = typeof body.amount === "string" ? Number(body.amount) : body.amount;
    if (!Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const currency = body.currency === "USD" ? "USD" : "MXN";
    const type = body.type === "EXPENSE" ? "EXPENSE" : "INCOME";

    const created = await createTransaction(userId, {
      amount,
      currency,
      type,
      description: body.description,
      categoryId: body.categoryId || undefined,
      bankAccountId: body.bankAccountId || undefined,
    });

    return NextResponse.json({ transaction: created }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await requireUserId();
    const body = (await req.json()) as {
      id: string;
      amount?: number;
      currency?: "USD" | "MXN";
      type?: "INCOME" | "EXPENSE";
      description?: string;
      categoryId?: string | null;
      bankAccountId?: string | null;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await updateTransaction(userId, {
      id: body.id,
      amount: body.amount,
      currency: body.currency,
      type: body.type,
      description: body.description,
      categoryId: body.categoryId ?? undefined,
      bankAccountId: body.bankAccountId ?? undefined,
    });

    return NextResponse.json({ transaction: updated });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await requireUserId();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await deleteTransaction(userId, id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
