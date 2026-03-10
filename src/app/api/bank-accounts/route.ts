import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  createBankAccount,
  deleteBankAccount,
  listBankAccounts,
} from "@/server/modules/bank-accounts/bank-accounts.controller";

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function GET() {
  try {
    const userId = await requireUserId();
    const bankAccounts = await listBankAccounts(userId);
    return NextResponse.json({ bankAccounts });
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
      name?: string;
      lastDigits?: string;
      currency?: "USD" | "MXN" | string;
    };

    const created = await createBankAccount(userId, {
      name: String(body.name ?? ""),
      lastDigits: String(body.lastDigits ?? ""),
      currency: body.currency === "USD" ? "USD" : "MXN",
    });

    return NextResponse.json({ bankAccount: created }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await requireUserId();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await deleteBankAccount(userId, id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

