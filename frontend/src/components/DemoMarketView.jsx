import React from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck, Tag, Zap, ArrowRight } from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoFixtures';

export default function DemoMarketView({ onReportPreset }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>Deterministic Test Environment</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Simulated AI Marketplaces & Storefronts</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Public test fixtures for hackathon verification. Click "Test with StyleLock" to submit directly for AI consensus.
        </p>
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_PRESETS.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    item.type === 'DERIVATIVE'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : item.type === 'CLEAN'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  }`}>
                    Expected: {item.expectedVerdict}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-1">
                  <span>{item.store}</span>
                  <span className="text-zinc-300 font-bold">{item.price}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-3">
                <span className="block text-zinc-500">License:</span>
                <span className="text-zinc-300">{item.license}</span>
              </div>

              <button
                onClick={() => onReportPreset(item)}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs border border-purple-400/40 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test with StyleLock AI</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
