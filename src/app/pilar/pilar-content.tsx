"use client";

import { useEffect } from "react";
import Link from "next/link";

export function PilarContent() {
  // Reveal on scroll (same as HTML)
  useEffect(() => {
    const els = document.querySelectorAll(".pl-rv");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("pl-in"); }),
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Variables (same as HTML) ── */
        .pl-page{--bg:#0B0D10;--bg2:#0F1114;--bg3:#151719;--border:#1F2228;--text:#E0E0E6;--text2:#B0B0BA;--dim:#70707C;--muted:#45454F;--accent:#FF8A1F;--mono:var(--font-mono),monospace;--sans:var(--font-syne),sans-serif;--cond:var(--font-bebas),sans-serif}
        .pl-page{font-family:var(--mono);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}

        /* Grain */
        .pl-page::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.015;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px}

        /* Nav */
        .pl-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;backdrop-filter:blur(20px);background:rgba(11,13,16,.7);border-bottom:1px solid rgba(255,255,255,.04)}
        .pl-nav-logo{font-family:var(--mono);font-weight:700;font-size:16px}.pl-nav-logo span{color:var(--accent)}
        .pl-nav-r{display:flex;align-items:center;gap:24px}
        .pl-nav-r a{font-size:13px;font-weight:600;color:var(--dim);text-decoration:none;transition:color .2s}.pl-nav-r a:hover{color:var(--text)}
        .pl-nav-btn{background:var(--accent);color:var(--bg);padding:8px 20px;border-radius:7px;font-weight:700;font-size:13px;font-family:var(--sans);border:none;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block}.pl-nav-btn:hover{background:#ff9b2e}

        /* Hero */
        .pl-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 48px 80px;position:relative;overflow:hidden}
        .pl-hero-glow{position:absolute;top:20%;right:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,138,31,.06) 0%,transparent 60%);pointer-events:none}
        .pl-hero-breadcrumb{font-size:12px;color:var(--dim);margin-bottom:24px;display:flex;align-items:center;gap:8px}
        .pl-hero-breadcrumb a{color:var(--dim);text-decoration:none;transition:color .2s}.pl-hero-breadcrumb a:hover{color:var(--text)}
        .pl-hero-breadcrumb .pl-sep{color:var(--muted)}
        .pl-hero-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 14px;border-radius:6px;margin-bottom:28px;background:rgba(255,138,31,.06);color:var(--accent);border:1px solid rgba(255,138,31,.12)}
        .pl-hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent)}
        .pl-hero h1{font-family:var(--sans);font-size:clamp(40px,6vw,72px);font-weight:800;line-height:.92;letter-spacing:-.04em;margin-bottom:20px;max-width:700px}
        .pl-hero h1 em{font-family:var(--cond);font-style:normal;color:var(--text);font-weight:400;letter-spacing:.03em;font-size:1.05em;display:block;margin-top:4px}
        .pl-hero-desc{font-size:15px;color:var(--dim);line-height:1.7;max-width:560px;margin-bottom:32px}
        .pl-hero-ctas{display:flex;gap:12px}
        .pl-btn{padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;font-family:var(--sans);cursor:pointer;transition:all .2s;border:none;display:inline-flex;align-items:center;gap:8px;text-decoration:none}
        .pl-btn-primary{background:var(--accent);color:var(--bg)}.pl-btn-primary:hover{background:#ff9b2e;box-shadow:0 4px 20px rgba(255,138,31,.25)}
        .pl-btn-ghost{background:transparent;border:1px solid var(--muted);color:var(--text)}.pl-btn-ghost:hover{border-color:var(--dim);background:rgba(255,255,255,.02)}

        /* Specs bar */
        .pl-specs{padding:0 48px;border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}
        .pl-specs-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:0}
        .pl-spec{padding:40px 24px;text-align:center;border-right:1px solid rgba(255,255,255,.04)}
        .pl-spec:last-child{border-right:none}
        .pl-spec-val{font-family:var(--cond);font-size:clamp(36px,4vw,52px);letter-spacing:.02em;line-height:1}
        .pl-spec-val span{color:var(--accent)}
        .pl-spec-label{font-size:12px;color:var(--dim);margin-top:6px}

        /* Method */
        .pl-method{padding:80px 48px;border-top:1px solid rgba(255,255,255,.04)}
        .pl-method-inner{max-width:1100px;margin:0 auto}
        .pl-sec-tag{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
        .pl-sec-h{font-family:var(--sans);font-size:clamp(28px,3.5vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.05;margin-bottom:12px;max-width:600px}
        .pl-sec-sub{font-size:14px;color:var(--dim);line-height:1.65;margin-bottom:48px;max-width:540px}
        .pl-method-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--muted);border-radius:12px;overflow:hidden}
        .pl-method-card{background:var(--bg);padding:36px 28px;transition:background .3s}
        .pl-method-card:hover{background:var(--bg2)}
        .pl-method-card-icon{font-family:var(--cond);font-size:48px;color:var(--accent);line-height:1;margin-bottom:12px;opacity:.6}
        .pl-method-card-name{font-family:var(--sans);font-size:18px;font-weight:700;margin-bottom:8px}
        .pl-method-card-desc{font-size:13px;color:var(--dim);line-height:1.6}
        .pl-method-card-tag{display:inline-block;font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;margin-top:12px;background:rgba(255,138,31,.06);color:var(--accent)}

        /* Diferenciais */
        .pl-diff{padding:80px 48px;border-top:1px solid rgba(255,255,255,.04)}
        .pl-diff-inner{max-width:1100px;margin:0 auto}
        .pl-diff-item{display:grid;grid-template-columns:80px 1fr;gap:24px;padding:32px 0;border-bottom:1px solid rgba(255,255,255,.04);transition:all .3s}
        .pl-diff-item:hover{padding-left:8px}
        .pl-diff-item:last-child{border-bottom:none}
        .pl-diff-num{font-family:var(--cond);font-size:56px;color:var(--accent);line-height:1;opacity:.35}
        .pl-diff-title{font-family:var(--sans);font-size:20px;font-weight:700;margin-bottom:8px}
        .pl-diff-desc{font-size:14px;color:var(--dim);line-height:1.65;max-width:580px}
        .pl-diff-highlight{font-size:12px;color:var(--accent);font-weight:600;margin-top:10px;display:flex;align-items:center;gap:6px}
        .pl-diff-highlight::before{content:'';width:12px;height:1px;background:var(--accent)}

        /* Seções */
        .pl-sections{padding:80px 48px;border-top:1px solid rgba(255,255,255,.04)}
        .pl-sections-inner{max-width:1100px;margin:0 auto}
        .pl-sec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .pl-sec-card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:20px 20px 16px;text-align:center;transition:all .3s;display:flex;flex-direction:column;align-items:center}
        .pl-sec-card:hover{border-color:rgba(255,138,31,.25);background:var(--bg3)}
        .pl-sec-card svg{width:80px;height:80px;margin-bottom:12px}
        .pl-sec-card-name{font-size:14px;font-weight:700;margin-bottom:3px}
        .pl-sec-card-sub{font-size:11px;color:var(--dim)}

        /* CTA */
        .pl-cta{padding:100px 48px;text-align:center}
        .pl-cta-inner{max-width:600px;margin:0 auto}
        .pl-cta h2{font-family:var(--sans);font-size:clamp(32px,4.5vw,52px);font-weight:800;letter-spacing:-.03em;line-height:.95;margin-bottom:16px}
        .pl-cta h2 em{font-family:var(--cond);font-style:normal;color:var(--accent);display:block;margin-top:4px;letter-spacing:.03em;font-size:1.05em;opacity:.7}
        .pl-cta p{font-size:15px;color:var(--dim);line-height:1.6;margin-bottom:32px;max-width:420px;margin-left:auto;margin-right:auto}
        .pl-cta .pl-btn-primary{font-size:16px;padding:16px 40px}

        /* Footer */
        .pl-footer{border-top:1px solid rgba(255,255,255,.04);padding:28px 48px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)}
        .pl-footer a{color:var(--dim);margin-left:20px;text-decoration:none;transition:color .2s}.pl-footer a:hover{color:var(--text)}

        /* Reveal */
        .pl-rv{opacity:0;transform:translateY(24px);transition:all .7s cubic-bezier(.4,0,.2,1)}.pl-rv.pl-in{opacity:1;transform:translateY(0)}
        .pl-rv-d1{transition-delay:.1s}.pl-rv-d2{transition-delay:.2s}.pl-rv-d3{transition-delay:.3s}

        @media(max-width:900px){
          .pl-hero{padding:100px 24px 60px}
          .pl-method,.pl-diff,.pl-sections,.pl-cta{padding:60px 24px}
          .pl-method-grid{grid-template-columns:1fr}
          .pl-sec-grid{grid-template-columns:repeat(2,1fr)}
          .pl-specs-inner{grid-template-columns:1fr 1fr}
          .pl-spec:nth-child(2){border-right:none}
          .pl-diff-item{grid-template-columns:50px 1fr;gap:16px}
        }
      `}</style>

      <div className="pl-page">
        {/* Nav */}
        <nav className="pl-nav">
          <Link href="/" className="pl-nav-logo">BY<span>.</span>FUST</Link>
          <div className="pl-nav-r">
            <Link href="/">Home</Link>
            <Link href="/#modulos">Modulos</Link>
            <Link href="/#precos">Precos</Link>
            <Link href="/cadastro" className="pl-nav-btn">Criar conta gratuita</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="pl-hero">
          <div className="pl-hero-glow" />
          <div className="pl-hero-breadcrumb">
            <Link href="/">BY.FUST</Link> <span className="pl-sep">&rsaquo;</span>
            <Link href="/#modulos">Modulos</Link> <span className="pl-sep">&rsaquo;</span>
            BY.PILAR
          </div>
          <div className="pl-hero-badge">Pilares &middot; Em breve</div>
          <h1 className="pl-rv">Flexao obliqua.<br /><em>RESOLVIDA DE VERDADE.</em></h1>
          <p className="pl-hero-desc pl-rv pl-rv-d1">
            Dimensionamento de pilares de concreto armado conforme NBR 6118:2023.
            Flexao composta obliqua resolvida por fibras, efeitos de 2a ordem automaticos,
            detalhamento completo — do esforco a armadura.
          </p>
          <div className="pl-hero-ctas pl-rv pl-rv-d2">
            <Link href="/cadastro" className="pl-btn pl-btn-primary">Entrar na lista de espera &rarr;</Link>
            <Link href="/#modulos" className="pl-btn pl-btn-ghost">Ver outros modulos</Link>
          </div>
        </section>

        {/* Specs bar */}
        <section className="pl-specs">
          <div className="pl-specs-inner">
            <div className="pl-spec pl-rv"><div className="pl-spec-val">900<span>+</span></div><div className="pl-spec-label">Pontos de fibra por secao</div></div>
            <div className="pl-spec pl-rv pl-rv-d1"><div className="pl-spec-val">9<span>&times;</span></div><div className="pl-spec-label">Tipologias de secao</div></div>
            <div className="pl-spec pl-rv pl-rv-d2"><div className="pl-spec-val">3<span>&times;</span></div><div className="pl-spec-label">Metodos de 2a ordem</div></div>
            <div className="pl-spec pl-rv pl-rv-d3"><div className="pl-spec-val">PDF<span>.</span></div><div className="pl-spec-label">Memoria de calculo completa</div></div>
          </div>
        </section>

        {/* Metodo */}
        <section className="pl-method">
          <div className="pl-method-inner">
            <div className="pl-sec-tag">Metodo de calculo</div>
            <h2 className="pl-sec-h pl-rv">Tres metodos.<br />O motor escolhe o melhor.</h2>
            <p className="pl-sec-sub pl-rv pl-rv-d1">O BY.PILAR calcula pelos dois metodos simplificados simultaneamente e, quando necessario, ativa o Metodo Geral. Sem voce escolher manualmente.</p>
            <div className="pl-method-grid">
              <div className="pl-method-card pl-rv">
                <div className="pl-method-card-icon">&kappa;</div>
                <div className="pl-method-card-name">Rigidez &kappa;</div>
                <div className="pl-method-card-desc">Metodo da rigidez adimensional &kappa; conforme NBR 6118:2023. Usado para pilares curtos e medios com &lambda; &le; 90.</div>
                <div className="pl-method-card-tag">&lambda; &le; 90</div>
              </div>
              <div className="pl-method-card pl-rv pl-rv-d1">
                <div className="pl-method-card-icon">1/r</div>
                <div className="pl-method-card-name">Curvatura aproximada</div>
                <div className="pl-method-card-desc">Metodo da curvatura aproximada (1/r). Calculado em paralelo com o metodo &kappa; — o motor adota o mais favoravel.</div>
                <div className="pl-method-card-tag">&lambda; &le; 90</div>
              </div>
              <div className="pl-method-card pl-rv pl-rv-d2">
                <div className="pl-method-card-icon">P-&Delta;</div>
                <div className="pl-method-card-name">Metodo Geral</div>
                <div className="pl-method-card-desc">Iteracao P-&Delta; com nao-linearidade fisica e geometrica. Ativado automaticamente para pilares esbeltos. O mais preciso previsto pela norma.</div>
                <div className="pl-method-card-tag">&lambda; &gt; 90 &middot; Automatico</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Diferenciais */}
        <section className="pl-diff">
          <div className="pl-diff-inner">
            <div className="pl-sec-tag">Diferenciais</div>
            <h2 className="pl-sec-h pl-rv">O que separa o BY.PILAR<br />de qualquer planilha.</h2>
            <p className="pl-sec-sub pl-rv pl-rv-d1">Cinco decisoes de engenharia que nao cabem numa planilha.</p>

            <div>
              <div className="pl-diff-item pl-rv">
                <div className="pl-diff-num">01</div>
                <div>
                  <div className="pl-diff-title">Calculo real por fibras</div>
                  <div className="pl-diff-desc">A secao e dividida em 900 pontos. O equilibrio N–Mx–My e resolvido ponto a ponto — sem formulas simplificadas, sem secao equivalente. Flexao obliqua tratada com precisao em qualquer geometria.</div>
                  <div className="pl-diff-highlight">900 fibras &middot; Qualquer secao &middot; Obliqua real</div>
                </div>
              </div>
              <div className="pl-diff-item pl-rv">
                <div className="pl-diff-num">02</div>
                <div>
                  <div className="pl-diff-title">2a ordem pelos dois metodos da norma</div>
                  <div className="pl-diff-desc">Curvatura aproximada e rigidez &kappa; calculados simultaneamente. O motor escolhe o resultado mais favoravel — sem voce precisar escolher o metodo manualmente.</div>
                  <div className="pl-diff-highlight">Curvatura + Rigidez &kappa; &middot; Selecao automatica</div>
                </div>
              </div>
              <div className="pl-diff-item pl-rv">
                <div className="pl-diff-num">03</div>
                <div>
                  <div className="pl-diff-title">Fluencia acoplada na rigidez seccional</div>
                  <div className="pl-diff-desc">Nao e so amplificar momento. O coeficiente &phi;ef e aplicado diretamente na curvatura do concreto, capturando a perda real de rigidez ao longo do tempo.</div>
                  <div className="pl-diff-highlight">&phi;ef na curvatura &middot; Perda de rigidez real</div>
                </div>
              </div>
              <div className="pl-diff-item pl-rv">
                <div className="pl-diff-num">04</div>
                <div>
                  <div className="pl-diff-title">Convergencia automatica armadura-rigidez-capacidade</div>
                  <div className="pl-diff-desc">O dimensionamento itera: estima barras &rarr; recalcula rigidez &rarr; recalcula esforcos de 2a ordem &rarr; ajusta armadura &rarr; repete ate convergir. Resultado otimo e normativo a cada calculo.</div>
                  <div className="pl-diff-highlight">Loop iterativo &middot; Armadura otimizada</div>
                </div>
              </div>
              <div className="pl-diff-item pl-rv">
                <div className="pl-diff-num">05</div>
                <div>
                  <div className="pl-diff-title">Detalhamento completo gerado automaticamente</div>
                  <div className="pl-diff-desc">Armadura longitudinal, estribos (diametro, espacamento, ramos, ganchos) e emenda por traspasse — tudo calculado e detalhado conforme NBR 6118:2023, sem etapa extra.</div>
                  <div className="pl-diff-highlight">Longitudinal + Estribos + Emenda &middot; PDF</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secoes */}
        <section className="pl-sections">
          <div className="pl-sections-inner">
            <div className="pl-sec-tag">Secoes calculadas</div>
            <h2 className="pl-sec-h pl-rv">9 tipologias de secao.</h2>
            <p className="pl-sec-sub pl-rv pl-rv-d1">Cada uma com calculo por fibras e detalhamento automatico.</p>
            <div className="pl-sec-grid">
              {/* Retangular */}
              <div className="pl-sec-card pl-rv">
                <svg viewBox="0 0 80 80"><rect x="15" y="15" width="50" height="50" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/><circle cx="22" cy="22" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="22" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="58" cy="22" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="22" cy="58" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="58" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="58" cy="58" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="22" cy="40" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="58" cy="40" r="2" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Retangular</div><div className="pl-sec-card-sub">Secao cheia</div>
              </div>
              {/* Circular */}
              <div className="pl-sec-card pl-rv pl-rv-d1">
                <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="28" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/><circle cx="40" cy="15" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="65" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="15" cy="40" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="65" cy="40" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="22" cy="22" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="58" cy="22" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="22" cy="58" r="2" fill="#FF8A1F" opacity=".6"/><circle cx="58" cy="58" r="2" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Circular</div><div className="pl-sec-card-sub">Secao cheia</div>
              </div>
              {/* Oca Retangular */}
              <div className="pl-sec-card pl-rv pl-rv-d2">
                <svg viewBox="0 0 80 80"><rect x="12" y="12" width="56" height="56" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/><rect x="22" y="22" width="36" height="36" fill="rgba(11,13,16,.9)" stroke="rgba(255,255,255,.2)" strokeWidth="1"/><circle cx="17" cy="17" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="17" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="63" cy="17" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="17" cy="63" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="63" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="63" cy="63" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="17" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="63" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Oca Retangular</div><div className="pl-sec-card-sub">Secao vazada</div>
              </div>
              {/* Oca Circular */}
              <div className="pl-sec-card pl-rv">
                <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="28" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/><circle cx="40" cy="40" r="16" fill="rgba(11,13,16,.9)" stroke="rgba(255,255,255,.2)" strokeWidth="1"/><circle cx="40" cy="14" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="66" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="14" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="66" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="20" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="60" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="20" cy="60" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="60" cy="60" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Oca Circular</div><div className="pl-sec-card-sub">Secao vazada</div>
              </div>
              {/* L */}
              <div className="pl-sec-card pl-rv pl-rv-d1">
                <svg viewBox="0 0 80 80"><polygon points="12,12 42,12 42,42 68,42 68,68 12,68" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinejoin="miter"/><circle cx="18" cy="18" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="36" cy="18" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="18" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="62" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="18" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="62" cy="48" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="42" cy="48" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Secao L</div><div className="pl-sec-card-sub">Pilar de canto</div>
              </div>
              {/* T */}
              <div className="pl-sec-card pl-rv pl-rv-d2">
                <svg viewBox="0 0 80 80"><polygon points="8,14 72,14 72,32 52,32 52,68 28,68 28,32 8,32" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinejoin="miter"/><circle cx="14" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="66" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="34" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="34" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Secao T</div><div className="pl-sec-card-sub">Pilar de borda</div>
              </div>
              {/* U/C */}
              <div className="pl-sec-card pl-rv">
                <svg viewBox="0 0 80 80"><polygon points="10,14 70,14 70,32 58,32 58,68 10,68 10,50 22,50 22,32 10,32" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinejoin="miter"/><circle cx="16" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="64" cy="20" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="16" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="40" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="52" cy="62" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="64" cy="40" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Secao U/C</div><div className="pl-sec-card-sub">Canal aberto</div>
              </div>
              {/* Parede */}
              <div className="pl-sec-card pl-rv pl-rv-d1">
                <svg viewBox="0 0 80 80"><rect x="28" y="8" width="24" height="64" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/><circle cx="34" cy="14" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="14" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="34" cy="66" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="66" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="34" cy="30" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="30" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="34" cy="50" r="1.8" fill="#FF8A1F" opacity=".6"/><circle cx="46" cy="50" r="1.8" fill="#FF8A1F" opacity=".6"/></svg>
                <div className="pl-sec-card-name">Parede</div><div className="pl-sec-card-sub">h/b &ge; 5</div>
              </div>
              {/* Generica */}
              <div className="pl-sec-card pl-rv pl-rv-d2">
                <svg viewBox="0 0 80 80"><polygon points="20,14 60,14 65,28 62,50 52,64 28,64 18,50 15,28" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" strokeDasharray="3,2" strokeLinejoin="round"/><line x1="30" y1="36" x2="50" y2="36" stroke="rgba(255,255,255,.12)" strokeWidth=".5"/><line x1="40" y1="24" x2="40" y2="54" stroke="rgba(255,255,255,.12)" strokeWidth=".5"/><text x="40" y="42" textAnchor="middle" fill="rgba(255,255,255,.2)" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="600">A, I</text></svg>
                <div className="pl-sec-card-name">Generica</div><div className="pl-sec-card-sub">Area e inercia customizadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pl-cta">
          <div className="pl-cta-inner pl-rv">
            <h2>Seu pilar calculado<em>COMO A NORMA PEDE.</em></h2>
            <p>Seja o primeiro a usar o BY.PILAR. Entre na lista de espera e receba acesso antecipado.</p>
            <Link href="/cadastro" className="pl-btn pl-btn-primary">Entrar na lista de espera &rarr;</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pl-footer">
          <span>&copy; 2025 BY.FUST</span>
          <div>
            <Link href="/blocos">BY.BLOCOS</Link>
            <Link href="/geotech">BY.GEOTECH</Link>
            <Link href="/pilar">BY.PILAR</Link>
            <Link href="/#suporte">Suporte</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
