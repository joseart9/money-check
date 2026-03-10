"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      router.push("/app");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <main className="flex flex-1 flex-col px-5 pt-10 pb-6">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-between">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-muted-foreground">
              Inicia sesión para empezar a rastrear tu money.
            </p>
          </header>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="h-11 rounded-xl"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl"
              size="lg"
            >
              {loading ? "Iniciando sesión..." : "Continuar"}
            </Button>
          </form>

          <footer className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground pb-4">
            <span>No tienes una cuenta?</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push("/sign-up")}
              className="h-auto p-0 text-sm font-medium"
            >
              Regístrate
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}