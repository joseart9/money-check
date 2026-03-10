import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  createCategory,
  deleteCategory,
  listCategories,
} from "@/server/modules/categories/categories.controller";

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
    const categories = await listCategories(userId);
    return NextResponse.json({ categories });
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
      type?: "INCOME" | "EXPENSE" | string;
      description?: string;
    };

    const created = await createCategory(userId, {
      name: String(body.name ?? ""),
      type: body.type === "EXPENSE" ? "EXPENSE" : "INCOME",
      description: body.description ? String(body.description) : undefined,
    });

    return NextResponse.json({ category: created }, { status: 201 });
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
    await deleteCategory(userId, id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

