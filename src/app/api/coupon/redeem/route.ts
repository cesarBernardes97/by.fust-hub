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

    const phone = (user.user_metadata?.phone as string | undefined)?.replace(/\D/g, "") ?? null;

    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Bloquear se mesmo telefone já usou qualquer cupom
    if (phone) {
      const { data: phoneUsed } = await service
        .from("coupon_redemptions")
        .select("id")
        .eq("phone", phone)
        .single();

      if (phoneUsed) {
        return NextResponse.json({ error: "Este número de telefone já utilizou um código de acesso." }, { status: 409 });
      }
    }

    // Bloquear se mesmo usuário já resgatou
    const { data: existing } = await service
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

    // Buscar e validar cupom
    const { data: coupon } = await service
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (!coupon) {
      return NextResponse.json({ error: "Código não encontrado." }, { status: 404 });
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: "Este código já foi utilizado." }, { status: 410 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + coupon.trial_days);

    /*
     * Ordem importa (auditoria M-06): a liberacao do acesso vem ANTES da
     * redemption e o erro do upsert e lido. Como `coupon_redemptions` tem
     * UNIQUE (user_id), gravar a redemption primeiro e ignorar a falha do
     * upsert queimava o unico resgate do usuario e ainda dizia "Acesso
     * liberado".
     *
     * A inversao pedia o desfazer: sem transacao, se a redemption falhar
     * DEPOIS do acesso liberado, o usuario fica Pro sem linha em
     * coupon_redemptions, o used_count nunca e incrementado e o bloqueio por
     * telefone nunca e registrado: um cupom com max_uses liberaria acesso sem
     * ser contado e o mesmo telefone resgataria de novo em outra conta. Por
     * isso o estado anterior de cada linha e guardado antes e devolvido se
     * algum passo falhar. O jeito definitivo e uma funcao RPC transacional no
     * Postgres, que e escrita de banco e nao cabia nesta correcao.
     */
    const modulos = coupon.modules as string[];

    const antes = new Map<string, Record<string, unknown> | null>();
    for (const module of modulos) {
      const { data: linha } = await service
        .from("module_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("module", module)
        .maybeSingle();
      antes.set(module, (linha as Record<string, unknown> | null) ?? null);
    }

    /** Devolve as linhas ao estado anterior. false quando sobrou acesso ligado. */
    const desfazer = async (mods: string[]): Promise<boolean> => {
      let inteiro = true;
      for (const module of mods) {
        const anterior = antes.get(module) ?? null;
        const { error: voltaErr } = anterior
          ? await service
              .from("module_subscriptions")
              .upsert(anterior, { onConflict: "user_id,module" })
          : await service
              .from("module_subscriptions")
              .delete()
              .eq("user_id", user.id)
              .eq("module", module);
        if (voltaErr) {
          inteiro = false;
          console.error(
            "[Cupom] Falha ao desfazer o acesso do modulo",
            module,
            "do usuario",
            user.id,
            voltaErr.message,
          );
        }
      }
      return inteiro;
    };

    const liberados: string[] = [];
    for (const module of modulos) {
      const { error: upsertErr } = await service.from("module_subscriptions").upsert({
        user_id: user.id,
        module,
        plan_type: "pro",
        status: "active",
        current_period_end: expiresAt.toISOString(),
      }, { onConflict: "user_id,module" });

      if (upsertErr) {
        console.error("[Cupom] Falha ao liberar o modulo", module, upsertErr.message);
        const limpo = await desfazer(liberados);
        return NextResponse.json(
          {
            error: limpo
              ? "Não foi possível liberar o acesso. Seu código continua válido, tente novamente."
              : "Não foi possível liberar o acesso por completo. Fale com o suporte antes de tentar de novo.",
          },
          { status: 500 },
        );
      }
      liberados.push(module);
    }

    // So agora consome o resgate (com telefone para bloqueio futuro)
    const { error: redemptionErr } = await service
      .from("coupon_redemptions")
      .insert({
        user_id: user.id,
        coupon_code: coupon.code,
        expires_at: expiresAt.toISOString(),
        phone: phone ?? null,
      });

    if (redemptionErr) {
      console.error(
        "[Cupom] Falha ao gravar a redemption do usuario",
        user.id,
        redemptionErr.message,
      );
      const limpo = await desfazer(liberados);
      return NextResponse.json(
        {
          error: limpo
            ? "Não foi possível concluir o resgate. Seu código continua válido, tente novamente."
            : "O acesso foi liberado, mas o resgate não ficou registrado. Fale com o suporte antes de tentar de novo.",
        },
        { status: 500 },
      );
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
