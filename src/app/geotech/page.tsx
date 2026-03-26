import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { GeotechVisual } from "@/components/geotech-visual";

const GEOTECH_URL =
  process.env.NEXT_PUBLIC_GEOTECH_URL || "https://geotech.byfust.com.br";

export const metadata: Metadata = {
  title: "BY.GEOTECH — Capacidade de Carga de Estacas | BY.FUST",
  description:
    "Calcule capacidade de carga vertical e horizontal de estacas isoladas. Aoki-Velloso, Décourt-Quaresma, análise lateral P-Y e relatório PDF.",
};

/* ── Data ──────────────────────────────────────────────────────────── */

const methodCards = [
  {
    icon: "Qr",
    iconClass: "vertical",
    name: "Aoki-Velloso",
    type: "Carga vertical",
    desc: "Método semiempírico baseado em correlações com SPT e CPT. Amplamente utilizado na prática brasileira desde 1975.",
    features: [
      "Correlação direta com N_SPT",
      "Resistência de ponta e lateral",
      "Coeficientes por tipo de solo",
      "Fator de correção F1 e F2",
    ],
  },
  {
    icon: "Qr",
    iconClass: "vertical",
    name: "Décourt-Quaresma",
    type: "Carga vertical",
    desc: "Método semiempírico que utiliza o valor médio do SPT ao longo do fuste e na ponta. Referência na engenharia de fundações brasileira.",
    features: [
      "N_SPT médio do fuste",
      "N_SPT da ponta (± 1m)",
      "Coeficiente α e β",
      "Parcelas de ponta e lateral",
    ],
  },
  {
    icon: "Py",
    iconClass: "lateral",
    name: "P-Y (Reese/Matlock)",
    type: "Carga lateral",
    desc: "Análise de estaca sob carga horizontal pelo método das curvas P-Y. Resolução por diferenças finitas ao longo do fuste.",
    features: [
      "Curvas P-Y por camada de solo",
      "Diferenças finitas (iterativo)",
      "Matlock (argilas moles)",
      "Reese (areias e argilas rijas)",
    ],
  },
];

const estacas = [
  { name: "Pré-moldada", detail: "Concreto" },
  { name: "Hélice Contínua", detail: "CFA" },
  { name: "Estaca Raiz", detail: "Microestaca" },
  { name: "Franki", detail: "Base alargada" },
  { name: "Metálica", detail: "Perfil / Trilho" },
  { name: "Escavada", detail: "Mecanizada" },
  { name: "Strauss", detail: "Moldada in loco" },
  { name: "Barrete", detail: "Seção retangular" },
];

const soilLayers = [
  { depth: "0–2m", name: "Aterro", color: "#c9a96e", nspt: "3", nsptColor: "var(--text-muted-landing)" },
  { depth: "2–5m", name: "Argila mole", color: "#8b7355", nspt: "5", nsptColor: "#f5820d" },
  { depth: "5–9m", name: "Areia fina", color: "#d4a854", nspt: "12", nsptColor: "#f5820d" },
  { depth: "9–13m", name: "Argila rija", color: "#7a6b52", nspt: "18", nsptColor: "#ff9b2e" },
  { depth: "13–16m", name: "Areia média", color: "#c4a64f", nspt: "25", nsptColor: "#ff9b2e" },
  { depth: "16–18m", name: "Silte arenoso", color: "#a09070", nspt: "32", nsptColor: "#22c55e" },
  { depth: "18–20m", name: "Areia grossa", color: "#9a8855", nspt: "40+", nsptColor: "#22c55e" },
];

const bottomChecks = [
  "Relatório PDF gerado automaticamente",
  "Cálculo camada a camada detalhado",
  "Curvas P-Y incluídas",
  "Pronto para impressão e assinatura",
];

/* ── Page ──────────────────────────────────────────────────────────── */

