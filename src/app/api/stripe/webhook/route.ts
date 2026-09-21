import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  upsertModuleSubscription,
  getUserByStripeCustomer,
  findUserByEmail,
  isStripeEventStale,
  moduleFromSubscription,
  modulesToPersist,
  type ModuleSubscriptionRow,
} from "@/lib/subscription";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const runtime = "nodejs";

/** Um id de usuario do Supabase e sempre um UUID. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CamposDaLinha = Partial<Omit<ModuleSubscriptionRow, "user_id" | "module">>;

interface ContextoDaAssinatura {
  /** Modulo resolvido, ou null quando nao da para saber (nada e gravado). */
  module: string | null;
  /** A assinatura como o Stripe a devolve agora. */
  sub: Stripe.Subscription;
}

/**
 * De que modulo e a assinatura, pela metadata do produto (ver
 * `moduleFromSubscription`), e a propria assinatura buscada.
 *
 * SEM try/catch de proposito (I-04). Antes o catch devolvia null, e null cai
 * no mesmo ramo de "modulo desconhecido": console.warn, break e 200. Com 200 o
 * Stripe nao reenvia, entao um 429 ou um timeout no retrieve fazia um checkout
 * pago nao liberar nada, de forma permanente e silenciosa. Deixando a excecao
 * subir, o handler responde 500 e o Stripe reenvia. Null continua querendo
 * dizer so "modulo desconhecido".
 */
async function resolverContexto(
  stripe: Stripe,
  subscriptionId: string,
): Promise<ContextoDaAssinatura> {
  const sub = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });
  return { module: moduleFromSubscription(sub), sub };
}

/**
 * Fim do periodo pago. A partir da API de 2025 o campo vive no item da
 * assinatura; ler so o topo gravava sempre nulo e o painel nao mostrava
 * a data de renovacao.
 */
function periodEndISO(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0] as unknown as Record<string, unknown> | undefined;
  const topo = sub as unknown as Record<string, unknown>;
  const valor = item?.current_period_end ?? topo.current_period_end;
  return typeof valor === "number" ? new Date(valor * 1000).toISOString() : null;
}

/**
 * Grava a linha do modulo, pulando evento mais antigo que o ultimo gravado
 * (I-03). O Stripe reenvia e entrega fora de ordem: um `deleted` ja
 * processado pode ser seguido de um `updated` atrasado com status active, e
 * sem esta guarda o upsert devolvia o acesso a quem cancelou.
 */
async function gravarModulo(
  userId: string,
  module: string,
  fields: CamposDaLinha,
  eventCreated: number,
): Promise<boolean> {
  if (await isStripeEventStale(userId, module, eventCreated)) {
    console.info("[Webhook] evento fora de ordem ignorado:", module, userId, eventCreated);
    return false;
  }
  await upsertModuleSubscription(userId, module, {
    ...fields,
    stripe_event_created: eventCreated,
  });
  return true;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !endpointSecret) {
    console.error("[Webhook] Missing signature or secret");
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[Webhook] Signature failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log("[Webhook] Event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout for:", session.customer_email);

        // Acha o usuario: metadata, client_reference_id e, por fim, e-mail
        let userId = session.metadata?.supabase_user_id;
        const referencia = session.client_reference_id;
        if (!userId && referencia && UUID.test(referencia)) {
          userId = referencia;
        }
        const email = session.customer_email ?? session.customer_details?.email ?? null;
        if (!userId && email) {
          userId = await findUserByEmail(email);
        }

        if (!userId) {
          console.warn("[Webhook] User not found for session:", session.id);
          break;
        }

        if (!session.subscription) {
          console.warn("[Webhook] No subscription in session:", session.id);
          break;
        }

        const ctx = await resolverContexto(stripe, session.subscription as string);
        const modules = modulesToPersist(ctx.module);

        if (modules.length === 0) {
          console.warn(
            "[Webhook] Nada gravado: modulo",
            ctx.module ?? "desconhecido",
            "no evento",
            event.type,
            session.id,
          );
          break;
        }

        for (const mod of modules) {
          await gravarModulo(
            userId,
            mod,
            {
              plan_type: "pro",
              status: "active",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              // A assinatura ja foi buscada acima: sem isto a coluna ficava
              // nula ate chegar algum `updated` futuro, e o card do painel nao
              // mostrava a data de renovacao de quem acabou de pagar.
              current_period_end: periodEndISO(ctx.sub),
            },
            event.created,
          );
        }

        console.log("[Webhook] Activated modules:", modules, "for user:", userId);
        break;
      }

      // `created` chega logo depois da compra e traz o mesmo objeto do
      // `updated`: sem este case, a primeira assinatura so era completada no
      // proximo evento de atualizacao.
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const userId = await getUserByStripeCustomer(customerId);
        if (!userId) break;

        const ctx = await resolverContexto(stripe, sub.id);
        const modules = modulesToPersist(ctx.module);

        if (modules.length === 0) {
          console.warn(
            "[Webhook] Nada gravado: modulo",
            ctx.module ?? "desconhecido",
            "no evento",
            event.type,
            sub.id,
          );
          break;
        }

        const atual = ctx.sub;
        const isActive = atual.status === "active" || atual.status === "trialing";

        for (const mod of modules) {
          await gravarModulo(
            userId,
            mod,
            {
              plan_type: isActive ? "pro" : "free",
              status: atual.status,
              stripe_customer_id: customerId,
              stripe_subscription_id: atual.id,
              current_period_end: periodEndISO(atual),
            },
            event.created,
          );
        }

        console.log("[Webhook] Updated modules:", modules, "status:", atual.status);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const userId = await getUserByStripeCustomer(customerId);
        if (!userId) break;

        const ctx = await resolverContexto(stripe, sub.id);
        const modules = modulesToPersist(ctx.module);

        if (modules.length === 0) {
          console.warn(
            "[Webhook] Nada cancelado: modulo",
            ctx.module ?? "desconhecido",
            "no evento",
            event.type,
            sub.id,
          );
          break;
        }

        for (const mod of modules) {
          await gravarModulo(
            userId,
            mod,
            {
              plan_type: "free",
              status: "canceled",
              stripe_subscription_id: null,
              current_period_end: null,
            },
            event.created,
          );
        }

        console.log("[Webhook] Canceled modules:", modules, "for user:", userId);
        break;
      }
    }
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
