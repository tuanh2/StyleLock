import React, { useState } from 'react';
import { X, Search, Zap, Cpu } from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoFixtures';

export default function SubmitModal({ isOpen, onClose, selectedStyle, styles, onSubmit, isSubmitting }) {
  if (!isOpen) return null;

  const [styleId, setStyleId] = useState(selectedStyle?.style_id || '1');
  const [suspectUrl, setSuspectUrl] = useState('');
  const [claimText, setClaimText] = useState('');
  const [activePreset, setActivePreset] = useState(null);

  const currentStyle = styles.find(s => String(s.style_id) === String(styleId)) || selectedStyle || styles[0];

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setStyleId(preset.styleId);
    setSuspectUrl(preset.url);
    setClaimText(preset.claim);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!suspectUrl.trim()) return;
    onSubmit({
      styleId,
      suspectUrl: suspectUrl.trim(),
      claimText: claimText.trim(),
      preset: DEMO_PRESETS.find(p => p.id === activePreset)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-600 mb-1 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Evidence Assessment</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Submit Suspect Content</h2>
          <p className="text-xs text-zinc-600 mt-1">
            Provide a public URL suspected of commercially copying this creator's visual style.
          </p>
        </div>

        {/* Instant Test Presets */}
        <div className="mb-6 bg-purple-50/50 border border-purple-200/80 rounded-xl p-3.5">
          <span className="text-[11px] font-mono text-purple-900 uppercase tracking-wider block mb-2 font-semibold">
            Instant Test Presets (Click to Auto-fill):
          </span>
          <div className="flex flex-col gap-2">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`text-left text-xs p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                  activePreset === p.id
                    ? 'bg-purple-100 border-purple-400 text-purple-950 font-medium'
                    : 'bg-white border-zinc-200 hover:border-purple-300 text-zinc-700'
                }`}
              >
                <div>
                  <span className="font-semibold block">{p.label}</span>
                  <span className="text-[11px] text-zinc-500 font-mono line-clamp-1 mt-0.5">{p.title}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 shrink-0">
                  {p.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Style Selector */}
          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Target Protected Style
            </label>
            <select
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
            >
              {styles.map(s => (
                <option key={s.style_id} value={s.style_id}>
                  Style #{s.style_id} — {s.style_name} (by {s.artist_display_name})
                </option>
              ))}
            </select>
          </div>

          {/* Suspect URL */}
          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Suspect Public Listing URL <span className="text-purple-600">*</span>
            </label>
            <input
              type="url"
              required
              value={suspectUrl}
              onChange={(e) => {
                setSuspectUrl(e.target.value);
                setActivePreset(null);
              }}
              placeholder="https://marketplace.ai/listing/12345 or storefront link"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Hunter Claim Text */}
          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Hunter Claim Statement (Optional)
            </label>
            <textarea
              rows={3}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Describe which visual traits (e.g. line contours, color harmony, composition) you observe being commercially exploited..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 placeholder-zinc-400 outline-none focus:border-purple-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Protocol Rule */}
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed">
            <strong className="text-zinc-900 block mb-0.5">Autonomous Protocol Rule:</strong>
            If AI validators reach consensus that this URL matches <strong className="text-purple-700">Style #{currentStyle?.style_id} ({currentStyle?.style_name})</strong> above threshold (<strong className="text-zinc-900">{currentStyle?.similarity_threshold}%</strong>) with commercial use, the bounty is automatically allocated to your wallet without artist voting.
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg border border-purple-500/20 flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="w-3.5 h-3.5 animate-spin text-purple-200" />
                  <span>Initiating Consensus...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Submit for AI Consensus</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
