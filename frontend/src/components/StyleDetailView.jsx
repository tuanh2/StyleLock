import React from 'react';
import { weiToGen, txExplorerUrl } from '../config';

export default function StyleDetailView({ style, cases = [], onBack, onReport, onDonate, onSelectCase, currency = 'GEN' }) {
  if (!style) return null;

  const traits = (style.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);
  const styleCases = (cases || []).filter(c => String(c.style_id) === String(style.style_id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-950 transition-colors bg-white hover:bg-zinc-100 border border-zinc-200 px-3.5 py-2 rounded-xl shadow-xs cursor-pointer active:scale-95 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Hunter Board</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
            Style #{style.style_id}
          </span>
          <span className="text-zinc-300">•</span>
          <span>On-Chain Verified Style</span>
        </div>
      </div>

      {/* Main Profile Card — Compact & Balanced 2-Column Layout */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left Column (5 cols): Artwork + License */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner group">
              <img
                src={style.reference_collage_url}
                alt={style.style_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                onError={(e) => {
                  e.target.src = '/images/ink-nocturne.jpg';
                }}
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-800 border border-zinc-200 shadow-xs font-medium">
                Reference Artwork Collage
              </div>
            </div>

            {/* License Terms Card */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-700 uppercase mb-1">
                <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>License & Protection Terms</span>
              </div>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-mono">
                {style.license_terms || 'Commercial AI derivatives using this registered style are strictly prohibited without prior authorization.'}
              </p>
            </div>
          </div>

          {/* Right Column (7 cols): Info, Traits, Escrow Stats & Action Buttons */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title & Verified Badge */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                  {style.style_name}
                </h1>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Active Protocol Protection
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-500">
                Registered by <strong className="text-zinc-800">{style.artist_display_name}</strong>
                {style.artist_address && (
                  <span className="ml-1 text-zinc-400">({style.artist_address.slice(0, 8)}...{style.artist_address.slice(-6)})</span>
                )}
              </p>
            </div>

            {/* Visual Style Descriptor */}
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                Visual Style Descriptor
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200">
                {style.descriptor}
              </p>
            </div>

            {/* Protected Traits */}
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                Protected Trait Signatures
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {traits.map((trait, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Unified Escrow & Bounty Metrics Panel */}
            <div className="bg-gradient-to-br from-purple-50/60 via-white to-purple-50/30 rounded-2xl border border-purple-200/80 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-700 uppercase block font-semibold">Escrow Pool</span>
                  <span className="text-lg sm:text-xl font-bold text-purple-950 font-mono mt-0.5 block">
                    {weiToGen(style.available_bounty_pool)} {currency}
                  </span>
                  <span className="text-[10px] text-purple-700/80 font-mono">Funded bounty</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Reward / Case</span>
                  <span className="text-lg sm:text-xl font-bold text-zinc-950 font-mono mt-0.5 block">
                    {weiToGen(style.bounty_per_case_wei)} {currency}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Hunter payout</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Similarity</span>
                  <span className="text-lg sm:text-xl font-bold text-zinc-900 font-mono mt-0.5 block">
                    {style.similarity_threshold}%
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Threshold</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">Confidence</span>
                  <span className="text-lg sm:text-xl font-bold text-zinc-900 font-mono mt-0.5 block">
                    {style.minimum_confidence || 75}%
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">AI Consensus</span>
                </div>
              </div>
            </div>

            {/* Actions Bar — Placed naturally next to the metrics */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onReport && onReport(style)}
                className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 px-5 rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Report Infringement</span>
                <span className="font-mono bg-purple-500/50 px-2 py-0.5 rounded text-[11px]">
                  {weiToGen(style.bounty_per_case_wei)} {currency} Bounty
                </span>
              </button>

              {onDonate && (
                <button
                  type="button"
                  onClick={() => onDonate(style)}
                  className="w-full sm:w-auto bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>Donate Pool</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* SECTION: REPORTED CASES & ADJUDICATION HISTORY */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                Reported Cases & AI Verdict History
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-200">
                {styleCases.length} {styleCases.length === 1 ? 'Report' : 'Reports'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Complete on-chain history of suspect commercial infringement submissions evaluated by GenLayer AI validators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onReport && onReport(style)}
            className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            + Submit New Infringement
          </button>
        </div>

        {styleCases.length === 0 ? (
          <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2.5">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-1">No Infringement Reports Yet</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mb-3.5">
              No suspect commercial copies have been reported against this visual style. Be the first hunter to find a matching commercial violation and earn <strong className="text-purple-700 font-mono">{weiToGen(style.bounty_per_case_wei)} {currency}</strong>!
            </p>
            <button
              type="button"
              onClick={() => onReport && onReport(style)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Report Suspect Listing Now
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {styleCases.map((c) => {
              const isDeriv = c.verdict === 'DERIVATIVE';
              const isClean = c.verdict === 'CLEAN';
              return (
                <div
                  key={c.case_id}
                  className="p-4 sm:p-5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-purple-300 transition-all text-xs shadow-2xs"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-200/80">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950 text-sm">
                        Case #{c.case_id}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full ${
                          isDeriv
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : isClean
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.verdict || 'AMBIGUOUS'}
                      </span>
                      {c.status && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                          {c.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-600">
                      <span>Similarity: <strong className="text-zinc-900">{c.similarity}%</strong></span>
                      <span>•</span>
                      <span>Commercial Use: <strong className="text-zinc-900">{c.commercial_use ? 'Yes' : 'No'}</strong></span>
                      <span>•</span>
                      <span>Confidence: <strong className="text-zinc-900">{c.confidence}%</strong></span>
                    </div>
                  </div>

                  {/* Suspect URL & Evidence */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase font-semibold">Suspect Evidence URL:</span>
                    <a
                      href={c.suspect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-purple-600 hover:text-purple-800 hover:underline break-all bg-white px-3 py-1.5 rounded-lg border border-zinc-200 inline-block"
                    >
                      {c.suspect_url} ↗
                    </a>
                  </div>

                  {/* Hunter Claim */}
                  {c.claim_text && (
                    <div className="mb-3 p-3 rounded-lg bg-white border border-zinc-200">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block mb-0.5">
                        Hunter Statement:
                      </span>
                      <p className="text-xs text-zinc-700 italic">
                        "{c.claim_text}"
                      </p>
                    </div>
                  )}

                  {/* AI Jury Consensus Reason */}
                  {c.reason && (
                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 mb-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-800 uppercase mb-1">
                        <span>⚖️</span>
                        <span>GenLayer AI Jury Consensus Reasoning</span>
                      </div>
                      <p className="text-xs text-zinc-800 leading-relaxed">
                        {c.reason}
                      </p>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                      {c.txHash ? (
                        <a
                          href={txExplorerUrl(c.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-purple-600 transition-colors underline"
                        >
                          Tx: {c.txHash.slice(0, 10)}...{c.txHash.slice(-6)} ↗
                        </a>
                      ) : (
                        <span>On-Chain Finalized</span>
                      )}
                      {c.bounty_amount_wei && c.bounty_amount_wei !== '0' && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold font-mono">
                            Reward: +{weiToGen(c.bounty_amount_wei)} {currency}
                          </span>
                        </>
                      )}
                    </div>

                    {onSelectCase && (
                      <button
                        type="button"
                        onClick={() => onSelectCase(c)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white hover:bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                      >
                        View Full Dossier →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
