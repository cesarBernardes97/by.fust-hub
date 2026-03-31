import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PainelContent } from "./painel-content";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: modules }, { data: redemption }] = await Promise.all([
    supabase
      .from("module_subscriptions")
      .select("module, plan_type, status, current_period_end, stripe_subscription_id")
      .eq("user_id", user.id),
    supabase
      .from("coupon_redemptions")
      .select("expires_at")
      .eq("user_id", user.id)
      .single(),
  ]);

  const moduleMap: Record<string, { plan_type: string; status: string; current_period_end: string | null; has_stripe: boolean }> = {};
  for (const mod of modules || []) {
    moduleMap[mod.module] = {
      plan_type: mod.plan_type,
      status: mod.status,
      current_period_end: mod.current_period_end,
      has_stripe: !!mod.stripe_subscription_id && !mod.stripe_subscription_id.startsWith("owner_"),
    };
  }

  return (
    <PainelContent
      user={{ email: user.email!, name: user.user_metadata?.full_name || null }}
      modules={moduleMap}
      redemption={redemption ?? null}
    />
  );
}
