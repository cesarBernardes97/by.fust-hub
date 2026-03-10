const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const GEOTECH_PROD_URL = "https://geotech.byfust.com.br";
const BLOCOS_PROD_URL  = ""; // still not live

const geotechUrl = process.env.NEXT_PUBLIC_GEOTECH_URL || GEOTECH_PROD_URL;
const blocosUrl  = process.env.NEXT_PUBLIC_BLOCOS_URL  || BLOCOS_PROD_URL;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ring/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />

      <div className="z-10 max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[150px] md:h-[300px] bg-primary/5 rounded-[100%] blur-[80px] -z-10 pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-foreground drop-shadow-sm">
            BY.FUST
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-wide mb-6">
            Acelere e unifique seus cálculos estruturais
          </p>
          {/* Trust Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 border border-border/60 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              Módulos
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 border border-border/60 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
              Memória de cálculo
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 border border-border/60 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              Relatórios
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto relative">
          <div className="hidden md:block absolute top-[5%] bottom-[5%] left-1/2 w-px bg-border/40 -translate-x-1/2" />

          {/* BY.GEOTECH */}
          <div className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Ativo
              </span>
              <span className="text-xs text-muted-foreground/70 font-medium">Versão 1.0</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
              BY.GEOTECH
            </h2>
            <ul className="mt-4 space-y-3 mb-6 flex-1">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Análises geotécnicas completas de estacas.
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Cálculo de capacidade de carga e recalque automático.
              </li>
            </ul>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <a href={geotechUrl || "#"} target="_blank" rel="noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors opacity-80 hover:opacity-100">
                Ver detalhes
              </a>
              {geotechUrl ? (
                <a href={geotechUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                  Abrir Módulo <ArrowIcon />
                </a>
              ) : (
                <span title="URL não configurada"
                  className="inline-flex items-center rounded-lg bg-muted/30 border border-border px-5 py-2 text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-50">
                  Abrir Módulo <ArrowIcon />
                </span>
              )}
            </div>
          </div>

          {/* BY.BLOCOS */}
          <div className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
                <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Em construção
              </span>
              <span className="text-xs text-muted-foreground/70 font-medium">Breve lançamento</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
              BY.BLOCOS
            </h2>
            <ul className="mt-4 space-y-3 mb-6 flex-1">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Dimensionamento ágil de blocos de coroamento.
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Sapatas estruturais otimizadas com PDF.
              </li>
            </ul>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <a href={blocosUrl || "#"} target="_blank" rel="noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors opacity-80 hover:opacity-100">
                Ver detalhes
              </a>
              {blocosUrl ? (
                <a href={blocosUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                  Abrir Módulo <ArrowIcon />
                </a>
              ) : (
                <span title="URL não configurada"
                  className="inline-flex items-center rounded-lg bg-muted/30 border border-border px-5 py-2 text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-50">
                  Abrir Módulo <ArrowIcon />
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
