import { createClient } from "@supabase/supabase-js";

/** Server-only: admin Supabase client */
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars for admin client");
  return createClient(url, key);
}

export interface ModuleSubscriptionRow {
  user_id: string;
  module: string;
  plan_type: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  current_period_end: string | null;
  /** `event.created` do ultimo evento Stripe gravado nesta linha (ordem de reenvio). */
  stripe_event_created?: number | null;
}

/** Codigos do PostgREST/Postgres quando a coluna nao existe (cache de schema ou undefined_column). */
const UNDEFINED_COLUMN_CODES = new Set(["PGRST204", "42703"]);

/** Upsert a module subscription (server-only) */
export async function upsertModuleSubscription(
  userId: string,
  module: string,
  fields: Partial<Omit<ModuleSubscriptionRow, "user_id" | "module">>,
) {
  const sb = getAdminSupabase();
  const payload: Record<string, unknown> = {
    user_id: userId,
    module,
    ...fields,
    updated_at: new Date().toISOString(),
  };
  const { error } = await sb
    .from("module_subscriptions")
    .upsert(payload, { onConflict: "user_id,module" });
  if (!error) return;

  // A coluna stripe_event_created veio com a migration do radier. Se o banco
  // apontado ainda nao a tiver, regrava sem ela em vez de derrubar o webhook.
  if ("stripe_event_created" in payload && UNDEFINED_COLUMN_CODES.has(error.code ?? "")) {
    console.warn(
      "[subscription] module_subscriptions.stripe_event_created ausente: gravando sem a coluna (aplicar o DDL)",
    );
    const { stripe_event_created: omitida, ...resto } = payload;
    void omitida;
    const retry = await sb
      .from("module_subscriptions")
      .upsert(resto, { onConflict: "user_id,module" });
    if (retry.error) throw retry.error;
    return;
  }
  throw error;
}

/**
 * true quando o evento recebido e mais antigo que o ultimo ja gravado na
 * linha. Sem carimbo gravado, nada e antigo.
 *
 * Existe porque o Stripe reenvia e entrega fora de ordem: um
 * `customer.subscription.deleted` ja processado pode ser seguido de um
 * `customer.subscription.updated` atrasado com status active, e o upsert
 * regravaria plan_type "pro", devolvendo o acesso a quem cancelou.
 */
export function eventoEhAntigo(gravado: unknown, recebido: number): boolean {
  return typeof gravado === "number" && recebido < gravado;
}

/** Le o carimbo gravado e diz se o evento chegou fora de ordem. */
export async function isStripeEventStale(
  userId: string,
  module: string,
  eventCreated: number,
): Promise<boolean> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("module_subscriptions")
    .select("stripe_event_created")
    .eq("user_id", userId)
    .eq("module", module)
    .maybeSingle();
  if (error) {
    // Sem leitura confiavel nao da para afirmar que o evento e velho: grava.
    console.warn("[subscription] leitura de stripe_event_created falhou:", error.message);
    return false;
  }
  return eventoEhAntigo((data as { stripe_event_created?: unknown } | null)?.stripe_event_created, eventCreated);
}

/** Find user_id by stripe_customer_id in module_subscriptions */
export async function getUserByStripeCustomer(customerId: string): Promise<string | null> {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("module_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .limit(1)
    .single();
  if (error) return null;
  return data?.user_id ?? null;
}

/**
 * Find Supabase user by email (using admin client).
 * `listUsers()` devolve so a primeira pagina (50 usuarios por padrao): sem
 * paginar, quem se cadastrou depois do 50o usuario nunca era encontrado e a
 * assinatura paga nao chegava a nenhuma linha.
 */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  const sb = getAdminSupabase();
  const alvo = email.trim().toLowerCase();
  const porPagina = 1000;
  const maxPaginas = 50;

  for (let page = 1; page <= maxPaginas; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: porPagina });
    if (error) {
      console.warn("[subscription] listUsers falhou na pagina", page, error.message);
      return undefined;
    }
    const usuarios = data?.users ?? [];
    const achado = usuarios.find((u) => u.email?.toLowerCase() === alvo);
    if (achado) return achado.id;
    if (usuarios.length < porPagina) return undefined;
  }

  console.warn("[subscription] busca por e-mail parou no limite de", maxPaginas, "paginas");
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Registro de modulos                                                */
/* ------------------------------------------------------------------ */

