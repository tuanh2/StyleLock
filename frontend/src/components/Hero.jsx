import React from 'react';

export default function Hero({ onRegister, onOpenSubmit, onNavigateTab, stats }) {
  return (
    <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white de1-grid overflow-hidden">
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-tight font-sans mb-5">
          Protect the style you built.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Artists register their visual style once on-chain. When unauthorized commercial copies appear on the web, 
          GenLayer AI validators independently inspect the evidence and release bounties automatically.
        </p>

        {/* Action CTAs: Register Your Style as PRIMARY; Report Suspect Copy as SECONDARY */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={onRegister}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all shadow-sm"
          >
            Register Your Style
          </button>

          <button
            onClick={() => onOpenSubmit()}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium text-sm px-6 py-3 rounded-lg border border-zinc-200 transition-all"
          >
            Report Suspect Copy
          </button>
        </div>

        {/* 4-Step Quick Workflow Explainer */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 max-w-3xl mx-auto text-left shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold mb-3">
            Autonomous Protocol Workflow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            
            <div 
              onClick={onRegister}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 cursor-pointer transition-colors"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">1. Register Policy</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Artist locks style traits and funds bounty escrow.</p>
            </div>

            <div 
              onClick={() => onOpenSubmit()}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 cursor-pointer transition-colors"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">2. Submit URL</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Hunters spot unauthorized commercial listings.</p>
            </div>

            <div 
              onClick={() => onNavigateTab && onNavigateTab('market')}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 cursor-pointer transition-colors"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">3. AI Consensus</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Validators crawl page & verify trait similarity.</p>
            </div>

            <div 
              onClick={() => onNavigateTab && onNavigateTab('hunt')}
              className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 hover:border-purple-300 cursor-pointer transition-colors"
            >
              <div className="font-bold text-purple-950 font-mono mb-1">4. Settlement</div>
              <p className="text-[11px] text-purple-700 leading-snug">Enforcement recorded & bounty released to wallet.</p>
            </div>

          </div>
        </div>

        {/* Technical Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          
          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Active Styles</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalStyles || '2'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Registered on-chain</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Cases Reviewed</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalCases || '1'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Consensus reached</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Enforcements</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalEnforcements || '0'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Public records</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 shadow-xs">
            <span className="text-[11px] text-purple-700 font-mono block uppercase tracking-wider">Total Escrow Pool</span>
            <span className="text-2xl font-bold text-purple-950 font-mono mt-1 block">{stats.totalEscrow || '4.0 GEN'}</span>
            <span className="text-[11px] text-purple-700 font-mono mt-1 block">Funded balances</span>
          </div>

        </div>

      </div>
    </section>
  );
}
