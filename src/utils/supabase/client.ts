import { createBrowserClient } from "@supabase/ssr";
import { COOKIE_DOMAIN } from "./cookieDomain";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Sem isto o browser gravaria um cookie host-only de byfust.com.br com o
    // mesmo nome do compartilhado que o server e o middleware gravam: dois
    // cookies iguais, e o refresh deixaria de alcancar os modulos.
    { cookieOptions: { domain: COOKIE_DOMAIN } },
  );
}
