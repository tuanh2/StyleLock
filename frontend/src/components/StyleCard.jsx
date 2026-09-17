import React from 'react';
import { weiToGen } from '../config';

export default function StyleCard({ style, onSelect, onReport }) {
  const traits = (style.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between relative group">
      
      {/* Corner crosshairs */}
      <span className="corner-cross top-1 left-1">+</span>
      <span className="corner-cross top-1 right-1">+</span>

      {/* Artwork Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        <img
          src={style.reference_collage_url}
          alt={style.style_name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Style ID Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/90 border border-zinc-200 text-zinc-900 backdrop-blur-sm font-semibold">
            Style #{style.style_id}
          </span>
        </div>

        {/* Bounty Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-600 text-white backdrop-blur-sm">
            {weiToGen(style.bounty_per_case_wei)} GEN Bounty
          </span>
        </div>

        {/* Artist Name & Title */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold tracking-tight leading-tight">{style.style_name}</h3>
          <p className="text-xs text-zinc-200 mt-0.5">
            by {style.artist_display_name}
          </p>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-3">
            {style.descriptor}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {traits.slice(0, 3).map((trait, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {trait}
              </span>
            ))}
            {traits.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-400">
                +{traits.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
          <span>Threshold: <strong className="text-zinc-800">{style.similarity_threshold}%</strong></span>
          <span>Detections: <strong className="text-purple-600">{style.confirmed_cases || 0}</strong></span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onSelect(style)}
            className="w-full text-xs font-medium py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors text-center"
          >
            View Details
          </button>

          <button
            onClick={() => onReport(style)}
            className="w-full text-xs font-semibold py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors text-center"
          >
            Report Copy
          </button>
        </div>

      </div>

    </div>
  );
}
