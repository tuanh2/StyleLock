import React from 'react';
import { weiToGen } from '../config';

export default function HunterBoard({ styles, onSelectStyle, onOpenSubmit, claimableReward, onClaimReward, isClaiming }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
        <div>
          <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold block mb-1">
            Bounty Program
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Active Style Bounties</h1>
          <p className="text-xs text-zinc-600 mt-1">
            Find commercial copies of registered styles, submit URLs, and receive on-chain payouts upon validator confirmation.
          </p>
        </div>

        {/* Claimable Rewards */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center gap-4">
          <div>
            <span className="text-[10px] font-mono text-purple-700 block uppercase font-medium">Claimable Balance</span>
            <span className="text-lg font-bold text-purple-950 font-mono">{weiToGen(claimableReward || '0')} GEN</span>
          </div>
          <button
            onClick={onClaimReward}
            disabled={isClaiming || !claimableReward || claimableReward === '0'}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all"
          >
            {isClaiming ? 'Claiming...' : 'Claim'}
          </button>
        </div>
      </div>

      {/* Available Targets Grid */}
      <div className="space-y-3">
        {styles.map((s) => (
          <div
            key={s.style_id}
            className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={s.reference_collage_url}
                alt={s.style_name}
                className="w-14 h-14 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-950">{s.style_name}</h3>
                  <span className="text-[11px] font-mono text-zinc-500">by {s.artist_display_name}</span>
                </div>
                <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5 max-w-lg">
                  {s.descriptor}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1">
                  <span>Threshold: <strong className="text-zinc-800">{s.similarity_threshold}%</strong></span>
                  <span>•</span>
                  <span>Pool: <strong className="text-purple-600">{weiToGen(s.available_bounty_pool)} GEN</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right sm:block hidden">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward</span>
                <span className="text-sm font-bold text-zinc-950 font-mono">{weiToGen(s.bounty_per_case_wei)} GEN</span>
              </div>

              <button
                onClick={() => onOpenSubmit(s)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all"
              >
                Submit URL
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
