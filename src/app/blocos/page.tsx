import type { Metadata } from "next";
import Link from "next/link";
import { HeroVisualLazy } from "@/components/hero-visual-lazy";

const APP_URL = process.env.NEXT_PUBLIC_BLOCOS_URL || "https://blocos.byfust.com.br";

export const metadata: Metadata = {
  title: "BY.BLOCOS — Dimensionamento de Blocos de Coroamento | BY.FUST",
  description:
    "Dimensione blocos de coroamento sobre estacas com modelo de bielas e tirantes 3D. 13 tipologias de 1 a 9 estacas, múltiplos pilares, estacas inclinadas, NBR 6118:2023, relatório PDF e visualização 3D interativa.",
  keywords: [
    "bloco de coroamento",
    "bloco sobre estacas",
    "bielas e tirantes",
    "STM 3D",
    "dimensionamento bloco fundação",
    "NBR 6118",
    "cálculo estrutural blocos",
  ],
  openGraph: {
    title: "BY.BLOCOS — Dimensionamento de Blocos de Coroamento",
    description:
      "13 tipologias de blocos sobre estacas com STM 3D, verificação de nós CCC/CCT/CTT e relatório PDF automático.",
    url: "https://byfust.com.br/blocos",
    siteName: "BY.FUST",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://byfust.com.br/blocos",
  },
};

const blockTypes = [
  { piles: "1 estaca", shape: "Pontual", desc: "Carga centrada, modelo de contato rígido" },
  { piles: "2 estacas", shape: "Retangular", desc: "Alinhamento linear" },
  { piles: "3 estacas", shape: "Linear / Triangular", desc: "Em linha ou triangular com chanfro" },
  { piles: "4 estacas", shape: "Retangular 2×2", desc: "Configuração mais comum" },
  { piles: "5 estacas", shape: "Retangular / Trapezoidal / Pentagonal", desc: "2×2+1 central, 2+3, ou pentágono regular" },
  { piles: "6 estacas", shape: "Retangular 2×3", desc: "Grade retangular" },
  { piles: "7 estacas", shape: "Trapezoidal 3+4", desc: "Com chanfro trapezoidal" },
  { piles: "8–9 estacas", shape: "Retangular 3×3", desc: "Grade completa ou sem estaca central" },
];

const capabilities = [
  {
    title: "Motor STM 3D",
    desc: "Modelo de bielas e tirantes tridimensional com cinemática de bloco rígido. Pipeline de 10 etapas: geometria, rigidez, solver global 6-DOF, classificação de bielas, cálculo de tirantes (NNLS), verificação de nós.",
  },
  {
    title: "Múltiplos pilares e excentricidades",
    desc: "Suporte a múltiplos pilares por bloco com excentricidades de pilar e estaca. Pilares retangulares, circulares, em L e em C, com posicionamento e rotação livres.",
  },
  {
    title: "Estacas verticais e inclinadas",
    desc: "Arranjos com estacas verticais e inclinadas. Inclinação e azimute configuráveis por estaca, além de propriedades individuais (diâmetro, comprimento, tipo de execução).",
  },
  {
    title: "Verificação de nós CCC/CCT/CTT",
    desc: "Nós CCC, CCT e CTT verificados automaticamente conforme NBR 6118:2023, com tensões limites de 0,85·fcd, 0,75·fcd e 0,40·fcd respectivamente.",
  },
  {
    title: "Detalhamento de tirantes",
    desc: "Dimensionamento automático dos tirantes horizontais com cálculo de área de aço, escolha de bitola, espaçamento e verificação de ancoragem reta e com gancho.",
  },
  {
    title: "Visualização 3D interativa",
    desc: "Viewer Three.js com visualização do bloco, estacas, pilar e overlay dos caminhos de bielas e tirantes. Modos perspectiva e técnico.",
  },
  {
    title: "Relatório PDF + Excel",
    desc: "Memória de cálculo completa com capa, dados de entrada, reações, bielas, tirantes, verificação de nós, resumo executivo e log de cálculo. Exportação para PDF e planilha .xlsx.",
  },
];

export default function BlocosPage() {
  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/[0.04]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            BY<span className="text-primary">.</span>FUST
          </Link>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-[13px] font-semibold rounded-lg bg-primary text-black transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Acessar BY.BLOCOS
          </a>
        </nav>
      </header>

      <main className="pt-28 pb-20">
        {/* Hero — two columns: text + animation */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
            Voltar
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Left — text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Fundações</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                BY.BLOCOS
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
                Dimensionamento de blocos de coroamento sobre estacas pelo método de bielas e tirantes (STM) tridimensional, conforme NBR 6118:2023.
              </p>

              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.97]"
              >
                Abrir BY.BLOCOS
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            </div>

            {/* Right — Planta / Corte / 3D animation */}
            <div className="blocos-hero-visual relative w-full lg:w-[420px] aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
              <style>{`
                .blocos-hero-visual .hero-visual-container {
                  position: relative !important;
                  right: auto !important;
                  top: auto !important;
                  transform: none !important;
                  width: 100% !important;
                  height: 100% !important;
                  display: block !important;
                }
              `}</style>
              <HeroVisualLazy />
            </div>
          </div>
        </section>

        {/* Tipos de bloco */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-2">13 tipos de bloco</h2>
          <p className="text-muted-foreground text-sm mb-8">De 1 a 9 estacas, em configurações retangulares, triangulares, trapezoidais e pentagonais.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {blockTypes.map((bt) => (
              <div key={bt.piles} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-sm font-bold text-foreground">{bt.piles}</p>
                <p className="text-xs text-primary font-semibold mt-0.5">{bt.shape}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{bt.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capacidades */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-8">O que o módulo faz</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap) => (
              <div key={cap.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="text-sm font-bold text-foreground mb-2">{cap.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Norma */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">NBR 6118:2023</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Coeficientes de segurança conforme a norma vigente: γc = 1,4 (concreto), γs = 1,15 (aço), γf = 1,4 (ações).
                Concreto de C20 a C90 e aço CA-50. Verificação de tensões nos nós conforme item 22.3 da NBR 6118.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black tracking-tight mb-3">Pronto para dimensionar?</h2>
          <p className="text-muted-foreground text-sm mb-6">Acesse o módulo e gere seu primeiro relatório.</p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Acessar BY.BLOCOS
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-black tracking-tighter text-foreground">
            BY<span className="text-primary">.</span>FUST
          </Link>
          <p className="text-[11px] text-muted-foreground/60">&copy; 2024–2026 BY.FUST</p>
        </div>
      </footer>
    </>
  );
}
