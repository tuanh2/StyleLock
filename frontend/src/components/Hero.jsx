import React from 'react';

export default function Hero({ onOpenSubmit, onExplore, stats }) {
  return (
    <section className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white de1-grid overflow-hidden">
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-tight font-sans mb-5">
          Protect the style you built.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed mb-10">
          Artists register their style parameters once. When unauthorized commercial copies appear on the web, 
          GenLayer validators independently inspect the evidence and release bounties on-chain.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <button
            onClick={() => onOpenSubmit()}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-lg transition-all shadow-sm"
          >
            Submit Suspect Work
          </button>

          <button
            onClick={onExplore}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium text-sm px-6 py-3 rounded-lg border border-zinc-200 transition-all"
          >
            Explore Protected Styles
          </button>
        </div>

        {/* Technical Metrics Grid - Pure clean numbers, no icon clutter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          
          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Styles</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalStyles || '2'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Active on-chain</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Cases</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalCases || '1'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Reviewed by consensus</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <span className="text-[11px] text-zinc-400 font-mono block uppercase tracking-wider">Enforcements</span>
            <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{stats.totalEnforcements || '0'}</span>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">Public logs</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 shadow-xs">
            <span className="text-[11px] text-purple-700 font-mono block uppercase tracking-wider">Bounty Pool</span>
            <span className="text-2xl font-bold text-purple-950 font-mono mt-1 block">4.0 GEN</span>
            <span className="text-[11px] text-purple-700 font-mono mt-1 block">Escrow balance</span>
          </div>

        </div>

      </div>
    </section>
  );
}