export default function GeotechPage() {
  return (
    <>
      <ScrollReveal />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          backdropFilter: "blur(20px)",
          background: "rgba(10,10,11,0.8)",
          borderBottom: "1px solid var(--border-landing)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-0.5px",
            color: "var(--text)",
          }}
        >
          BY<span style={{ color: "var(--accent-landing)" }}>.</span>FUST
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Link
            href="/#modulos"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-dim)",
              letterSpacing: "0.02em",
            }}
          >
            Módulos
          </Link>
          <a
            href={`${GEOTECH_URL}/geotech/estacas`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Acessar plataforma &rarr;
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "140px 48px 100px",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(96,165,250,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 65% 40%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 65% 40%, black 20%, transparent 70%)",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            right: -50,
            top: -50,
            background:
              "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 12,
              color: "var(--text-muted-landing)",
              marginBottom: 24,
            }}
          >
            <Link
              href="/"
              style={{ color: "var(--text-dim)", transition: "color 0.3s" }}
            >
              BY.FUST
            </Link>
            <span style={{ color: "var(--text-muted-landing)" }}>&rsaquo;</span>
            <Link
              href="/#modulos"
              style={{ color: "var(--text-dim)", transition: "color 0.3s" }}
            >
              Módulos
            </Link>
            <span style={{ color: "var(--text-muted-landing)" }}>&rsaquo;</span>
            <span>BY.GEOTECH</span>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.2)",
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "#60a5fa",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                animation: "pulse-dot 2s ease infinite",
              }}
            />
            Geotecnia &middot; Ativo
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(42px, 5.5vw, 72px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: 24,
            }}
          >
            Capacidade de carga.
            <br />
            <em
              style={{
                fontFamily: "'Bebas Neue', var(--font-bebas), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.04em",
                fontSize: "1.1em",
                color: "var(--text)",
              }}
            >
              VERTICAL E LATERAL.
            </em>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "var(--text-dim)",
              maxWidth: 480,
              marginBottom: 36,
            }}
          >
            Calcule a capacidade de carga de estacas isoladas pelos métodos
            consagrados da geotecnia brasileira. Análise vertical por
            Aoki-Velloso e Décourt-Quaresma, lateral por P-Y com
            diferenças finitas. Tudo com relatório PDF.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              href={`${GEOTECH_URL}/geotech/estacas`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Acessar BY.GEOTECH &rarr;
            </a>
            <a
              href={`${GEOTECH_URL}/geotech/estacas`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Ver exemplo de relatório
            </a>
          </div>
        </div>

        {/* Canvas visual */}
        <GeotechVisual />
      </section>

      {/* ── Methods ──────────────────────────────────────────────── */}
      <section style={{ padding: "120px 48px" }}>
        <div className="reveal">
          <div
            className="section-label"
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--accent-landing)",
              marginBottom: 16,
            }}
          >
            Métodos de cálculo
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Três análises.{" "}
            <em
              style={{
                fontFamily: "'Bebas Neue', var(--font-bebas), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.04em",
                fontSize: "1.15em",
                color: "var(--accent-landing)",
              }}
            >
              UM RELATÓRIO.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-dim)",
              lineHeight: 1.6,
              maxWidth: 560,
              marginBottom: 56,
            }}
          >
            Capacidade vertical e lateral calculadas em paralelo. O relatório
            final traz a envoltória com os dois métodos verticais e a
            análise P-Y completa.
          </p>
        </div>

        {/* Methods grid */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            background: "var(--border-landing)",
            border: "1px solid var(--border-landing)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {methodCards.map((m) => (
            <div
              key={m.name}
              style={{
                background: "var(--bg-elevated)",
                padding: 48,
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  ...(m.iconClass === "vertical"
                    ? {
                        background: "rgba(245,130,13,0.15)",
                        color: "var(--accent-landing)",
                        border: "1px solid rgba(245,130,13,0.25)",
                      }
                    : {
                        background: "rgba(96,165,250,0.15)",
                        color: "#60a5fa",
                        border: "1px solid rgba(96,165,250,0.25)",
                      }),
                }}
              >
                {m.icon}
              </div>

              <div
                style={{
                  fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                  color: "var(--text)",
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-dim)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginBottom: 20,
                }}
              >
                {m.type}
              </div>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--text)",
                  lineHeight: 1.65,
                  marginBottom: 28,
                  opacity: 0.7,
                }}
              >
                {m.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {m.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                      fontSize: 14,
                      color: "var(--text)",
                      opacity: 0.6,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent-landing)",
                        fontSize: 13,
                        opacity: 0.8,
                      }}
                    >
                      &rarr;
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Envoltória bar ─────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--border-landing)",
          borderBottom: "1px solid var(--border-landing)",
          padding: 48,
        }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            flexWrap: "wrap" as const,
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                fontSize: 32,
                fontWeight: 700,
                color: "var(--accent-landing)",
              }}
            >
              ENVOLTÓRIA
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--text-dim)",
                marginTop: 4,
              }}
            >
              Aoki-Velloso &times; Décourt-Quaresma
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-dim)",
              maxWidth: 400,
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            O relatório apresenta a envoltória entre os dois métodos,
            permitindo ao engenheiro adotar o valor mais conservador ou fazer a
            análise comparativa diretamente no PDF.
          </div>
        </div>
      </div>

      {/* ── Estacas ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 48px",
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-landing)",
          borderBottom: "1px solid var(--border-landing)",
        }}
      >
        <div className="reveal">
          <div
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--accent-landing)",
              marginBottom: 16,
            }}
          >
            Tipos de estaca
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            12 tipos.{" "}
            <em
              style={{
                fontFamily: "'Bebas Neue', var(--font-bebas), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.04em",
                fontSize: "1.15em",
                color: "var(--accent-landing)",
              }}
            >
              TODOS COM TRILHO TR.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-dim)",
              lineHeight: 1.6,
              maxWidth: 560,
              marginBottom: 56,
            }}
          >
            Cada tipo de estaca tem seus coeficientes específicos para os
            métodos de Aoki-Velloso e Décourt-Quaresma. Todos
            disponíveis com relatório PDF completo.
          </p>
        </div>

        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {estacas.map((e) => (
            <div
              key={e.name}
              style={{
                padding: "28px 24px",
                border: "1px solid var(--border-landing)",
                borderRadius: 12,
                textAlign: "center",
                transition: "all 0.3s",
                background: "rgba(255,255,255,0.015)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "var(--text)",
                }}
              >
                {e.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
                {e.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 48px",
          position: "relative",
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-landing)",
          borderBottom: "1px solid var(--border-landing)",
        }}
      >
        <div className="reveal" style={{ marginBottom: 64 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--accent-landing)",
              marginBottom: 16,
            }}
          >
            Resultado
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            Perfil &rarr; Cálculo &rarr;{" "}
            <em
              style={{
                fontFamily: "'Bebas Neue', var(--font-bebas), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                letterSpacing: "0.04em",
                fontSize: "1.15em",
                color: "var(--accent-landing)",
              }}
            >
              RELATÓRIO.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-dim)",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Insira o perfil de sondagem camada a camada. O motor calcula por
            Aoki-Velloso e Décourt-Quaresma em paralelo e entrega a
            envoltória.
          </p>
        </div>

        {/* Results layout */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 0,
            border: "1px solid var(--border-landing)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--bg)",
          }}
        >
          {/* Soil profile */}
          <div style={{ borderRight: "1px solid var(--border-landing)" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-landing)",
                fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                color: "var(--text-dim)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Sondagem SP-01</span>
              <span>
                N<sub>SPT</sub>
              </span>
            </div>
            {soilLayers.map((layer, i) => (
              <div
                key={layer.depth}
                style={{
                  display: "grid",
                  gridTemplateColumns: "55px 1fr 55px",
                  alignItems: "center",
                  borderBottom:
                    i < soilLayers.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    padding: "14px 10px",
                    textAlign: "center",
                    color: "var(--text-dim)",
                    fontSize: 12,
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {layer.depth}
                </div>
                <div
                  style={{
                    padding: "14px 16px",
                    color: "var(--text)",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      flexShrink: 0,
                      background: layer.color,
                      display: "inline-block",
                    }}
                  />
                  {layer.name}
                </div>
                <div
                  style={{
                    padding: "14px 10px",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 15,
                    borderLeft: "1px solid rgba(255,255,255,0.04)",
                    color: layer.nsptColor,
                  }}
                >
                  {layer.nspt}
                </div>
              </div>
            ))}
          </div>

          {/* Results col */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border-landing)",
                fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                color: "var(--text-dim)",
              }}
            >
              Hélice contínua &middot; Ø 40cm &middot; L = 16m
            </div>

            {/* Aoki-Velloso result */}
            <ResultBlock
              method="Aoki-Velloso"
              qPonta="412.3 kN"
              qPontaWidth="55%"
              qLateral="287.6 kN"
              qLateralWidth="38%"
              qTotal="699.9 kN"
            />

            {/* Décourt-Quaresma result */}
            <ResultBlock
              method="Décourt-Quaresma"
              qPonta="389.1 kN"
              qPontaWidth="52%"
              qLateral="312.4 kN"
              qLateralWidth="42%"
              qTotal="701.5 kN"
            />

            {/* Envelope */}
            <div
              style={{
                padding: "24px 28px",
                background: "rgba(34,197,94,0.03)",
                borderTop: "1px solid var(--border-landing)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                    opacity: 0.7,
                  }}
                >
                  ENVOLTÓRIA (valor adotado)
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-dim)",
                    marginTop: 2,
                  }}
                >
                  min(Aoki-Velloso, Décourt-Quaresma)
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "rgba(34,197,94,0.75)",
                  }}
                >
                  699.9 kN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom checks */}
        <div
          className="reveal"
          style={{
            marginTop: 32,
            display: "flex",
            gap: 32,
            flexWrap: "wrap" as const,
          }}
        >
          {bottomChecks.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
                fontSize: 14,
                color: "var(--text)",
                opacity: 0.6,
              }}
            >
              <span style={{ color: "#22c55e", fontWeight: 700 }}>&check;</span>
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          padding: "140px 48px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="reveal">
          <h2
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 20,
              position: "relative",
            }}
          >
            Sua próxima estaca
            <br />
            começa{" "}
            <em
              style={{
                fontFamily: "'Bebas Neue', var(--font-bebas), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                color: "#60a5fa",
                letterSpacing: "0.04em",
                fontSize: "1.15em",
              }}
            >
              AQUI.
            </em>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--text-dim)",
              maxWidth: 460,
              margin: "0 auto 36px",
              lineHeight: 1.6,
              position: "relative",
            }}
          >
            Insira o perfil de sondagem, escolha o tipo de estaca e gere o
            relatório completo. Direto no navegador.
          </p>
          <a
            href={`${GEOTECH_URL}/geotech/estacas`}
            target="_blank"
            rel="noreferrer"
            className="btn-large"
            style={{ position: "relative" }}
          >
            Acessar BY.GEOTECH &rarr;
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-landing)",
          padding: "40px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text)",
            }}
          >
            BY<span style={{ color: "var(--accent-landing)" }}>.</span>FUST
          </Link>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted-landing)",
              marginTop: 4,
            }}
          >
            Cálculo estrutural para engenheiros.
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: "var(--text-dim)",
              transition: "color 0.3s",
            }}
          >
            Início
          </Link>
          <Link
            href="/#modulos"
            style={{
              fontSize: 13,
              color: "var(--text-dim)",
              transition: "color 0.3s",
            }}
          >
            Módulos
          </Link>
          <a
            href="#"
            style={{
              fontSize: 13,
              color: "var(--text-dim)",
              transition: "color 0.3s",
            }}
          >
            Suporte
          </a>
          <a
            href="#"
            style={{
              fontSize: 13,
              color: "var(--text-dim)",
              transition: "color 0.3s",
            }}
          >
            Contato
          </a>
        </div>
      </footer>
    </>
  );
}

