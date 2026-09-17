import React from 'react';
import { Shield, Target, ExternalLink, ChevronRight, User } from 'lucide-react';
import { weiToGen } from '../config';

export default function StyleCard({ style, onSelect, onReport }) {
  const traits = (style.protected_traits || '').split(';').map(t => t.trim()).filter(Boolean);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group flex flex-col justify-between">
      
      {/* Artwork Collage Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
        <img
          src={style.reference_collage_url}
          alt={style.style_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        {/* Style ID Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-950/80 border border-zinc-700/80 text-zinc-300 backdrop-blur-sm">
            Style #{style.style_id}
          </span>
        </div>

        {/* Bounty Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-900/80 border border-purple-500/60 text-purple-200 backdrop-blur-sm shadow">
            {weiToGen(style.bounty_per_case_wei)} GEN Bounty
          </span>
        </div>

        {/* Artist Name & Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white tracking-tight">{style.style_name}</h3>
          <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
            <User className="w-3 h-3 text-purple-400" />
            <span>by {style.artist_display_name}</span>
          </p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Descriptor */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
            {style.descriptor}
          </p>

          {/* Traits Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {traits.slice(0, 3).map((trait, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                {trait}
              </span>
            ))}
            {traits.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500">
                +{traits.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Policy & Enforcement Metrics */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
          <span>Threshold: <strong className="text-zinc-200">{style.similarity_threshold}%</strong></span>
          <span>Detections: <strong className="text-purple-300">{style.confirmed_cases || 0}</strong></span>
        </div>

        {/* Card CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onSelect(style)}
            className="w-full text-xs font-medium py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border border-zinc-700/70 transition-colors flex items-center justify-center gap-1"
          >
            <span>View Profile</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
          </button>

          <button
            onClick={() => onReport(style)}
            className="w-full text-xs font-semibold py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40 transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Hunt Derivative</span>
          </button>
        </div>

      </div>

    </div>
  );
}
