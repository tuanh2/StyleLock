import React from 'react';
import { ShieldCheck, Zap, Award, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenSubmit, onExplore, stats }) {
  return (
    <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-white de1-grid overflow-hidden">
      
      {/* Corner crosshairs on hero section frame */}
      <div className="max-w-5xl mx-auto relative">
        
        <div className="text-center relative z-10 py-4">
          
          {/* Track Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            <span className="font-medium">GenLayer Hackathon • Autonomous Protocols Track</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-tight font-sans mb-5">
            Protect the style you built.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
            Define your visual protection policy once. Style hunters locate unauthorized commercial derivatives. 
            GenLayer's AI validator network investigates evidence and enforces escrow bounties autonomously — <strong className="text-zinc-950 font-semibold">zero manual voting or human gatekeepers needed</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => onOpenSubmit()}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-lg border border-purple-500/30 flex items-center gap-2 transition-all shadow-sm hover:shadow-purple-200"
            >
              <Search className="w-4 h-4" />
              <span>Submit Suspect URL</span>
            </button>

            <button
              onClick={onExplore}
              className="bg-zinc-50 hover:bg-zinc-100 text-zinc-800 hover:text-zinc-950 font-medium text-sm px-6 py-3 rounded-lg border border-zinc-300/80 flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Explore Protected Styles</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Technical Metrics Grid with corner accents */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            
            <div className="relative p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-purple-300 transition-colors">
              <span className="text-[11px] text-zinc-500 font-mono block uppercase tracking-wider">Registered Styles</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono mt-0.5 block">{stats.totalStyles || '2'}</span>
              <span className="text-[11px] text-zinc-600 flex items-center gap-1 mt-1 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active on Studionet
              </span>
            </div>

            <div className="relative p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-purple-300 transition-colors">
              <span className="text-[11px] text-zinc-500 font-mono block uppercase tracking-wider">Cases Evaluated</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono mt-0.5 block">{stats.totalCases || '1'}</span>
              <span className="text-[11px] text-zinc-600 flex items-center gap-1 mt-1 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> 100% Multi-Validator
              </span>
            </div>

            <div className="relative p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-purple-300 transition-colors">
              <span className="text-[11px] text-zinc-500 font-mono block uppercase tracking-wider">Enforcement Logs</span>
              <span className="text-2xl font-bold text-zinc-950 font-mono mt-0.5 block">{stats.totalEnforcements || '0'}</span>
              <span className="text-[11px] text-zinc-600 flex items-center gap-1 mt-1 font-sans">
                <Award className="w-3.5 h-3.5 text-amber-600" /> On-Chain Actions
              </span>
            </div>

            <div className="relative p-4 rounded-xl bg-purple-50/60 border border-purple-200 shadow-xs hover:border-purple-400 transition-colors">
              <span className="text-[11px] text-purple-700 font-mono block uppercase tracking-wider">Bounty Escrow</span>
              <span className="text-2xl font-bold text-purple-900 font-mono mt-0.5 block">4.0 GEN</span>
              <span className="text-[11px] text-purple-700 flex items-center gap-1 mt-1 font-sans">
                <Zap className="w-3.5 h-3.5 text-purple-600" /> Autonomous Payout
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
