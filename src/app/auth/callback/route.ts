import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { absoluteReturnUrl } from "@/lib/returnUrl";

/**
 * Volta do e-mail de confirmacao e do link de recuperacao (M-18).
 *
 * O `next` da query ia CRU para o NextResponse.redirect, embaixo de um
 * comentario que prometia "only allow relative paths". Nao prometia coisa
 * nenhuma: o prefixo de origem nao protege, porque "@evil.com" colado em
 * "https://byfust.com.br" vira "https://byfust.com.br@evil.com", cujo host o
 * parser le como evil.com (e "byfust.com.br" como nome de usuario). Agora o
 * destino passa pelo mesmo resolveReturnUrl que o login e o formulario usam.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = type === "recovery" ? "/redefinir-senha" : searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const base = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(absoluteReturnUrl(base, next));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
