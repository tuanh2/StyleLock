import React, { useState, useEffect } from 'react';
import { weiToGen } from '../config';

export default function SubmitModal({ isOpen, onClose, selectedStyle, styles, onSubmit, isSubmitting }) {
  const [styleId, setStyleId] = useState('1');
  const [suspectUrl, setSuspectUrl] = useState('');
  const [claimText, setClaimText] = useState('');

  // Close on Escape key
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

  // Synchronize when opened
  useEffect(() => {
    if (!isOpen) return;

    if (selectedStyle) {
      setStyleId(String(selectedStyle.style_id));
      setSuspectUrl('');
      const traits = (selectedStyle.protected_traits || '').split(';').slice(0, 2).map(t => t.trim()).join(', ');
      setClaimText(`Suspected unauthorized copy exploiting traits of ${selectedStyle.style_name} (${traits}).`);
    } else if (styles && styles.length > 0) {
      setStyleId(String(styles[0].style_id));
      setSuspectUrl('');
      setClaimText('');
    }
  }, [isOpen, selectedStyle, styles]);

  if (!isOpen) return null;

  const currentStyle = (styles || []).find(s => String(s.style_id) === String(styleId)) || selectedStyle || styles?.[0];
  const traits = (currentStyle?.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!suspectUrl.trim()) {
      alert('Please enter the suspect URL to report.');
      return;
    }
    onSubmit({
      styleId: String(currentStyle?.style_id || styleId),
      suspectUrl: suspectUrl.trim(),
      claimText: claimText.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 font-semibold px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
              Evidence Submission
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Autonomous AI Adjudication
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Report Suspect Copy</h2>
          <p className="text-xs text-zinc-600 mt-1">
            Submit an unauthorized commercial copy or infringing post. GenLayer AI validators will inspect the live URL and evaluate style traits on-chain.
          </p>
        </div>

        {/* Target Style Profile Summary Card */}
        {currentStyle && (
          <div className="mb-5 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 flex items-start gap-3">
            <img
              src={currentStyle.reference_collage_url}
              alt={currentStyle.style_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover border border-zinc-200 bg-zinc-200 shrink-0"
              onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-950 truncate">
                  Style #{currentStyle.style_id} — {currentStyle.style_name}
                </h3>
                <span className="text-[11px] font-mono font-bold text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded shrink-0">
                  {weiToGen(currentStyle.bounty_per_case_wei)} GEN Bounty
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                Artist: {currentStyle.artist_display_name} • Min. Threshold: {currentStyle.similarity_threshold}%
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {traits.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-zinc-600 border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* If no selected style, allow selecting from dropdown */}
        {!selectedStyle && styles && styles.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Target Style Profile
            </label>
            <select
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            >
              {styles.map(s => (
                <option key={s.style_id} value={s.style_id}>
                  Style #{s.style_id} — {s.style_name} ({s.artist_display_name})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Suspect Listing or Artwork URL <span className="text-purple-600">*</span>
            </label>
            <input
              type="url"
              required
              value={suspectUrl}
              onChange={(e) => setSuspectUrl(e.target.value)}
              placeholder="https://... (e.g. storefront, product page, X/Twitter post, or marketplace listing)"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              GenLayer AI validators will fetch and analyze live evidence directly from this URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Hunter Claim Statement & Evidence Description <span className="text-purple-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Describe the suspected infringement: which style traits are reproduced, whether commercial sale/products are offered..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 placeholder-zinc-400 outline-none focus:border-purple-600 focus:bg-white resize-none"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Provide context for validators: e.g. "Commercial merch copying line contours, character proportions, and muted palette."
            </p>
          </div>

          <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200 text-[11px] text-purple-900 leading-relaxed">
            If validators reach consensus that this URL matches <strong className="font-semibold">{currentStyle?.style_name}</strong> above the {currentStyle?.similarity_threshold}% threshold with commercial intent, the <strong>{weiToGen(currentStyle?.bounty_per_case_wei)} GEN</strong> bounty will be automatically awarded to your wallet!
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !suspectUrl.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Evaluating on GenLayer...</span>
                </>
              ) : (
                <span>Submit Report ({weiToGen(currentStyle?.bounty_per_case_wei)} GEN)</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
