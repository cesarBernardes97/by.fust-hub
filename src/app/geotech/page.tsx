import Link from "next/link";

export default function GeotechPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="z-10 bg-slate-800/50 border border-slate-700/50 rounded-3xl p-12 text-center backdrop-blur-lg shadow-2xl max-w-2xl w-full">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
          BY.GEOTECH
        </h1>
        
        <p className="text-slate-300 text-lg mb-10">
          Módulo disponível — a futura integração do backend e frontend independentes ocorrerá via link/rota reversa neste painel.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 px-8 py-3 text-sm font-semibold transition-colors duration-200 border border-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Home
        </Link>
      </div>
    </main>
  );
}
