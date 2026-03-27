import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find stripe_customer_id: try module_subscriptions first, fallback to legacy subscriptions
    const sb = getAdminSupabase();
    let customerId: string | null = null;

    const { data: modSub } = await sb
      .from("module_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .not("stripe_customer_id", "is", null)
      .limit(1)
      .single();

    if (modSub?.stripe_customer_id) {
      customerId = modSub.stripe_customer_id;
    } else {
      // Fallback to legacy subscriptions table
      const { data: legacySub } = await sb
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .not("stripe_customer_id", "is", null)
        .single();
      customerId = legacySub?.stripe_customer_id ?? null;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://byfust.com.br/painel";

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[Portal] Error:", err);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
