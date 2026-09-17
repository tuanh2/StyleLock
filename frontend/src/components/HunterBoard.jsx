import React from 'react';
import { Target, Zap, Award, Search, ArrowRight, DollarSign } from 'lucide-react';
import { weiToGen } from '../config';

export default function HunterBoard({ styles, onSelectStyle, onOpenSubmit, claimableReward, onClaimReward, isClaiming }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Target className="w-4 h-4" />
            <span>Style Hunter Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Bounty Opportunities</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Discover commercial AI derivatives, submit public URLs, and earn autonomous bounties upon consensus.
          </p>
        </div>

        {/* Claimable Rewards Widget */}
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-purple-900/50 flex items-center gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Your Claimable Bounty</span>
            <span className="text-lg font-bold text-purple-300 font-mono">{weiToGen(claimableReward || '0')} GEN</span>
          </div>
          <button
            onClick={onClaimReward}
            disabled={isClaiming || !claimableReward || claimableReward === '0'}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-sm active:scale-95"
          >
            {isClaiming ? 'Claiming...' : 'Claim Bounty'}
          </button>
        </div>
      </div>

      {/* Available Targets Grid */}
      <div className="space-y-4">
        {styles.map((s) => (
          <div
            key={s.style_id}
            className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={s.reference_collage_url}
                alt={s.style_name}
                className="w-14 h-14 rounded-lg object-cover bg-zinc-950 shrink-0 border border-zinc-700/60"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{s.style_name}</h3>
                  <span className="text-[11px] font-mono text-zinc-400">by {s.artist_display_name}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 max-w-lg">
                  {s.descriptor}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1">
                  <span>Threshold: <strong>{s.similarity_threshold}%</strong></span>
                  <span>•</span>
                  <span>Pool: <strong className="text-purple-300">{weiToGen(s.available_bounty_pool)} GEN</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right sm:block hidden">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward</span>
                <span className="text-sm font-bold text-white font-mono">{weiToGen(s.bounty_per_case_wei)} GEN</span>
              </div>

              <button
                onClick={() => onOpenSubmit(s)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-lg border border-purple-400/30 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Submit URL</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
