import React, { useState, useEffect } from 'react';
import { weiToGen } from '../config';

export default function ReportView({ selectedStyle, styles, onBack, onSubmit, isSubmitting, currency = 'GEN' }) {
  const [styleId, setStyleId] = useState(selectedStyle?.style_id || '1');
  const [suspectUrl, setSuspectUrl] = useState('');
  const [claimText, setClaimText] = useState('');
  
  // X / Twitter auto-fetch states
  const [isResolvingX, setIsResolvingX] = useState(false);
  const [xData, setXData] = useState(null);
  const [xStatusMsg, setXStatusMsg] = useState('');

  // Sync with selectedStyle when provided
  useEffect(() => {
    if (selectedStyle) {
      setStyleId(String(selectedStyle.style_id));
      const traits = (selectedStyle.protected_traits || '').split(';').slice(0, 2).map(t => t.trim()).join(', ');
      setClaimText(`Suspected unauthorized copy exploiting traits of ${selectedStyle.style_name} (${traits}).`);
    }
  }, [selectedStyle]);

  const currentStyle = (styles || []).find(s => String(s.style_id) === String(styleId)) || selectedStyle || styles?.[0];
  const traits = (currentStyle?.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);

  // Auto-resolve when suspectUrl is an X / Twitter link
  const handleUrlChange = async (url) => {
    setSuspectUrl(url);
    const trimmed = url.trim();
    const match = trimmed.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)/);
    
    if (match) {
      const [, user, id] = match;
      setIsResolvingX(true);
      setXStatusMsg('Extracting artwork and evidence from X post...');
      try {
        const res = await fetch(`https://api.fxtwitter.com/${user}/status/${id}`);
        const data = await res.json();
        const photo = data.tweet?.media?.photos?.[0]?.url || data.tweet?.media?.mosaic?.formats?.jpeg;
        const text = data.tweet?.text || '';
        
        if (photo || text) {
          setXData({
            photo,
            text,
            author: data.tweet?.author?.name || user,
            handle: data.tweet?.author?.screen_name || user,
            resolvedUrl: `https://fxtwitter.com/${user}/status/${id}`,
            directImageUrl: photo
          });
          setXStatusMsg('✓ Successfully extracted evidence & artwork from X post!');
        } else {
          setXData(null);
          setXStatusMsg('Note: Post retrieved, but no attached image found.');
        }
      } catch (err) {
        console.warn('X fetch error:', err);
        setXStatusMsg('Could not auto-fetch X post. You can still submit the URL directly.');
      } finally {
        setIsResolvingX(false);
      }
    } else {
      setXData(null);
      setXStatusMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!suspectUrl.trim()) {
      alert('Please enter the suspect URL to report.');
      return;
    }

    let finalSuspectUrl = suspectUrl.trim();
    let finalClaimText = claimText.trim();

    // If an X/Twitter post was resolved, optimize the URL so GenLayer's web crawler doesn't get blocked by Twitter bot challenges
    if (xData) {
      // fxtwitter renders full HTML OpenGraph image & text tags without login walls for bots
      finalSuspectUrl = xData.resolvedUrl;
      const extraEvidence = `[X Post by @${xData.handle}: "${xData.text.slice(0, 300)}". Artwork Image: ${xData.directImageUrl || 'attached'}]`;
      finalClaimText = `${finalClaimText} — Evidence Details: ${extraEvidence}`;
    }

    onSubmit({
      styleId: String(currentStyle?.style_id || styleId),
      suspectUrl: finalSuspectUrl,
      claimText: finalClaimText
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Top Navigation / Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-950 font-medium transition-colors bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-[#eadfea] shadow-xs cursor-pointer"
        >
          <span>←</span>
          <span>Back to Hunter Board</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-400">
          GenLayer Autonomous AI Jury
        </span>
      </div>

      {/* Main Report Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-[#eadfea] rounded-[32px] p-6 sm:p-10 shadow-[0_24px_70px_rgba(72,48,84,0.08)]">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200">
              Evidence Submission
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              On-Chain AI Adjudication
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#211827] tracking-tight">
            Report Suspect Copy
          </h1>
          <p className="text-xs sm:text-sm text-[#594d63] mt-1.5 leading-relaxed">
            Submit evidence of an unauthorized copy. GenLayer decentralized AI validators will autonomously crawl the webpage, evaluate trait overlap, and award bounties directly upon confirmed infringement.
          </p>
        </div>

        {/* Target Style Profile Summary Card */}
        {currentStyle && (
          <div className="mb-8 bg-[#fdfafc] border border-[#eadfea] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 shadow-xs">
            <img
              src={currentStyle.reference_collage_url}
              alt={currentStyle.style_name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-zinc-200 bg-zinc-100 shrink-0 shadow-xs"
              onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-zinc-950 truncate">
                  {currentStyle.style_name}
                </h3>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-full shrink-0">
                  {weiToGen(currentStyle.bounty_per_case_wei)} {currency} Bounty
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Artist: <strong className="text-zinc-800">{currentStyle.artist_display_name}</strong> • Threshold: <strong className="text-zinc-800">{currentStyle.similarity_threshold}%</strong> • Pool: <strong className="text-purple-700">{weiToGen(currentStyle.available_bounty_pool)} {currency}</strong>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {traits.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-md text-zinc-700 border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-mono text-zinc-800 mb-2 font-semibold uppercase tracking-wider">
              Suspect Listing or Artwork URL <span className="text-purple-600">*</span>
            </label>
            <input
              type="url"
              required
              value={suspectUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://... (e.g. X/Twitter post, storefront, or marketplace listing)"
              className="w-full bg-white border border-[#eadfea] rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-zinc-950 outline-none focus:border-purple-600 shadow-xs"
            />
            
            {/* Status of URL resolution */}
            {isResolvingX && (
              <p className="text-xs text-purple-600 font-mono mt-1.5 flex items-center gap-1.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>Resolving X/Twitter evidence...</span>
              </p>
            )}

            {xStatusMsg && !isResolvingX && (
              <p className={`text-xs font-mono mt-1.5 ${xStatusMsg.startsWith('✓') ? 'text-emerald-600 font-semibold' : 'text-zinc-500'}`}>
                {xStatusMsg}
              </p>
            )}

            {/* Resolved X Post Preview */}
            {xData && (
              <div className="mt-3 p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 flex items-start gap-3">
                {xData.photo && (
                  <img
                    src={xData.photo}
                    alt="Resolved evidence"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-purple-200 shrink-0 bg-white"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-purple-900">
                      @{xData.handle}
                    </span>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                      X Post Evidence Extracted
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 line-clamp-2 mt-1 leading-snug">
                    {xData.text}
                  </p>
                </div>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 mt-2 font-sans">
              Supports any storefront, Shopify, OpenSea, or direct X/Twitter posts (artwork is automatically extracted for validator inspection).
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-800 mb-2 font-semibold uppercase tracking-wider">
              Hunter Claim Statement & Evidence Description <span className="text-purple-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Explain how this URL copies the artist's visual style: character poses, color palette, linework, textures, or unauthorized commercial merchandise..."
              className="w-full bg-white border border-[#eadfea] rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 outline-none focus:border-purple-600 shadow-xs resize-none leading-relaxed"
            />
            <p className="text-[11px] text-zinc-500 mt-1.5 font-sans">
              Be specific about reproduced traits so AI validators have full context during decentralized consensus.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-950 leading-relaxed">
            <strong className="font-semibold block mb-0.5 font-mono text-[11px] uppercase">Autonomous Escrow Guarantee:</strong>
            If validators reach consensus that this evidence matches <strong className="font-semibold">{currentStyle?.style_name}</strong> above the {currentStyle?.similarity_threshold}% threshold with commercial intent, the <strong>{weiToGen(currentStyle?.bounty_per_case_wei)} {currency}</strong> bounty will be credited directly to your connected wallet!
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-5 py-3 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !suspectUrl.trim()}
              className="bg-[#302738] hover:bg-[#493d53] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition-all shadow-[0_10px_30px_rgba(48,39,56,0.22)] active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Evaluating Evidence on GenLayer...</span>
                </>
              ) : (
                <span>Submit Report to GenLayer ({weiToGen(currentStyle?.bounty_per_case_wei)} {currency})</span>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
