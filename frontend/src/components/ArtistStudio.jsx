import React, { useState } from 'react';
import { PlusCircle, Shield, Upload, DollarSign, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { genToWei } from '../config';

export default function ArtistStudio({ styles, onCreateStyle, isCreating, onFundStyle }) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'manage'
  
  // Registration Form
  const [artistName, setArtistName] = useState('');
  const [styleName, setStyleName] = useState('');
  const [descriptor, setDescriptor] = useState('');
  const [traits, setTraits] = useState('');
  const [policy, setPolicy] = useState('Commercial AI-generated derivatives using this registered style require prior authorization.');
  const [threshold, setThreshold] = useState(82);
  const [confidence, setConfidence] = useState(75);
  const [bountyGen, setBountyGen] = useState('0.25');
  const [collageUrl, setCollageUrl] = useState('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!styleName.trim() || !descriptor.trim()) return;

    onCreateStyle({
      artist_display_name: artistName.trim() || 'Artist',
      style_name: styleName.trim(),
      descriptor: descriptor.trim(),
      protected_traits: traits.trim(),
      license_terms: policy.trim(),
      similarity_threshold: Number(threshold),
      minimum_confidence: Number(confidence),
      bounty_per_case_wei: genToWei(bountyGen),
      reference_manifest_url: 'https://stylelock.art/manifests/' + styleName.toLowerCase().replace(/\s+/g, '-') + '.json',
      reference_manifest_hash: '0x' + Array(64).fill('a').join(''),
      reference_collage_url: collageUrl.trim()
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Artist Identity Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Register & Protect Visual Style</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Define your visual identity once. GenLayer AI validators enforce it autonomously across the web.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'register' ? 'bg-purple-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register Style
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'manage' ? 'bg-purple-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Manage Profiles ({styles.length})
          </button>
        </div>
      </div>

      {activeTab === 'register' ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
                Artist Public Pseudonym
              </label>
              <input
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. Alice Kim"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
                Style Profile Name
              </label>
              <input
                type="text"
                required
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="e.g. Ink Nocturne"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Detailed Visual Style Descriptor
            </label>
            <textarea
              rows={3}
              required
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              placeholder="Describe your visual style in detail: line behavior, palettes, negative space, recurring composition habits, brush strokes..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Protected Traits (Semicolon separated)
            </label>
            <input
              type="text"
              required
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              placeholder="rough black ink contours; muted watercolor palette; asymmetric framing; sparse composition"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
                Similarity Threshold (70–95%)
              </label>
              <input
                type="number"
                min="70"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
                Min. Confidence (60–95%)
              </label>
              <input
                type="number"
                min="60"
                max="95"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
                Hunter Bounty (GEN)
              </label>
              <input
                type="text"
                value={bountyGen}
                onChange={(e) => setBountyGen(e.target.value)}
                placeholder="0.25"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">
              Reference Artwork Collage URL
            </label>
            <input
              type="url"
              required
              value={collageUrl}
              onChange={(e) => setCollageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg border border-purple-400/40 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCreating ? 'Registering On-Chain...' : 'Register Style on GenLayer'}</span>
            </button>
          </div>

        </form>
      ) : (
        <div className="space-y-4">
          {styles.map(s => (
            <div key={s.style_id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Style #{s.style_id}: {s.style_name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Threshold: {s.similarity_threshold}% | Bounty: {bountyGen} GEN</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Active Policy
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
