import React, { useState, useEffect } from 'react';
import { DEMO_PRESETS } from '../data/demoFixtures';

export default function SubmitModal({ isOpen, onClose, selectedStyle, styles, initialPreset, onSubmit, isSubmitting }) {
  const [styleId, setStyleId] = useState('1');
  const [suspectUrl, setSuspectUrl] = useState('');
  const [claimText, setClaimText] = useState('');
  const [activePreset, setActivePreset] = useState(null);

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

  // Synchronize when opening or when initialPreset/selectedStyle changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialPreset) {
      setActivePreset(initialPreset.id);
      setStyleId(initialPreset.styleId || '1');
      setSuspectUrl(initialPreset.url || '');
      setClaimText(initialPreset.claim || '');
    } else if (selectedStyle) {
      setStyleId(String(selectedStyle.style_id));
      setActivePreset(null);
      setSuspectUrl('');
      const traits = (selectedStyle.protected_traits || '').split(';').slice(0, 2).map(t => t.trim()).join(', ');
      setClaimText(`Suspect commercial listing exploiting traits of ${selectedStyle.style_name} (${traits}).`);
    } else if (styles && styles.length > 0) {
      setStyleId(String(styles[0].style_id));
      setActivePreset(null);
      setSuspectUrl('');
      setClaimText('');
    }
  }, [isOpen, initialPreset, selectedStyle, styles]);

  if (!isOpen) return null;

  const currentStyle = (styles || []).find(s => String(s.style_id) === String(styleId)) || selectedStyle || styles[0];

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setStyleId(preset.styleId);
    setSuspectUrl(preset.url);
    setClaimText(preset.claim);
  };

  // Handle style dropdown change and dynamically update description
  const handleStyleChange = (newStyleId) => {
    setStyleId(newStyleId);
    const targetStyle = (styles || []).find(s => String(s.style_id) === String(newStyleId));
    if (targetStyle) {
      // If preset belongs to another style, unlink it and update description to match new target
      if (activePreset) {
        const p = DEMO_PRESETS.find(x => x.id === activePreset);
        if (p && String(p.styleId) !== String(newStyleId)) {
          setActivePreset(null);
        }
      }
      const traits = (targetStyle.protected_traits || '').split(';').slice(0, 2).map(t => t.trim()).join(', ');
      setClaimText(`Suspect commercial listing exploiting traits of ${targetStyle.style_name} (${traits}).`);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold block mb-1">
            Evidence Submission
          </span>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Submit Suspect URL</h2>
          <p className="text-xs text-zinc-600 mt-1">
            Provide a public URL suspected of commercially copying this creator's visual style.
          </p>
        </div>

        {/* Presets */}
        <div className="mb-6 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5">
          <span className="text-[11px] font-mono text-zinc-700 uppercase tracking-wider block mb-2 font-semibold">
            Quick Test Presets (Click to Auto-fill):
          </span>
          <div className="flex flex-col gap-2">
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`text-left text-xs p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                  activePreset === p.id
                    ? 'bg-purple-50 border-purple-400 text-purple-950 font-medium'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
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
          
          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Target Style Profile
            </label>
            <select
              value={styleId}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            >
              {(styles || []).map(s => (
                <option key={s.style_id} value={s.style_id}>
                  Style #{s.style_id} — {s.style_name} ({s.artist_display_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Suspect Listing URL <span className="text-purple-600">*</span>
            </label>
            <input
              type="url"
              required
              value={suspectUrl}
              onChange={(e) => {
                setSuspectUrl(e.target.value);
                setActivePreset(null);
              }}
              placeholder="https://storefront.example/listing/12345"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Description of Infringing Elements
            </label>
            <textarea
              rows={3}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Note specific copied traits: contours, color relationships, compositions..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 placeholder-zinc-400 outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed">
            If validators reach consensus that this URL matches <strong className="text-purple-700">{currentStyle?.style_name}</strong> above the {currentStyle?.similarity_threshold}% threshold with commercial usage, the bounty is credited to your address automatically.
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-xs active:scale-95"
            >
              {isSubmitting ? 'Evaluating on GenLayer...' : 'Submit to Validators'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
