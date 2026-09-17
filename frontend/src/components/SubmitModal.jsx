import React, { useState } from 'react';
import { X, Search, AlertCircle, Sparkles, ExternalLink, Zap, ShieldAlert, Cpu } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Evidence Assessment</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Submit Suspect Content</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Provide a public URL suspected of commercially exploiting this creator\'s registered visual style.
          </p>
        </div>

        {/* Instant Test Presets */}
        <div className="mb-6 bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
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
                    ? 'bg-purple-950/40 border-purple-500/70 text-purple-200'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <span className="font-semibold block">{p.label}</span>
                  <span className="text-[11px] text-zinc-400 font-mono line-clamp-1 mt-0.5">{p.title}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
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
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Target Protected Style
            </label>
            <select
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-purple-500 transition-colors"
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
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Suspect Public Listing URL <span className="text-purple-400">*</span>
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
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Hunter Claim Text */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Hunter Claim Statement (Optional)
            </label>
            <textarea
              rows={3}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Describe which visual traits (e.g. contours, color harmony, composition) you observe being commercially exploited..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Autonomous Policy Warning */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200 block mb-0.5">Autonomous Protocol Rule:</strong>
            If AI validators reach consensus that this URL matches <strong className="text-purple-300">Style #{currentStyle?.style_id} ({currentStyle?.style_name})</strong> above threshold (<strong className="text-zinc-200">{currentStyle?.similarity_threshold}%</strong>) with commercial use, the bounty is automatically allocated to your wallet without artist voting.
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg border border-purple-400/40 flex items-center gap-2 transition-all shadow-md active:scale-95"
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
