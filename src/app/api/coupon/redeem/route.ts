import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    // Verificar se usuário já resgatou algum cupom
    const { data: existing } = await supabase
      .from("coupon_redemptions")
      .select("expires_at")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const isActive = new Date(existing.expires_at) > new Date();
      return NextResponse.json({
        error: isActive
          ? "Você já tem um acesso ativo."
          : "Seu período de acesso expirou. Assine para continuar.",
      }, { status: 409 });
    }

    // Service role para operações que bypassam RLS
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Buscar cupom
    const { data: coupon } = await service
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (!coupon) {
      return NextResponse.json({ error: "Código não encontrado." }, { status: 404 });
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: "Este código já atingiu o limite de usos." }, { status: 410 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + coupon.trial_days);

    // Inserir redemption
    const { error: redemptionErr } = await service
      .from("coupon_redemptions")
      .insert({ user_id: user.id, coupon_code: coupon.code, expires_at: expiresAt.toISOString() });

    if (redemptionErr) {
      return NextResponse.json({ error: "Erro ao resgatar. Tente novamente." }, { status: 500 });
    }

    // Criar/atualizar module_subscriptions para cada módulo do cupom
    for (const module of coupon.modules as string[]) {
      await service.from("module_subscriptions").upsert({
        user_id: user.id,
        module,
        plan_type: "pro",
        status: "active",
        current_period_end: expiresAt.toISOString(),
      }, { onConflict: "user_id,module" });
    }

    // Incrementar used_count
    await service
      .from("coupons")
      .update({ used_count: coupon.used_count + 1 })
      .eq("code", coupon.code);

    return NextResponse.json({ ok: true, expiresAt: expiresAt.toISOString(), trialDays: coupon.trial_days });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
