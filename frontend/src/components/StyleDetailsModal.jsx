import React, { useEffect } from 'react';
import { weiToGen, txExplorerUrl } from '../config';

export default function StyleDetailsModal({ isOpen, onClose, style, cases = [], onReport, onSelectCase, onDonate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !style) return null;

  const traits = (style.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);
  const styleCases = (cases || []).filter(c => String(c.style_id) === String(style.style_id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Style #{style.style_id}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              On-Chain Profile
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">{style.style_name}</h2>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono">
            Created by {style.artist_display_name} ({style.artist_address ? `${style.artist_address.slice(0, 6)}...${style.artist_address.slice(-4)}` : 'On-Chain Artist'})
          </p>
        </div>

        {/* Reference Image Preview */}
        <div className="relative h-60 w-full rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-6">
          <img
            src={style.reference_collage_url}
            alt={style.style_name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/ink-nocturne.jpg';
            }}
          />
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-800 border border-zinc-200 shadow-xs">
            Reference Artwork Collage
          </div>
        </div>

        {/* Style Descriptor */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
            Visual Style Descriptor
          </h3>
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
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
              <span key={i} className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200">
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Policy & Pool Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Similarity Threshold</span>
            <span className="text-lg font-bold text-zinc-950 font-mono mt-0.5 block">{style.similarity_threshold}%</span>
            <span className="text-[10px] text-zinc-500 font-mono">Minimum match</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Min. Confidence</span>
            <span className="text-lg font-bold text-zinc-950 font-mono mt-0.5 block">{style.minimum_confidence || 75}%</span>
            <span className="text-[10px] text-zinc-500 font-mono">Validator consensus</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Bounty Per Case</span>
            <span className="text-lg font-bold text-zinc-950 font-mono mt-0.5 block">{weiToGen(style.bounty_per_case_wei)} GEN</span>
            <span className="text-[10px] text-zinc-500 font-mono">Hunter payout</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-700 uppercase block font-medium">Style Escrow Pool</span>
              {onDonate && (
                <button
                  type="button"
                  onClick={() => onDonate(style)}
                  className="text-[10px] font-mono font-bold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  title="Donate to boost this style's bounty pool"
                >
                  + Boost
                </button>
              )}
            </div>
            <span className="text-lg font-bold text-purple-950 font-mono mt-0.5 block">{weiToGen(style.available_bounty_pool)} GEN</span>
            <span className="text-[10px] text-purple-700 font-mono">Funded bounty pool</span>
          </div>
        </div>

        {/* Adjudication & Check History */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
              <span>Case Adjudication & Check History</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold font-mono">
                {styleCases.length} {styleCases.length === 1 ? 'Report' : 'Reports'}
              </span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              On-Chain AI Verdicts
            </span>
          </div>

          {styleCases.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
              <p className="text-xs text-zinc-600 mb-2">
                No suspect listings have been submitted against this style yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onReport) onReport(style);
                }}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
              >
                + Be the first to report an infringement ({weiToGen(style.bounty_per_case_wei)} GEN Bounty)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {styleCases.map((c) => {
                const isDeriv = c.verdict === 'DERIVATIVE';
                const isClean = c.verdict === 'CLEAN';
                return (
                  <div
                    key={c.case_id}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-purple-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900">
                          Case #{c.case_id}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDeriv
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : isClean
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.verdict || 'AMBIGUOUS'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span>Similarity: <strong className="text-zinc-900">{c.similarity}%</strong></span>
                        <span>•</span>
                        <span>Commercial: <strong className="text-zinc-900">{c.commercial_use ? 'Yes' : 'No'}</strong></span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">Suspect Evidence URL:</span>
                      <a
                        href={c.suspect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-purple-600 hover:text-purple-800 hover:underline truncate block max-w-full"
                      >
                        {c.suspect_url} ↗
                      </a>
                    </div>

                    {c.claim_text && (
                      <p className="text-zinc-600 text-[11px] mb-2 bg-white/80 p-2 rounded border border-zinc-200/80">
                        <strong className="text-zinc-800 font-mono text-[10px] uppercase">Hunter Claim:</strong> {c.claim_text}
                      </p>
                    )}

                    {c.reason && (
                      <p className="text-zinc-700 text-[11px] leading-relaxed bg-white p-2.5 rounded-lg border border-zinc-200">
                        <strong className="text-purple-700 font-mono text-[10px] uppercase block mb-0.5">AI Jury Consensus Reason:</strong>
                        {c.reason}
                      </p>
                    )}

                    <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                      {c.txHash ? (
                        <a
                          href={txExplorerUrl(c.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-zinc-400 hover:text-purple-600 transition-colors"
                        >
                          Tx: {c.txHash.slice(0, 10)}...{c.txHash.slice(-6)} ↗
                        </a>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400">On-Chain Finalized</span>
                      )}

                      {onSelectCase && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectCase(c);
                          }}
                          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
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

        {/* License Terms */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 mb-6">
          <strong className="text-zinc-900 block font-mono text-[11px] mb-0.5 uppercase">License & Protection Terms:</strong>
          {style.license_terms || 'Commercial AI derivatives using this style require prior authorization.'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
          <div>
            {onDonate && (
              <button
                type="button"
                onClick={() => onDonate(style)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>Donate to Bounty Pool</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onReport) onReport(style);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Report Suspect Copy ({weiToGen(style.bounty_per_case_wei)} GEN Bounty)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
