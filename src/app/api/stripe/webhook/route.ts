import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  upsertModuleSubscription,
  getUserByStripeCustomer,
  findUserByEmail,
  ALL_MODULES,
} from "@/lib/subscription";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const runtime = "nodejs";

/**
 * Resolve which module a Stripe product/price is for.
 * Uses product metadata `module: "blocos" | "geotech" | "all"`.
 * Falls back to "blocos" for backwards compat with existing subscriptions.
 */
async function resolveModule(stripe: Stripe, subscriptionId: string): Promise<string> {
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });
    const item = sub.items.data[0];
    const product = item?.price?.product;
    if (product && typeof product === "object" && "metadata" in product) {
      const mod = (product as Stripe.Product).metadata?.module;
      if (mod) return mod;
    }
  } catch (err) {
    console.warn("[Webhook] Could not resolve module from subscription:", err);
  }
  return "blocos"; // fallback
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

        // Find user: metadata first, then email lookup
        let userId = session.metadata?.supabase_user_id;
        if (!userId && session.customer_email) {
          userId = await findUserByEmail(session.customer_email);
        }

        if (!userId) {
          console.warn("[Webhook] User not found for session:", session.id);
          break;
        }

        if (!session.subscription) {
          console.warn("[Webhook] No subscription in session:", session.id);
          break;
        }

        const module = await resolveModule(stripe, session.subscription as string);
        const modules = module === "all" ? [...ALL_MODULES] : [module];

        for (const mod of modules) {
          await upsertModuleSubscription(userId, mod, {
            plan_type: "pro",
            status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          });
        }

        // Also upsert to legacy subscriptions table for backwards compat
        console.log("[Webhook] Activated modules:", modules, "for user:", userId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const userId = await getUserByStripeCustomer(customerId);
        if (!userId) break;

        const module = await resolveModule(stripe, sub.id);
        const modules = module === "all" ? [...ALL_MODULES] : [module];
        const isActive = sub.status === "active" || sub.status === "trialing";
        const periodEnd = (sub as unknown as Record<string, unknown>).current_period_end;

        for (const mod of modules) {
          await upsertModuleSubscription(userId, mod, {
            plan_type: isActive ? "pro" : "free",
            status: sub.status,
            stripe_subscription_id: sub.id,
            current_period_end: typeof periodEnd === "number"
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          });
        }

        console.log("[Webhook] Updated modules:", modules, "status:", sub.status);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const userId = await getUserByStripeCustomer(customerId);
        if (!userId) break;

        const module = await resolveModule(stripe, sub.id);
        const modules = module === "all" ? [...ALL_MODULES] : [module];

        for (const mod of modules) {
          await upsertModuleSubscription(userId, mod, {
            plan_type: "free",
            status: "canceled",
            stripe_subscription_id: null,
            current_period_end: null,
          });
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
