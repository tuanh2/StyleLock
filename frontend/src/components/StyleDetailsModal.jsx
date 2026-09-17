import React, { useEffect } from 'react';
import { weiToGen } from '../config';

export default function StyleDetailsModal({ isOpen, onClose, style, onReport }) {
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

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
            <span className="text-[10px] font-mono text-purple-700 uppercase block font-medium">Style Escrow Pool</span>
            <span className="text-lg font-bold text-purple-950 font-mono mt-0.5 block">{weiToGen(style.available_bounty_pool)} GEN</span>
            <span className="text-[10px] text-purple-700 font-mono">Funded pool</span>
          </div>
        </div>

        {/* License Terms */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 mb-6">
          <strong className="text-zinc-900 block font-mono text-[11px] mb-0.5 uppercase">License & Protection Terms:</strong>
          {style.license_terms || 'Commercial AI derivatives using this style require prior authorization.'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onReport) onReport(style);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-xs active:scale-95"
          >
            Report Suspect Copy ({weiToGen(style.bounty_per_case_wei)} GEN Bounty)
          </button>
        </div>

      </div>
    </div>
  );
}
