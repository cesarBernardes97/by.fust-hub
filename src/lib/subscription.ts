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
}

/** Upsert a module subscription (server-only) */
export async function upsertModuleSubscription(
  userId: string,
  module: string,
  fields: Partial<Omit<ModuleSubscriptionRow, "user_id" | "module">>,
) {
  const sb = getAdminSupabase();
  const { error } = await sb
    .from("module_subscriptions")
    .upsert(
      { user_id: userId, module, ...fields, updated_at: new Date().toISOString() },
      { onConflict: "user_id,module" },
    );
  if (error) throw error;
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

/** Find Supabase user by email (using admin client) */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  const sb = getAdminSupabase();
  const { data } = await sb.auth.admin.listUsers();
  const user = data?.users?.find((u) => u.email === email);
  return user?.id ?? undefined;
}

/** All modules that "all" plan covers */
export const ALL_MODULES = ["blocos", "geotech"] as const;
