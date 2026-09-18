import React, { useState } from 'react';
import { weiToGen, txExplorerUrl } from '../config';

export default function HunterBoard({ styles, cases = [], onSelectStyle, onOpenSubmit, onSelectCase, claimableReward, onClaimReward, isClaiming, onDonate, currency = 'GEN' }) {
  const [activeSubTab, setActiveSubTab] = useState('bounties'); // 'bounties' | 'history'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-6">
        <div>
          <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold block mb-1">
            Bounty Program
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Hunter Board</h1>
          <p className="text-xs text-zinc-600 mt-1">
            Find commercial copies of registered styles, submit URLs, and receive on-chain payouts upon validator confirmation.
          </p>
        </div>

        {/* Claimable Rewards */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center gap-4">
          <div>
            <span className="text-[10px] font-mono text-purple-700 block uppercase font-medium">Your Claimable Balance</span>
            <span className="text-lg font-bold text-purple-950 font-mono">{weiToGen(claimableReward || '0')} {currency}</span>
          </div>
          <button
            onClick={onClaimReward}
            disabled={isClaiming || !claimableReward || claimableReward === '0'}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            {isClaiming ? 'Claiming...' : 'Claim'}
          </button>
        </div>
      </div>

      {/* Subtab Navigation: Active Bounties vs Reported History */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveSubTab('bounties')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'bounties'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Active Style Bounties ({styles.length})
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <span>Report History & AI Verdicts</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
            activeSubTab === 'history' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'
          }`}>
            {cases.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Available Targets Grid */}
      {activeSubTab === 'bounties' ? (
        <div className="space-y-3">
          {styles.map((s) => (
            <div
              key={s.style_id}
              className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <img
                  src={s.reference_collage_url}
                  alt={s.style_name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200 cursor-pointer"
                  onClick={() => onSelectStyle && onSelectStyle(s)}
                  onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 
                      onClick={() => onSelectStyle && onSelectStyle(s)}
                      className="text-base font-bold text-zinc-950 cursor-pointer hover:text-purple-600 transition-colors"
                    >
                      {s.style_name}
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-500">by {s.artist_display_name}</span>
                  </div>
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5 max-w-lg">
                    {s.descriptor}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1">
                    <span>Threshold: <strong className="text-zinc-800">{s.similarity_threshold}%</strong></span>
                    <span>•</span>
                    <span>Escrow Pool: <strong className="text-purple-600">{weiToGen(s.available_bounty_pool)} {currency}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward per Case</span>
                  <span className="text-sm font-bold text-zinc-950 font-mono">{weiToGen(s.bounty_per_case_wei)} {currency}</span>
                </div>

                <div className="flex items-center gap-2">
                  {onDonate && (
                    <button
                      onClick={() => onDonate(s)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium text-xs px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      title="Donate to boost this style's bounty pool"
                    >
                      <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>Donate</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectStyle && onSelectStyle(s)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-xs px-3 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onOpenSubmit(s)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    Submit URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TAB 2: Reported Cases & History Across Protocol */
        <div className="space-y-3">
          {cases.length === 0 ? (
            <div className="p-8 text-center bg-white border border-zinc-200 rounded-xl">
              <p className="text-xs text-zinc-500">No infringement reports recorded yet.</p>
            </div>
          ) : (
            cases.map((c) => {
              const isDeriv = c.verdict === 'DERIVATIVE';
              const isClean = c.verdict === 'CLEAN';
              const matchedStyle = styles.find(s => String(s.style_id) === String(c.style_id));
              return (
                <div
                  key={c.case_id}
                  className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-purple-300 transition-all text-xs shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-zinc-950 text-sm">
                        Case #{c.case_id}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isDeriv
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : isClean
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.verdict || 'AMBIGUOUS'}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px]">against</span>
                      <button
                        onClick={() => matchedStyle && onSelectStyle && onSelectStyle(matchedStyle)}
                        className="font-semibold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                      >
                        {c.style_name || `Style #${c.style_id}`}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                      <span>Similarity: <strong className="text-zinc-900">{c.similarity}%</strong></span>
                      <span>•</span>
                      <span>Commercial: <strong className="text-zinc-900">{c.commercial_use ? 'Yes' : 'No'}</strong></span>
                      <span>•</span>
                      <span>Confidence: <strong className="text-zinc-900">{c.confidence}%</strong></span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block mb-0.5 uppercase">Suspect Evidence:</span>
                    <a
                      href={c.suspect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-purple-600 hover:text-purple-800 hover:underline truncate block max-w-full"
                    >
                      {c.suspect_url} ↗
                    </a>
                  </div>

                  {c.reason && (
                    <p className="text-zinc-700 text-xs bg-purple-50/50 p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                      <strong className="text-purple-900 font-mono text-[10px] uppercase block mb-0.5">AI Jury Consensus Reason:</strong>
                      {c.reason}
                    </p>
                  )}

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                      {c.txHash ? (
                        <a
                          href={txExplorerUrl(c.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-600 underline"
                        >
                          Tx: {c.txHash.slice(0, 8)}...{c.txHash.slice(-6)} ↗
                        </a>
                      ) : (
                        <span>On-Chain Finalized</span>
                      )}
                      {c.bounty_amount_wei && c.bounty_amount_wei !== '0' && (
                        <span className="text-emerald-600 font-semibold">
                          Bounty: +{weiToGen(c.bounty_amount_wei)} {currency}
                        </span>
                      )}
                    </div>

                    {onSelectCase && (
                      <button
                        onClick={() => onSelectCase(c)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                      >
                        View Full Dossier →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}

