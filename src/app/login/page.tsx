import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { RETURN_PARAM, resolveReturnUrl } from "@/lib/returnUrl";

/**
 * Login central do BY.FUST (auditoria de go-live, item M-18).
 *
 * Quem chega de um modulo (radier, geotech, pilar) vem com `?next=<destino>`.
 * O AuthForm ja leva o usuario de volta depois de entrar; aqui trata-se do
 * outro caminho, o de quem JA tem sessao no hub: antes ele caia sempre em
 * /painel e o destino se perdia, entao clicar em Entrar no radier com sessao
 * viva deixava a pessoa parada no painel do hub, sem porta de volta.
 *
 * O destino passa pelo mesmo resolveReturnUrl do formulario: caminho do
 * proprio hub ou host de byfust.com.br, nunca redirect aberto.
 */

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const bruto = (await searchParams)[RETURN_PARAM];
    // Parametro repetido ("?next=a&next=b") vira array: vale o primeiro.
    redirect(resolveReturnUrl(Array.isArray(bruto) ? bruto[0] : bruto));
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <AuthForm type="login" />
    </main>
  );
}
