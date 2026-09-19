import React from 'react';
import { weiToGen } from '../config';

export default function StyleCard({ style, onSelect, onReport, onDonate, currency = 'GEN' }) {
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
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/ink-nocturne.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        

        {/* Bounty Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-600 text-white backdrop-blur-sm shadow-xs">
            {weiToGen(style.bounty_per_case_wei)} {currency} Bounty
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
          <div className="flex items-center gap-1.5">
            <span>Pool: <strong className="text-purple-600">{weiToGen(style.available_bounty_pool)} {currency}</strong></span>
            {onDonate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDonate(style);
                }}
                className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                title="Donate to boost bounty pool"
              >
                +Donate
              </button>
            )}
          </div>
        </div>

        {/* Actions - View Details opens StyleDetailsModal; Report Copy opens SubmitModal */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelect(style)}
            className="w-full text-xs font-medium py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors text-center"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={() => onReport(style)}
            className="w-full text-xs font-semibold py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors text-center shadow-xs active:scale-95"
          >
            Report Copy
          </button>
        </div>

      </div>

    </div>
  );
}
