"use client";

import { useState } from "react";
import { resetPassword } from "@/app/auth/actions";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm p-8 bg-card border border-white/[0.06] rounded-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-black tracking-tighter text-foreground">
            BY<span className="text-primary">.</span>FUST
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Recuperar senha
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-sm text-emerald-400 bg-emerald-500/10 rounded-lg p-4 mb-6">
              E-mail de recuperação enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <Link href="/login" className="text-sm text-primary hover:underline font-medium">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs text-muted-foreground block mb-1">E-mail</label>
              <input
                id="email" name="email" type="email" required disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                placeholder="seu@email.com"
              />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2.5">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-black font-bold text-sm transition-all hover:brightness-110 disabled:opacity-50 active:scale-[0.98]">
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline font-medium">Voltar ao login</Link>
        </div>
      </div>
    </main>
  );
}