/* ── Result block sub-component ────────────────────────────────────── */

function ResultBlock({
  method,
  qPonta,
  qPontaWidth,
  qLateral,
  qLateralWidth,
  qTotal,
}: {
  method: string;
  qPonta: string;
  qPontaWidth: string;
  qLateral: string;
  qLateralWidth: string;
  qTotal: string;
}) {
  return (
    <div
      style={{
        padding: 28,
        borderBottom: "1px solid var(--border-landing)",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: "rgba(245,130,13,0.75)" }}>{method}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 4,
            letterSpacing: "0.04em",
            background: "rgba(245,130,13,0.08)",
            color: "rgba(245,130,13,0.6)",
          }}
        >
          VERTICAL
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <BarRow label="Q ponta" value={qPonta} width={qPontaWidth} type="ponta" />
        <BarRow label="Q lateral" value={qLateral} width={qLateralWidth} type="lateral" />
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid var(--border-landing)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 13,
              color: "var(--text-dim)",
            }}
          >
            Q total
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            {qTotal}
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
            fontSize: 13,
            fontWeight: 600,
            padding: "5px 12px",
            borderRadius: 6,
            color: "rgba(34,197,94,0.7)",
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.12)",
          }}
        >
          &check; Verificado
        </div>
      </div>
    </div>
  );
}

/* ── Bar row sub-component ─────────────────────────────────────────── */

function BarRow({
  label,
  value,
  width,
  type,
}: {
  label: string;
  value: string;
  width: string;
  type: "ponta" | "lateral";
}) {
  const bg =
    type === "ponta" ? "rgba(245,130,13,0.65)" : "rgba(96,165,250,0.55)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
          fontSize: 13,
          color: "var(--text)",
          opacity: 0.6,
          width: 80,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 28,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            fontFamily: "'IBM Plex Mono', var(--font-mono), monospace",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            background: bg,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
