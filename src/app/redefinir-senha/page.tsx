"use client";

import { useState } from "react";
import { updatePassword } from "@/app/auth/actions";
import Link from "next/link";

export default function RedefinirSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const pw = formData.get("password") as string;
    const cpw = formData.get("confirmPassword") as string;

    if (pw !== cpw) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(formData);

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
            Redefinir senha
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-sm text-emerald-400 bg-emerald-500/10 rounded-lg p-4 mb-6">
              Senha redefinida com sucesso!
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition-all hover:brightness-110">
              Fazer login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="text-xs text-muted-foreground block mb-1">Nova senha</label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? "text" : "password"}
                  required minLength={6} disabled={loading}
                  className="w-full px-3 py-2.5 pr-11 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-xs text-muted-foreground block mb-1">Confirmar nova senha</label>
              <input
                id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"}
                required minLength={6} disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2.5">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-black font-bold text-sm transition-all hover:brightness-110 disabled:opacity-50 active:scale-[0.98]">
              {loading ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
