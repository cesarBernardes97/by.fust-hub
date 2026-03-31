import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BY.PILAR — Dimensionamento de Pilares de Concreto Armado | BY.FUST",
  description:
    "Dimensione pilares de concreto armado com flexão composta oblíqua, efeitos de 2ª ordem e detalhamento automático. Método da Curvatura Aproximada, Rigidez kappa e Método Geral conforme NBR 6118:2023.",
  keywords: [
    "dimensionamento pilar",
    "pilar concreto armado",
    "flexão composta oblíqua",
    "efeitos de segunda ordem",
    "NBR 6118",
    "método geral pilar",
    "curvatura aproximada",
    "rigidez kappa",
    "cálculo estrutural",
  ],
  openGraph: {
    title: "BY.PILAR — Dimensionamento de Pilares de Concreto Armado",
    description:
      "Flexão composta oblíqua, 2ª ordem automática, 9 seções, detalhamento completo. NBR 6118:2023.",
    url: "https://byfust.com.br/pilar",
    siteName: "BY.FUST",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://byfust.com.br/pilar",
  },
};

const sections = [
  { name: "Retangular", desc: "Seção mais comum em edifícios" },
  { name: "Circular", desc: "Pilares de pontes e marquises" },
  { name: "Oca Retangular", desc: "Tubulão ou pilar caixão" },
  { name: "Oca Circular", desc: "Pilares tubulares" },
  { name: "Seção L", desc: "Pilares de canto" },
  { name: "Seção T", desc: "Pilares de borda" },
  { name: "Seção U/C", desc: "Pilares tipo canal" },
  { name: "Parede", desc: "Paredes estruturais e núcleos" },
  { name: "Genérica", desc: "Área e inércia customizadas" },
];

const diferenciais = [
  {
    number: "01",
    title: "Cálculo real por fibras",
    desc: "A seção é dividida em 900 pontos. O equilíbrio N-Mx-My é resolvido ponto a ponto — sem fórmulas simplificadas, sem seção equivalente. Flexão oblíqua tratada com precisão em qualquer geometria.",
  },
  {
    number: "02",
    title: "2ª ordem pelos dois métodos da norma",
    desc: "Curvatura aproximada e rigidez kappa calculados simultaneamente. O motor escolhe o resultado mais favorável — sem você precisar escolher o método manualmente.",
  },
  {
    number: "03",
    title: "Fluência acoplada na rigidez seccional",
    desc: "Não é só amplificar momento. O coeficiente phi_ef é aplicado diretamente na curvatura do concreto, capturando a perda real de rigidez ao longo do tempo.",
  },
  {
    number: "04",
    title: "Convergência automática armadura-rigidez-capacidade",
    desc: "O dimensionamento itera: estima barras, recalcula rigidez, recalcula esforços de 2ª ordem, ajusta armadura, repete até convergir. Resultado ótimo e normativo a cada cálculo.",
  },
  {
    number: "05",
    title: "Detalhamento completo automático",
    desc: "Armadura longitudinal, estribos (diâmetro, espaçamento, ramos, ganchos) e emenda por traspasse — tudo calculado e detalhado conforme NBR 6118:2023, sem etapa extra.",
  },
];

const capabilities = [
  {
    title: "Método da Curvatura Aproximada",
    desc: "Amplificação de momentos por curvatura 1/r conforme item 15.8.3.3.2 da NBR 6118:2023. Aplicável para esbeltez até 90.",
  },
  {
    title: "Método da Rigidez kappa",
    desc: "Rigidez seccional aproximada conforme item 15.8.3.3.3 da NBR 6118:2023. Considera fluência e armadura estimada.",
  },
  {
    title: "Método Geral (P-Delta)",
    desc: "Para pilares esbeltos (lambda > 90), iteração P-Delta com integração por fibras. O método mais preciso previsto pela norma, ativado automaticamente.",
  },
  {
    title: "Flexão Composta Oblíqua",
    desc: "Equilíbrio N-Mx-My resolvido por integração de fibras na seção real. Sem aproximação por contorno retangular equivalente.",
  },
  {
    title: "Envoltória Resistente",
    desc: "Diagrama de interação N-M da seção para verificação visual e validação dos resultados. Curva completa para qualquer ângulo de flexão.",
  },
  {
    title: "Relatório PDF completo",
    desc: "Memória de cálculo com dados de entrada, verificação de esbeltez, esforços de 2ª ordem, dimensionamento da armadura e detalhamento — pronta para o cliente.",
  },
];

export default function PilarPage() {
  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/[0.04]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            BY<span className="text-primary">.</span>FUST
          </Link>
          <span className="px-4 py-2 text-[13px] font-semibold rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
            Em breve
          </span>
        </nav>
      </header>

      <main className="pt-28 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
            Voltar
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Superestrutura</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            BY.PILAR
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
            Dimensionamento de pilares de concreto armado conforme NBR 6118:2023. Flexão composta oblíqua resolvida por fibras, efeitos de 2ª ordem automáticos, detalhamento completo — do esforço à armadura.
          </p>

          <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            Disponível em breve
          </span>
        </section>

        {/* Seções calculadas */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-2">9 seções transversais</h2>
          <p className="text-muted-foreground text-sm mb-8">De retangulares a seções compostas — cada uma discretizada por fibras.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {sections.map((s) => (
              <div key={s.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-sm font-bold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 diferenciais */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-2">5 diferenciais que separam o BY.PILAR de qualquer planilha</h2>
          <p className="text-muted-foreground text-sm mb-8">Motor de cálculo projetado para precisão e conformidade normativa.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diferenciais.map((d) => (
              <div key={d.number} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                <span className="text-4xl font-black text-primary/15 block mb-2">{d.number}</span>
                <h3 className="text-sm font-bold text-foreground mb-2">{d.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capacidades técnicas */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-8">Motor de cálculo</h2>

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
                Verificação de esbeltez (item 15.8), efeitos de 2ª ordem (item 15.8.3), dimensionamento à flexão composta (item 17.2.5),
                detalhamento de armadura longitudinal e transversal (item 18.4).
                Concreto de C20 a C90, aço CA-50 e CA-60.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black tracking-tight mb-3">Quer ser avisado quando lançar?</h2>
          <p className="text-muted-foreground text-sm mb-6">O BY.PILAR está em fase final de desenvolvimento. Cadastre-se na plataforma para ser notificado.</p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold text-black transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Criar conta gratuita
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </section>
      </main>

      {/* Footer */}
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
