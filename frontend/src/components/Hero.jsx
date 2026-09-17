import React from 'react';

export default function Hero({ onRegister, onOpenSubmit, onNavigateTab, stats }) {
  return (
    <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#eadfea] bg-transparent overflow-hidden">
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#211827] tracking-tight leading-tight font-sans mb-5">
          Protect the style you built.
        </h1>

        <p className="text-base sm:text-lg text-[#594d63] max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Artists register their visual style once on-chain. When unauthorized commercial copies appear on the web, 
          GenLayer AI validators independently inspect the evidence and release bounties automatically.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={onRegister}
            className="bg-[#302738] hover:bg-[#493d53] active:scale-95 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all shadow-[0_10px_30px_rgba(48,39,56,0.22)] cursor-pointer"
          >
            Register Your Style
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('hunt')}
            className="bg-white/80 hover:bg-white text-[#211827] font-semibold text-sm px-7 py-3 rounded-full border border-[#eadfea] transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Report Suspect Copy
          </button>
        </div>

        {/* 4-Step Quick Workflow Explainer */}
        <div className="mb-12 p-4 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-[#eadfea] max-w-3xl mx-auto text-left shadow-[0_12px_42px_rgba(116,78,133,0.06)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold mb-3">
            Autonomous Protocol Workflow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            
            <div 
              onClick={onRegister}
              className="p-3 rounded-2xl bg-white/90 border border-[#eadfea] hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">1. Register Policy</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Artist locks style traits and funds bounty escrow.</p>
            </div>

            <div 
              onClick={() => onNavigateTab && onNavigateTab('hunt')}
              className="p-3 rounded-2xl bg-white/90 border border-[#eadfea] hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">2. Submit URL</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Hunters spot unauthorized commercial listings.</p>
            </div>

            <div 
              onClick={() => onNavigateTab && onNavigateTab('explore')}
              className="p-3 rounded-2xl bg-white/90 border border-[#eadfea] hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="font-bold text-zinc-950 font-mono mb-1">3. AI Consensus</div>
              <p className="text-[11px] text-zinc-500 leading-snug">Validators crawl page & verify trait similarity.</p>
            </div>

            <div 
              onClick={() => onNavigateTab && onNavigateTab('hunt')}
              className="p-3 rounded-2xl bg-purple-50/90 border border-purple-200 hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="font-bold text-purple-950 font-mono mb-1">4. Settlement</div>
              <p className="text-[11px] text-purple-700 leading-snug">Enforcement recorded & bounty released to wallet.</p>
            </div>

          </div>
        </div>

        {/* Technical Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#eadfea] shadow-[0_6px_24px_rgba(72,48,84,0.04)]">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Active Styles</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalStyles || '3'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Registered on-chain</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#eadfea] shadow-[0_6px_24px_rgba(72,48,84,0.04)]">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Cases Reviewed</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalCases || '2'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Consensus reached</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#eadfea] shadow-[0_6px_24px_rgba(72,48,84,0.04)]">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Enforcements</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalEnforcements || '0'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Public records</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/80 backdrop-blur-sm border border-purple-200 shadow-[0_6px_24px_rgba(72,48,84,0.04)]">
            <span className="text-[11px] text-purple-700 font-mono block uppercase tracking-wider font-medium">Total Escrow Pool</span>
            <span className="text-2xl font-bold text-purple-950 font-mono mt-1 block">{stats.totalEscrow || '6.0 GEN'}</span>
            <span className="text-[11px] text-purple-700 font-mono mt-1 block">Funded balances</span>
          </div>

        </div>

      </div>
    </section>
  );
}
