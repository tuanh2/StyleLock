import React from 'react';
import { DEMO_PRESETS } from '../data/demoFixtures';

export default function DemoMarketView({ onReportPreset }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 mb-8">
        <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold block mb-1">
          Marketplace Simulation
        </span>
        <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Test Listings & Storefronts</h1>
        <p className="text-xs text-zinc-600 mt-1">
          Preconfigured sample listings. Click "Run Evaluation" to submit directly for consensus.
        </p>
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_PRESETS.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-purple-300 transition-all shadow-xs"
          >
            <div>
              <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    item.type === 'DERIVATIVE'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.type === 'CLEAN'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {item.expectedVerdict}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-1">
                  <span>{item.store}</span>
                  <span className="text-zinc-900 font-bold">{item.price}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-950 line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200 text-[11px] font-mono text-zinc-600 mb-3">
                <span className="text-zinc-400">License: </span>
                <span className="text-zinc-800 font-medium">{item.license}</span>
              </div>

              <button
                onClick={() => onReportPreset(item)}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all text-center"
              >
                Run Evaluation
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
