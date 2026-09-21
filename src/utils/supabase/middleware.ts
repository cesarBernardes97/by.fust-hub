import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { RETURN_PARAM, resolveReturnUrl } from "@/lib/returnUrl";
import { COOKIE_DOMAIN } from "./cookieDomain";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: COOKIE_DOMAIN,
            }),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/cadastro");

  const isProtectedRoute = pathname.startsWith("/painel");

  // Unauthenticated user on protected route → login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  /*
   * Usuario com sessao numa pagina de auth: vai para o destino pedido em
   * `next`, e so no silencio dele para o painel (M-18).
   *
   * O middleware roda ANTES da pagina, entao fixar /painel aqui apagava o
   * `next` e o tratamento de src/app/login/page.tsx nunca chegava a rodar: quem
   * tinha sessao viva no hub e clicava em Entrar num modulo ficava parado no
   * painel, sem porta de volta. E o caminho tipico logo depois do deploy,
   * quando a sessao antiga do hub ainda e cookie so do host e o modulo nao a
   * enxerga.
   *
   * O destino passa por resolveReturnUrl: caminho do proprio hub ou host de
   * byfust.com.br, nunca redirect aberto.
   */
  if (user && isAuthRoute) {
    const destino = resolveReturnUrl(request.nextUrl.searchParams.get(RETURN_PARAM));
    return NextResponse.redirect(new URL(destino, request.nextUrl.origin));
  }

  return supabaseResponse;
}
