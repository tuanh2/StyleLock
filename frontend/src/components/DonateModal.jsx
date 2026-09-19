import React, { useState, useEffect } from 'react';
import { weiToGen } from '../config';

export default function DonateModal({ isOpen, onClose, style, onDonate, isDonating, currency = 'GEN' }) {
  const isStable = currency === 'USDC' || currency === 'USDT';
  const presets = isStable ? ['5', '10', '25', '50', '100'] : ['0.1', '0.25', '0.5', '1.0', '2.0'];
  const defaultAmount = isStable ? '10' : '0.5';
  const [amount, setAmount] = useState(defaultAmount);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount);
      setError('');
    }
  }, [isOpen, style, defaultAmount]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDonating) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDonating]);

  if (!isOpen || !style) return null;

  const handlePreset = (val) => {
    setAmount(val);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setError('');
    onDonate(style.style_id, amount);
  };

  const currentPoolGen = weiToGen(style.available_bounty_pool);
  const bountyPerCaseGen = weiToGen(style.bounty_per_case_wei);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDonating}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-40"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={style.reference_collage_url}
            alt={style.style_name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover border border-zinc-200 bg-zinc-100 shrink-0"
            onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Protected Artwork
              </span>
              <span className="text-xs font-mono text-zinc-400">Support Artist</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight leading-tight mt-0.5">
              Donate to {style.style_name}
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              by {style.artist_display_name}
            </p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 mb-5 text-xs text-purple-950 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-purple-800 mb-1">
            <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Boost Hunter Bounty Pool</span>
          </div>
          <p className="text-[11px] text-purple-900/90 leading-normal">
            Your donation directly increases this style's <strong>on-chain Escrow Pool</strong> in <strong>{currency}</strong>. This funds bounty payouts for hunters who detect and report copyright infringements, protecting the artist's work.
          </p>
        </div>

        {/* Current Pool Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block">Current Escrow Pool</span>
            <span className="text-base font-bold text-purple-600 block mt-0.5">{currentPoolGen} {currency}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block">Reward Per Case</span>
            <span className="text-base font-bold text-zinc-800 block mt-0.5">{bountyPerCaseGen} {currency}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
              Donation Amount ({currency})
            </label>
            
            {/* Quick Presets */}
            <div className="flex gap-1.5 mb-2.5">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  disabled={isDonating}
                  className={`flex-1 py-1 px-1 text-xs font-mono rounded-md border transition-all ${
                    amount === val
                      ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="number"
                step={isStable ? "1" : "0.01"}
                min={isStable ? "1" : "0.01"}
                disabled={isDonating}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all pr-14"
                placeholder={defaultAmount}
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 font-semibold">
                {currency}
              </span>
            </div>
            {error && <p className="text-xs text-red-600 mt-1 font-mono">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isDonating}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDonating}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-xs active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isDonating ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Processing On-Chain...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>Donate {amount || '0'} {currency}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
