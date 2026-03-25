"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";
import Link from "next/link";

const BLOCOS_URL = process.env.NEXT_PUBLIC_BLOCOS_URL || "https://blocos.byfust.com.br";
const GEOTECH_URL = process.env.NEXT_PUBLIC_GEOTECH_URL || "https://geotech.byfust.com.br";

interface ModuleInfo {
  plan_type: string;
  status: string;
  current_period_end: string | null;
}

interface Props {
  user: { email: string; name: string | null };
  modules: Record<string, ModuleInfo>;
}

const MODULE_CONFIG = [
  {
    key: "blocos",
    name: "BY.BLOCOS",
    description: "Blocos de coroamento sobre estacas",
    url: BLOCOS_URL,
  },
  {
    key: "geotech",
    name: "BY.GEOTECH",
    description: "Capacidade de carga de estacas",
    url: GEOTECH_URL,
  },
  {
    key: "vigas",
    name: "BY.VIGAS",
    description: "Vigas de concreto armado",
    url: null,
  },
  {
    key: "pilar",
    name: "BY.PILAR",
    description: "Pilares de concreto armado",
    url: null,
  },
];

export function PainelContent({ user, modules }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  async function handlePortal() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      // silently fail
    }
  }

  const hasAnySubscription = Object.values(modules).some(
    (m) => m.plan_type === "pro" && m.status === "active"
  );

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/[0.04]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            BY<span className="text-primary">.</span>FUST
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
            >
              Sair
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
            Seus módulos
          </h1>
          <p className="text-muted-foreground text-base">
            {user.name ? `Olá, ${user.name}.` : "Olá!"} Gerencie seus módulos de cálculo estrutural.
          </p>
        </div>

        {/* Manage subscription */}
        {hasAnySubscription && (
          <div className="mb-8 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Gerenciar assinatura</p>
              <p className="text-xs text-muted-foreground mt-0.5">Alterar plano, método de pagamento ou cancelar</p>
            </div>
            <button
              onClick={handlePortal}
              className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-white/[0.08] bg-white/[0.03] text-foreground transition-all hover:bg-white/[0.06] hover:border-white/[0.12] active:scale-[0.97]"
            >
              Abrir portal →
            </button>
          </div>
        )}

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULE_CONFIG.map((mod) => {
            const sub = modules[mod.key];
            const isPro = sub?.plan_type === "pro" && sub?.status === "active";
            const isAvailable = mod.url !== null;

            return (
              <div
                key={mod.key}
                className={`rounded-xl border bg-card p-6 transition-all ${
                  isAvailable ? "border-white/[0.06]" : "border-white/[0.04] opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black tracking-tight text-card-foreground">{mod.name}</h3>
                  {isPro ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      PRO
                    </span>
                  ) : isAvailable ? (
                    <span className="text-[11px] font-semibold text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded">
                      FREE
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-white/30">Em breve</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-5">{mod.description}</p>

                {sub?.current_period_end && isPro && (
                  <p className="text-[11px] text-muted-foreground/60 mb-4">
                    Renova em {new Date(sub.current_period_end).toLocaleDateString("pt-BR")}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  {isAvailable && mod.url ? (
                    <a
                      href={mod.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.97]"
                    >
                      Acessar
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground/40">Disponível em breve</span>
                  )}

                  {isAvailable && !isPro && (
                    <span className="text-[13px] text-primary font-medium">
                      {/* TODO: link para payment quando preços definidos */}
                      Upgrade disponível
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
