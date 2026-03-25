import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: modules } = await supabase
    .from("module_subscriptions")
    .select("module, plan_type, status, current_period_end")
    .eq("user_id", user.id);

  // Build a map of module → subscription info
  const moduleMap: Record<string, { plan_type: string; status: string; current_period_end: string | null }> = {};

  for (const mod of modules || []) {
    moduleMap[mod.module] = {
      plan_type: mod.plan_type,
      status: mod.status,
      current_period_end: mod.current_period_end,
    };
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || null,
    },
    modules: moduleMap,
  });
}
