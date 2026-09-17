import React, { useState } from 'react';
import { genToWei, weiToGen } from '../config';

export default function ArtistStudio({ styles, onCreateStyle, isCreating }) {
  const [activeTab, setActiveTab] = useState('register');
  
  const [artistName, setArtistName] = useState('');
  const [styleName, setStyleName] = useState('');
  const [descriptor, setDescriptor] = useState('');
  const [traits, setTraits] = useState('');
  const [policy, setPolicy] = useState('Commercial AI-generated derivatives using this registered style require prior authorization.');
  const [threshold, setThreshold] = useState(82);
  const [confidence, setConfidence] = useState(75);
  const [bountyGen, setBountyGen] = useState('0.25');
  const [collageUrl, setCollageUrl] = useState('/images/ink-nocturne.jpg');

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
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 mb-8">
        <div>
          <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold block mb-1">
            Creator Registration
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Register Visual Style</h1>
          <p className="text-xs text-zinc-600 mt-1">
            Define your visual identity once on-chain. GenLayer validators reference this data when evaluating suspect listings.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'register' ? 'bg-purple-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Register Style
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'manage' ? 'bg-purple-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Registered ({styles.length})
          </button>
        </div>
      </div>

      {activeTab === 'register' ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Artist Name / Pseudonym
              </label>
              <input
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. Alice Kim"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Style Name
              </label>
              <input
                type="text"
                required
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="e.g. Ink Nocturne"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Style Description
            </label>
            <textarea
              rows={3}
              required
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              placeholder="Describe your visual style: line weight, color palette, recurring composition patterns, brush strokes..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Distinctive Traits (Semicolon separated)
            </label>
            <input
              type="text"
              required
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              placeholder="rough black ink contours; muted watercolor palette; asymmetric framing; sparse composition"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Similarity Threshold (70–95%)
              </label>
              <input
                type="number"
                min="70"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Min. Confidence (60–95%)
              </label>
              <input
                type="number"
                min="60"
                max="95"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Hunter Bounty (GEN)
              </label>
              <input
                type="text"
                value={bountyGen}
                onChange={(e) => setBountyGen(e.target.value)}
                placeholder="0.25"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Reference Artwork Collage URL
            </label>
            <input
              type="url"
              required
              value={collageUrl}
              onChange={(e) => setCollageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg transition-all shadow-sm active:scale-95"
            >
              {isCreating ? 'Registering On-Chain...' : 'Register Style on GenLayer'}
            </button>
          </div>

        </form>
      ) : (
        <div className="space-y-3">
          {styles.map(s => (
            <div key={s.style_id} className="p-4 rounded-xl bg-white border border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-zinc-950 text-base">Style #{s.style_id}: {s.style_name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Threshold: {s.similarity_threshold}% | Bounty: {weiToGen(s.bounty_per_case_wei)} GEN | Pool: {weiToGen(s.available_bounty_pool)} GEN
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
                Active
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
