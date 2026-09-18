import React from 'react';
import { weiToGen, txExplorerUrl } from '../config';

export default function StyleDetailView({ style, cases = [], onBack, onReport, onDonate, onSelectCase }) {
  if (!style) return null;

  const traits = (style.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);
  const styleCases = (cases || []).filter(c => String(c.style_id) === String(style.style_id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
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
          <span>On-Chain Verified Style Profile</span>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Reference Collage Image */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="relative h-72 w-full rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner group">
              <img
                src={style.reference_collage_url}
                alt={style.style_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/images/ink-nocturne.jpg';
                }}
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-800 border border-zinc-200 shadow-xs font-medium">
                Reference Artwork Collage
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {onDonate && (
                <button
                  type="button"
                  onClick={() => onDonate(style)}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs py-3 rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>❤️</span>
                  <span>Donate Pool</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onReport && onReport(style)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Report Copy</span>
              </button>
            </div>
          </div>

          {/* Style Info & Parameters */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                {style.style_name}
              </h1>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Active Protocol Protection
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-500 mb-6">
              Registered by <span className="font-semibold text-zinc-800">{style.artist_display_name}</span>
              {style.artist_address && (
                <span className="ml-1 text-zinc-400">({style.artist_address.slice(0, 8)}...{style.artist_address.slice(-6)})</span>
              )}
            </p>

            {/* Descriptor Box */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                Visual Style Descriptor
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                {style.descriptor}
              </p>
            </div>

            {/* Protected Traits */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                Protected Trait Signatures
              </h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Similarity Threshold</span>
                <span className="text-xl font-bold text-zinc-950 font-mono mt-0.5 block">{style.similarity_threshold}%</span>
                <span className="text-[10px] text-zinc-500 font-mono">Minimum AI match</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Min. Confidence</span>
                <span className="text-xl font-bold text-zinc-950 font-mono mt-0.5 block">{style.minimum_confidence || 75}%</span>
                <span className="text-[10px] text-zinc-500 font-mono">Validator consensus</span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward per Case</span>
                <span className="text-xl font-bold text-purple-700 font-mono mt-0.5 block">{weiToGen(style.bounty_per_case_wei)} GEN</span>
                <span className="text-[10px] text-zinc-500 font-mono">Paid to confirmed hunter</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-700 uppercase block font-semibold">Available Pool</span>
                  {onDonate && (
                    <button
                      type="button"
                      onClick={() => onDonate(style)}
                      className="text-[10px] font-mono font-bold text-purple-700 hover:text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      + Boost
                    </button>
                  )}
                </div>
                <span className="text-xl font-bold text-purple-950 font-mono mt-0.5 block">{weiToGen(style.available_bounty_pool)} GEN</span>
                <span className="text-[10px] text-purple-700 font-mono">Funded bounty pool</span>
              </div>
            </div>

            {/* License Terms */}
            <div className="mt-6 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-mono">
              <strong className="text-zinc-900 block font-sans text-xs mb-0.5 font-semibold">License Terms:</strong>
              {style.license_terms || 'Commercial AI derivatives using this registered style require prior authorization.'}
            </div>

          </div>
        </div>
      </div>

      {/* SECTION: REPORTED CASES & ADJUDICATION HISTORY */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                Reported Cases & AI Verdict History
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-200">
                {styleCases.length} {styleCases.length === 1 ? 'Report' : 'Reports'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Complete on-chain history of suspect commercial infringement submissions evaluated by GenLayer AI validators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onReport && onReport(style)}
            className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            + Submit New Infringement
          </button>
        </div>

        {styleCases.length === 0 ? (
          <div className="p-10 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-xl">
              🛡️
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-1">No Infringement Reports Yet</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mb-4">
              No suspect commercial copies have been reported against this visual style. Be the first hunter to find a matching commercial violation and earn <strong className="text-purple-700 font-mono">{weiToGen(style.bounty_per_case_wei)} GEN</strong>!
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
          <div className="space-y-4">
            {styleCases.map((c) => {
              const isDeriv = c.verdict === 'DERIVATIVE';
              const isClean = c.verdict === 'CLEAN';
              return (
                <div
                  key={c.case_id}
                  className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-purple-300 transition-all text-xs shadow-2xs"
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
                    <span className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase font-semibold">Suspect Evidence URL:</span>
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

                  {/* Matched Traits / Differences if available */}
                  {c.matched_traits && c.matched_traits.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mr-1">Matched Traits:</span>
                      {c.matched_traits.map((t, idx) => (
                        <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Tx & Dossier button */}
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
                            Reward: +{weiToGen(c.bounty_amount_wei)} GEN
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
