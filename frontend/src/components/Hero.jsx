import React from 'react';
import { ShieldCheck, Zap, Award, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenSubmit, onExplore, stats }) {
  return (
    <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/60 overflow-hidden">
      
      {/* Background glow subtle effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-mono mb-6 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>GenLayer Autonomous Protocols Track</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight font-sans mb-4">
          Protect the style you built.
        </h1>

        <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Artists define protection policies once. Style Hunters discover commercial AI derivatives. 
          GenLayer multi-validator AI reaches consensus and enforces policy autonomously — <span className="text-zinc-200 font-semibold">no votes, no manual admins required</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => onOpenSubmit()}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-lg border border-purple-400/30 flex items-center gap-2 transition-all shadow-md shadow-purple-950/40"
          >
            <Search className="w-4 h-4" />
            <span>Submit Suspect URL</span>
          </button>

          <button
            onClick={onExplore}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-sm px-6 py-3 rounded-lg border border-zinc-700/80 flex items-center gap-2 transition-all"
          >
            <span>Explore Protected Styles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Value Prop Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-mono block">Registered Styles</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{stats.totalStyles || '2'}</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active on-chain
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-mono block">Cases Evaluated</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{stats.totalCases || '1'}</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" /> 100% AI Consensus
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-mono block">Enforcement Records</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{stats.totalEnforcements || '0'}</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
              <Award className="w-3 h-3 text-amber-400" /> Autonomous actions
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-xs text-zinc-400 font-mono block">Bounty Escrow Pool</span>
            <span className="text-xl font-bold text-purple-300 font-mono mt-0.5 block">4.0 GEN</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-purple-400" /> Claimable rewards
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
