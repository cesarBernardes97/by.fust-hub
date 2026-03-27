import { HeroVisualLazy as HeroVisual } from "@/components/hero-visual-lazy";
import { ScrollReveal } from "@/components/scroll-reveal";

const BLOCOS_URL =
  process.env.NEXT_PUBLIC_BLOCOS_URL || "https://blocos.byfust.com.br";
const GEOTECH_URL =
  process.env.NEXT_PUBLIC_GEOTECH_URL || "https://geotech.byfust.com.br";
const WHATSAPP_URL = "https://wa.me/5500000000000";
const INSTAGRAM_URL = "#";
const LINKEDIN_URL = "#";
const SUPPORT_EMAIL = "contato@byfust.com.br";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const modules = [
  {
    name: "BY.BLOCOS",
    tag: "Fundações",
    description:
      "Dimensionamento de blocos de coroamento sobre estacas por bielas e tirantes.",
    features: [
      "13 tipologias",
      "Modelagem livre",
      "Múltiplos pilares",
      "Estacas inclinadas",
      "Bielas e tirantes avançados",
      "CCC/CCT/CTT",
      "Detalhamento",
    ],
    status: "active" as const,
    url: BLOCOS_URL,
    page: "/blocos",
  },
  {
    name: "BY.GEOTECH",
    tag: "Geotecnia",
    description: "Capacidade de carga vertical e horizontal de estacas.",
    features: [
      "Aoki-Velloso",
      "Décourt-Quaresma",
      "Envoltória",
      "P-Y (Reese/Matlock)",
      "Diferenças finitas",
      "12 tipos de estaca",
      "Relatório PDF",
    ],
    status: "active" as const,
    url: GEOTECH_URL,
    page: "/geotech",
  },
  {
    name: "BY.VIGAS",
    tag: "Superestrutura",
    description: "Dimensionamento de vigas de concreto armado.",
    features: [
      "Flexão simples/composta",
      "Cisalhamento",
      "Torção",
      "Detalhamento automático",
    ],
    status: "coming_soon" as const,
    url: null,
    page: null,
  },
  {
    name: "BY.PILAR",
    tag: "Superestrutura",
    description: "Dimensionamento de pilares de concreto armado.",
    features: ["Flexão oblíqua", "Envoltória resistente", "NBR 6118"],
    status: "coming_soon" as const,
    url: null,
    page: null,
  },
];

const stats = [
  { value: "NBR 6118", accent: ".", label: "Norma vigente atualizada" },
  { value: "3D", accent: ".", label: "Modelo STM tridimensional" },
  { value: "PDF", accent: ".", label: "Memória de cálculo completa" },
  { value: "100", accent: "%", label: "Na nuvem, sem instalação" },
];