/**
 * Modulos que o hub reconhece em `metadata.module` do produto no Stripe.
 * Espelha a CHECK `module_subscriptions_module_check` do banco (blocos,
 * geotech, vigas, pilar, radier): gravar fora dessa lista morre com 23514.
 */
export const KNOWN_MODULES = ["blocos", "geotech", "vigas", "pilar", "radier"] as const;

/**
 * Modulos que tem webhook proprio e gravam a propria assinatura. O hub
 * reconhece o modulo (para nao confundir com outro) mas nao grava nada:
 * o BY.RADIER esta em beta fechado e a assinatura dele e cortesia.
 */
export const MODULES_WITH_OWN_WEBHOOK: readonly string[] = ["radier"];

/** Modulos cobertos pelo plano "all". O radier, em beta fechado, fica fora. */
export const ALL_MODULES = ["blocos", "geotech"] as const;

/** Normaliza `metadata.module`. Devolve null quando o valor nao e reconhecido. */
export function normalizeModule(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const mod = raw.trim().toLowerCase();
  if (!mod) return null;
  if (mod === "all") return "all";
  return (KNOWN_MODULES as readonly string[]).includes(mod) ? mod : null;
}

/**
 * Produtos antigos do Stripe, criados antes de existir `metadata.module`,
 * mapeados por id em STRIPE_LEGACY_PRODUCT_MODULES:
 * "prod_abc:blocos,prod_def:geotech". Sem a variavel, nada e mapeado.
 */
export function legacyModuleForProduct(productId: string | null | undefined): string | null {
  if (!productId) return null;
  const mapa = process.env.STRIPE_LEGACY_PRODUCT_MODULES ?? "";
  for (const par of mapa.split(",")) {
    const [id, mod] = par.split(":").map((pedaco) => pedaco.trim());
    if (id && id === productId) return normalizeModule(mod);
  }
  return null;
}

/** Formato minimo de assinatura do Stripe de que a decisao depende. */
export interface StripeSubscriptionLike {
  metadata?: Record<string, string> | null;
  items?: {
    data?: ReadonlyArray<{
      price?: {
        product?: string | { id?: string; metadata?: Record<string, string> | null } | null;
      } | null;
    }>;
  } | null;
}

/**
 * De que modulo e a assinatura: metadata do produto, metadata da assinatura e,
 * por ultimo, o mapa de produtos antigos. Null quer dizer "nao sei" e o hub
 * nao grava nada. Antes esta funcao terminava em `return "blocos"`, entao um
 * produto sem metadata gravava blocos e o cancelamento de outro modulo
 * cancelava o blocos de quem pagava os dois.
 */
export function moduleFromSubscription(sub: StripeSubscriptionLike | null | undefined): string | null {
  const produto = sub?.items?.data?.[0]?.price?.product ?? null;
  const produtoId = typeof produto === "string" ? produto : produto?.id ?? null;
  const produtoMetadata = typeof produto === "string" ? null : produto?.metadata ?? null;

  return (
    normalizeModule(produtoMetadata?.module) ??
    normalizeModule(sub?.metadata?.module) ??
    legacyModuleForProduct(produtoId)
  );
}

/**
 * Linhas de `module_subscriptions` que o hub deve gravar para um modulo ja
 * resolvido. Lista vazia quer dizer "nao grave nada": modulo desconhecido ou
 * modulo com webhook proprio.
 */
export function modulesToPersist(module: string | null | undefined): string[] {
  if (!module) return [];
  if (module === "all") {
    return ALL_MODULES.filter((mod) => !MODULES_WITH_OWN_WEBHOOK.includes(mod));
  }
  if (MODULES_WITH_OWN_WEBHOOK.includes(module)) return [];
  return (KNOWN_MODULES as readonly string[]).includes(module) ? [module] : [];
}
