"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/auth/actions";
import { RETURN_PARAM, returnUrlFromSearch } from "@/lib/returnUrl";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLogin = type === "login";

  /*
   * Destino de volta (M-18). Quem chega de um modulo vem com `?next=...`, e o
   * destino se perdia em tudo que nao era o login bem sucedido: os links
   * "Cadastre-se" e "Esqueci minha senha" eram fixos, e o cadastro nao
   * guardava o destino em lugar nenhum. Como o radier manda todo usuario sem
   * conta para `${hub}/login?next=...`, esse e o caminho do primeiro acesso de
   * qualquer beta tester.
   *
   * Lido no efeito, e nao no render, para o HTML do servidor bater com o do
   * cliente (a query so existe no navegador).
   */
  const [destino, setDestino] = useState<string | null>(null);
  useEffect(() => {
    const valido = returnUrlFromSearch(window.location.search, "");
    setDestino(valido || null);
  }, []);

  const comDestino = (caminho: string): string =>
    destino ? `${caminho}?${RETURN_PARAM}=${encodeURIComponent(destino)}` : caminho;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (!isLogin) {
      const pw = formData.get("password") as string;
      const cpw = formData.get("confirmPassword") as string;
      if (pw !== cpw) {
        setError("As senhas não conferem.");
        setLoading(false);
        return;
      }
    }

    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(isLogin ? "Login realizado." : "Conta criada! Verifique seu e-mail.");
        if (isLogin) {
          /*
           * Volta para onde o usuario estava (auditoria M-18): quem chega de
           * um modulo vem com `?next=<destino>`, validado contra o dominio
           * byfust.com.br. Sem destino, ou com destino de fora, vai ao painel.
           * Redirect duro de proposito, para nao brigar com o revalidatePath.
           */
          window.location.href = returnUrlFromSearch(window.location.search);
        } else {
          setLoading(false);
          // Stay on page: user needs to verify email
        }
      }
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm p-8 bg-card border border-white/[0.06] rounded-xl">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-foreground">
          BY<span className="text-primary">.</span>FUST
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          {isLogin ? "Faça login na sua conta" : "Crie sua conta BY.FUST"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            {/* O e-mail de confirmacao volta para este destino (M-18). */}
            <input type="hidden" name={RETURN_PARAM} value={destino ?? ""} />
            <div>
              <label htmlFor="fullName" className="text-xs text-muted-foreground block mb-1">Nome completo</label>
              <input
                id="fullName" name="fullName" type="text" required disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-xs text-muted-foreground block mb-1">Telefone / WhatsApp</label>
              <input
                id="phone" name="phone" type="tel" required disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                placeholder="(11) 99999-9999"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="text-xs text-muted-foreground block mb-1">E-mail</label>
          <input
            id="email" name="email" type="email" required disabled={loading}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs text-muted-foreground block mb-1">Senha</label>
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

        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="text-xs text-muted-foreground block mb-1">Confirmar senha</label>
            <input
              id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"}
              required minLength={6} disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            />
          </div>
        )}

        {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2.5">{error}</p>}
        {success && <p className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg p-2.5">{success}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-black font-bold text-sm transition-all hover:brightness-110 disabled:opacity-50 active:scale-[0.98]">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Aguarde...
            </span>
          ) : isLogin ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
        {isLogin && (
          <div>
            <Link href={comDestino("/recuperar-senha")} className="text-muted-foreground hover:text-foreground hover:underline text-xs transition-colors">
              Esqueci minha senha
            </Link>
          </div>
        )}
        <div>
          {isLogin ? (
            <>Não tem conta? <Link href={comDestino("/cadastro")} className="text-primary hover:underline font-medium">Cadastre-se</Link></>
          ) : (
            <>Já tem conta? <Link href={comDestino("/login")} className="text-primary hover:underline font-medium">Fazer login</Link></>
          )}
        </div>
      </div>
    </div>
  );
}