const workflowSteps = [
  {
    number: "01",
    title: "Defina a geometria",
    desc: "Escolha a tipologia, posicione estacas e pilares. Visualize em 3D em tempo real enquanto ajusta dimensões.",
  },
  {
    number: "02",
    title: "Aplique os carregamentos",
    desc: "Insira esforços normais, cortantes e momentos. Crie combinações de carga conforme NBR 8681.",
  },
  {
    number: "03",
    title: "Gere o relatório",
    desc: "Memória de cálculo completa em PDF. Verificações, detalhamento de armaduras e modelo STM prontos para o cliente.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <ScrollReveal />

      {/* ── Navigation ─────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-[20px] border-b"
        style={{
          background: "rgba(10, 10, 11, 0.8)",
          borderColor: "var(--border-landing)",
        }}
      >
        <a
          href="/"
          className="font-mono text-xl font-bold"
          style={{ letterSpacing: "-0.5px", color: "var(--text)" }}
        >
          BY
          <span style={{ color: "var(--accent-landing)" }}>.</span>
          FUST
        </a>
        <div className="flex items-center gap-4 md:gap-9">
          <a
            href="#modulos"
            className="hidden sm:inline-block text-sm font-semibold transition-colors"
            style={{
              color: "var(--text-dim)",
              letterSpacing: "0.02em",
            }}
          >
            Módulos
          </a>
          <a
            href="#workflow"
            className="hidden sm:inline-block text-sm font-semibold transition-colors"
            style={{
              color: "var(--text-dim)",
              letterSpacing: "0.02em",
            }}
          >
            Como funciona
          </a>
          <a
            href="#precos"
            className="hidden sm:inline-block text-sm font-semibold transition-colors"
            style={{
              color: "var(--text-dim)",
              letterSpacing: "0.02em",
            }}
          >
            Preços
          </a>
          <a
            href="#suporte"
            className="hidden sm:inline-block text-sm font-semibold transition-colors"
            style={{
              color: "var(--text-dim)",
              letterSpacing: "0.02em",
            }}
          >
            Suporte
          </a>
          <a href="/painel" className="btn-primary">
            Acessar plataforma &rarr;
          </a>
        </div>
      </nav>

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex items-center overflow-hidden"
          style={{ padding: "140px 48px 80px" }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245, 130, 13, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 130, 13, 0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 80% 70% at 70% 40%, black 20%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 70% 40%, black 20%, transparent 70%)",
            }}
          />
          {/* Glow effects */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 800,
              height: 800,
              right: -100,
              top: -100,
              background:
                "radial-gradient(circle, rgba(245, 130, 13, 0.08) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 500,
              left: "20%",
              bottom: -200,
              background:
                "radial-gradient(circle, rgba(245, 130, 13, 0.04) 0%, transparent 60%)",
            }}
          />

          {/* Hero content */}
          <div className="relative z-[2] max-w-[720px]">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase mb-8"
              style={{
                background: "rgba(245, 130, 13, 0.08)",
                border: "1px solid rgba(245, 130, 13, 0.2)",
                letterSpacing: "0.08em",
                color: "var(--accent-landing)",
                animation: "fadeInUp 0.8s ease both",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--accent-landing)",
                  animation: "pulse-dot 2s ease infinite",
                }}
              />
              Engenharia Estrutural
            </div>

            <h1
              className="font-syne"
              style={{
                fontSize: "clamp(48px, 6.5vw, 88px)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginBottom: 28,
                animation: "fadeInUp 0.8s ease 0.1s both",
                color: "var(--text)",
              }}
            >
              Cálculo estrutural.
              <br />
              <em
                className="font-bebas not-italic"
                style={{
                  color: "var(--accent-landing)",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  fontSize: "1.1em",
                }}
              >
                Sem planilha.
              </em>
            </h1>

            <p
              className="mb-10"
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--text-dim)",
                maxWidth: 480,
                animation: "fadeInUp 0.8s ease 0.2s both",
              }}
            >
              Plataforma modular para engenheiros calculistas. Blocos,
              geotecnia, vigas e pilares — cada disciplina com seu módulo.
              Conforme NBR 6118.
            </p>

            <div
              className="flex items-center gap-4"
              style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}
            >
              <a
                href={BLOCOS_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Acessar plataforma &rarr;
              </a>
              <a href="#modulos" className="btn-secondary">
                Ver módulos
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <HeroVisual />
        </section>

        {/* ── Stats Bar ────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            borderTop: "1px solid var(--border-landing)",
            borderBottom: "1px solid var(--border-landing)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="py-10 px-6 md:px-12"
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid var(--border-landing)"
                    : "none",
                animation: `fadeInUp 0.6s ease ${0.1 + i * 0.1}s both`,
              }}
            >
              <div
                className="font-mono text-4xl font-bold"
                style={{
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
                <span style={{ color: "var(--accent-landing)" }}>
                  {s.accent}
                </span>
              </div>
              <div
                className="mt-1 text-[13px]"
                style={{
                  color: "var(--text-dim)",
                  letterSpacing: "0.02em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Modules ──────────────────────────────────── */}
        <section id="modulos" className="py-20 md:py-[120px] px-6 md:px-12">
          <div className="reveal">
            <div
              className="font-mono text-xs font-semibold uppercase mb-4"
              style={{
                letterSpacing: "0.12em",
                color: "var(--accent-landing)",
              }}
            >
              Módulos
            </div>
            <h2
              className="font-syne"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 16,
                color: "var(--text)",
              }}
            >
              Do solo à{" "}
              <em
                className="font-bebas not-italic"
                style={{
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  fontSize: "1.15em",
                  color: "var(--accent-landing)",
                }}
              >
                superestrutura
              </em>
            </h2>
            <p
              className="mb-16"
              style={{
                fontSize: 17,
                color: "var(--text-dim)",
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              Cada disciplina do cálculo estrutural tem seu módulo. Use somente
              o que precisar, quando precisar.
            </p>
          </div>

          <div
            className="reveal grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            style={{
              gap: 2,
              background: "var(--border-landing)",
              border: "1px solid var(--border-landing)",
              borderRadius: "var(--radius)",
            }}
          >
            {modules.map((mod) => {
              const isActive = mod.status === "active";
              return (
                <div
                  key={mod.name}
                  className={`module-card p-8 md:p-10 ${!isActive ? "coming-soon" : ""}`}
                  style={{ background: "var(--bg)" }}
                >
                  {/* Top row: name + status */}
                  <div className="flex items-start justify-between mb-1 relative">
                    <h3
                      className="text-[28px] md:text-[32px] font-black tracking-tight"
                      style={{ color: isActive ? "var(--text)" : "var(--text-dim)", lineHeight: 1.1 }}
                    >
                      {mod.name}
                    </h3>
                    {isActive ? (
                      <span
                        className="text-[10px] font-bold uppercase flex items-center gap-1.5 mt-1.5 shrink-0"
                        style={{ letterSpacing: "0.08em", color: "var(--green-landing)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--green-landing)", boxShadow: "0 0 8px rgba(34,197,94,0.4)" }}
                        />
                        Ativo
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-semibold uppercase mt-1.5 shrink-0"
                        style={{ color: "var(--text-muted-landing)", letterSpacing: "0.08em" }}
                      >
                        Em breve
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-[13px] mb-6 relative" style={{ color: "var(--text-dim)" }}>
                    {mod.description}
                  </p>

                  {/* Divider */}
                  <div className="mb-5" style={{ borderTop: "1px solid var(--border-landing)" }} />

                  {/* Features as check list */}
                  <ul className="space-y-2.5 mb-6 relative">
                    {mod.features.slice(0, 4).map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={isActive ? "var(--accent-landing)" : "var(--text-muted-landing)"}
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[13px]" style={{ color: isActive ? "var(--text-dim)" : "var(--text-muted-landing)" }}>
                          {feat}
                        </span>
                      </li>
                    ))}
                    {mod.features.length > 4 && (
                      <li className="text-[12px] ml-6.5" style={{ color: "var(--text-muted-landing)" }}>
                        +{mod.features.length - 4} mais
                      </li>
                    )}
                  </ul>

                  {/* Actions */}
                  <div className="flex items-center gap-4 relative">
                    {isActive && mod.url ? (
                      <>
                        <a
                          href={mod.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary text-[13px]"
                          style={{ padding: "8px 20px" }}
                        >
                          Acessar módulo &rarr;
                        </a>
                        {mod.page && (
                          <a
                            href={mod.page}
                            className="text-[13px] font-semibold transition-colors hover:underline"
                            style={{ color: "var(--text-dim)" }}
                          >
                            Saiba mais
                          </a>
                        )}
                      </>
                    ) : (
                      <span
                        className="text-[13px] italic"
                        style={{ color: "var(--text-muted-landing)", fontWeight: 400 }}
                      >
                        Disponível em breve
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Workflow ─────────────────────────────────── */}
        <section
          id="workflow"
          className="py-20 md:py-[120px] px-6 md:px-12"
          style={{
            background: "var(--bg-elevated)",
            borderTop: "1px solid var(--border-landing)",
            borderBottom: "1px solid var(--border-landing)",
          }}
        >
          <div className="reveal">
            <div
              className="font-mono text-xs font-semibold uppercase mb-4"
              style={{
                letterSpacing: "0.12em",
                color: "var(--accent-landing)",
              }}
            >
              Como funciona
            </div>
            <h2
              className="font-syne"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 16,
                color: "var(--text)",
              }}
            >
              Três passos.{" "}
              <em
                className="font-bebas not-italic"
                style={{
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  fontSize: "1.15em",
                  color: "var(--accent-landing)",
                }}
              >
                Nenhuma instalação.
              </em>
            </h2>
            <p
              className="mb-16"
              style={{
                fontSize: 17,
                color: "var(--text-dim)",
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              Abra o navegador, escolha o módulo, gere o relatório. Simples
              assim.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-0 mt-16">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="workflow-step p-8 md:p-12 rounded-xl"
                style={{
                  border: "1px solid var(--border-landing)",
                  margin: "0 -1px",
                }}
              >
                <div
                  className="step-number font-mono text-6xl font-bold leading-none mb-6 transition-colors"
                  style={{ color: "var(--text-muted-landing)" }}
                >
                  {step.number}
                </div>
                <h3
                  className="font-syne text-xl font-bold mb-3"
                  style={{
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-dim)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────── */}
        <section
          id="precos"
          className="py-20 md:py-[120px] px-6 md:px-12"
          style={{
            background: "var(--bg-elevated)",
            borderTop: "1px solid var(--border-landing)",
            borderBottom: "1px solid var(--border-landing)",
          }}
        >
          <div className="reveal">
            <div
              className="font-mono text-xs font-semibold uppercase mb-4"
              style={{
                letterSpacing: "0.12em",
                color: "var(--accent-landing)",
              }}
            >
              Planos
            </div>
            <h2
              className="font-syne"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 16,
                color: "var(--text)",
              }}
            >
              Escolha o que{" "}
              <em
                className="font-bebas not-italic"
                style={{
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  fontSize: "1.15em",
                  color: "var(--accent-landing)",
                }}
              >
                faz sentido
              </em>
            </h2>
            <p
              className="mb-16"
              style={{
                fontSize: 17,
                color: "var(--text-dim)",
                lineHeight: 1.6,
                maxWidth: 520,
              }}
            >
              Assine módulos individuais ou o plano completo com 30% de desconto.
              Cancele quando quiser.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Individual BLOCOS */}
            <div
              className="rounded-xl p-8 flex flex-col"
              style={{
                border: "1px solid var(--border-landing)",
                background: "var(--bg)",
              }}
            >
              <div
                className="font-mono text-[11px] font-semibold uppercase mb-6"
                style={{ letterSpacing: "0.08em", color: "var(--text-dim)" }}
              >
                Módulo individual
              </div>
              <h3
                className="font-syne text-xl font-bold mb-2"
                style={{ color: "var(--text)" }}
              >
                BY.BLOCOS
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-dim)" }}
              >
                Blocos de coroamento sobre estacas
              </p>
              <div className="mb-1">
                <span
                  className="font-mono text-4xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  R$79
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  /mês
                </span>
              </div>
              <p
                className="text-xs mb-8"
                style={{ color: "var(--text-muted-landing)" }}
              >
                ou R$690/ano (27% off)
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["13 tipologias de bloco", "STM 3D + verificação de nós", "Relatório PDF completo", "Estacas inclinadas"].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <span style={{ color: "var(--accent-landing)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/painel" className="btn-secondary w-full text-center">
                Assinar
              </a>
            </div>

            {/* Combo — DESTAQUE */}
            <div
              className="rounded-xl p-8 flex flex-col relative"
              style={{
                border: "2px solid var(--accent-landing)",
                background: "var(--bg)",
              }}
            >
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase"
                style={{
                  background: "var(--accent-landing)",
                  color: "var(--bg)",
                  letterSpacing: "0.06em",
                }}
              >
                30% off
              </div>
              <div
                className="font-mono text-[11px] font-semibold uppercase mb-6"
                style={{ letterSpacing: "0.08em", color: "var(--accent-landing)" }}
              >
                Todos os módulos
              </div>
              <h3
                className="font-syne text-xl font-bold mb-2"
                style={{ color: "var(--text)" }}
              >
                BY.FUST Completo
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-dim)" }}
              >
                Blocos + Geotecnia + Vigas + Pilares
              </p>
              <div className="mb-1">
                <span
                  className="font-mono text-4xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  R$110
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  /mês
                </span>
              </div>
              <div className="flex items-center gap-2 mb-8">
                <span
                  className="text-xs line-through"
                  style={{ color: "var(--text-muted-landing)" }}
                >
                  R$158/mês
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted-landing)" }}
                >
                  ou R$970/ano
                </span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Tudo do BY.BLOCOS", "Tudo do BY.GEOTECH", "BY.VIGAS ao lançar", "BY.PILAR ao lançar", "Prioridade em novos módulos"].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <span style={{ color: "var(--accent-landing)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/painel" className="btn-primary w-full text-center">
                Assinar completo
              </a>
            </div>

            {/* Individual GEOTECH */}
            <div
              className="rounded-xl p-8 flex flex-col"
              style={{
                border: "1px solid var(--border-landing)",
                background: "var(--bg)",
              }}
            >
              <div
                className="font-mono text-[11px] font-semibold uppercase mb-6"
                style={{ letterSpacing: "0.08em", color: "var(--text-dim)" }}
              >
                Módulo individual
              </div>
              <h3
                className="font-syne text-xl font-bold mb-2"
                style={{ color: "var(--text)" }}
              >
                BY.GEOTECH
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-dim)" }}
              >
                Capacidade de carga de estacas
              </p>
              <div className="mb-1">
                <span
                  className="font-mono text-4xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  R$79
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  /mês
                </span>
              </div>
              <p
                className="text-xs mb-8"
                style={{ color: "var(--text-muted-landing)" }}
              >
                ou R$690/ano (27% off)
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Aoki-Velloso e Décourt-Quaresma", "Análise lateral P-Y", "12 tipos de estaca", "Relatório PDF completo"].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <span style={{ color: "var(--accent-landing)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/painel" className="btn-secondary w-full text-center">
                Assinar
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="relative text-center py-32 md:py-40 px-6 md:px-12">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: 600,
              height: 600,
              background:
                "radial-gradient(circle, rgba(245, 130, 13, 0.06) 0%, transparent 60%)",
            }}
          />
          <div className="reveal relative">
            <h2
              className="font-syne mb-5"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text)",
              }}
            >
              Seu próximo projeto
              <br />
              começa{" "}
              <em
                className="font-bebas not-italic"
                style={{
                  fontWeight: 400,
                  color: "var(--accent-landing)",
                  letterSpacing: "0.04em",
                  fontSize: "1.15em",
                }}
              >
                AQUI.
              </em>
            </h2>
            <p
              className="mx-auto mb-10"
              style={{
                fontSize: 17,
                color: "var(--text-dim)",
                maxWidth: 460,
                lineHeight: 1.6,
              }}
            >
              Sem instalação, sem planilha, sem complicação. Acesse a plataforma
              e calcule seu primeiro bloco agora.
            </p>
            <a
              href={BLOCOS_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-large"
            >
              Acessar plataforma &rarr;
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-12 px-6 md:px-12 pt-12 pb-10 items-start"
        style={{ borderTop: "1px solid var(--border-landing)" }}
      >
        {/* Col 1: Brand */}
        <div>
          <div
            className="font-mono text-base font-bold"
            style={{ color: "var(--text)" }}
          >
            BY
            <span style={{ color: "var(--accent-landing)" }}>.</span>
            FUST
          </div>
          <div
            className="text-xs mt-1 leading-relaxed max-w-[260px]"
            style={{ color: "var(--text-muted-landing)" }}
          >
            Plataforma de cálculo estrutural para engenheiros. Do solo à
            superestrutura.
          </div>
        </div>

        {/* Col 2: Links */}
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase mb-3.5"
            style={{
              letterSpacing: "0.08em",
              color: "var(--text-dim)",
            }}
          >
            Plataforma
          </div>
          <div className="flex flex-col gap-2.5">
            <a
              href={BLOCOS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              BY.BLOCOS
            </a>
            <a
              href={GEOTECH_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              BY.GEOTECH
            </a>
            <a
              href="#"
              className="text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              BY.VIGAS
            </a>
            <a
              href="#"
              className="text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              BY.PILAR
            </a>
            <a
              href="#suporte"
              className="text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              Suporte
            </a>
          </div>
        </div>

        {/* Col 3: Contact */}
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase mb-3.5"
            style={{
              letterSpacing: "0.08em",
              color: "var(--text-dim)",
            }}
          >
            Contato
          </div>
          <div className="flex flex-col gap-3" id="suporte">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(37, 211, 102, 0.12)" }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                    fill="#25d366"
                  />
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
                    fill="#25d366"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[11px] mb-px"
                  style={{ color: "var(--text-muted-landing)" }}
                >
                  WhatsApp
                </span>
                Resposta rápida em horário comercial
              </div>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2.5 text-[13px] transition-colors"
              style={{ color: "var(--text-dim)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(245, 130, 13, 0.12)" }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="#f5820d"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M3 7l9 6 9-6"
                    stroke="#f5820d"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[11px] mb-px"
                  style={{ color: "var(--text-muted-landing)" }}
                >
                  E-mail
                </span>
                {SUPPORT_EMAIL}
              </div>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="md:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 mt-2 text-[11px]"
          style={{
            borderTop: "1px solid var(--border-landing)",
            color: "var(--text-muted-landing)",
          }}
        >
          <span>&copy; 2025 BY.FUST — Todos os direitos reservados.</span>
          <div className="flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: "1px solid var(--border-landing)" }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: "var(--text-dim)" }}
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: "1px solid var(--border-landing)" }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: "var(--text-dim)" }}
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M15 10v7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: "1px solid var(--border-landing)" }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: "var(--text-dim)" }}
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M15.5 13.5c-.3-.15-1.2-.6-1.4-.7-.2-.05-.3-.05-.4.1-.15.2-.5.65-.65.8-.1.15-.25.15-.45.05-.3-.15-.9-.35-1.7-1.05-.6-.55-1.05-1.25-1.15-1.45-.1-.2 0-.3.1-.4.1-.1.2-.25.3-.35.1-.1.15-.2.2-.35.05-.15 0-.25-.025-.35-.05-.1-.45-1.1-.65-1.5-.15-.4-.35-.35-.45-.35-.15 0-.25 0-.4 0s-.35.05-.55.25c-.2.2-.7.7-.7 1.7s.75 2 .85 2.15c.1.15 1.5 2.3 3.6 3.2.5.2.9.35 1.2.45.5.15 1 .1 1.35.05.4-.05 1.25-.5 1.4-1 .2-.5.2-.9.15-1-.05-.1-.2-.15-.45-.25z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
