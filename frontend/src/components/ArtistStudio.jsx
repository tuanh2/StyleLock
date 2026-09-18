import React, { useState, useRef } from 'react';
import { genToWei } from '../config';

export default function ArtistStudio({ styles, onCreateStyle, isCreating, currency = 'GEN' }) {

  const [artistName, setArtistName] = useState('');
  const [styleName, setStyleName] = useState('');
  const [descriptor, setDescriptor] = useState('');
  const [traits, setTraits] = useState('');
  const [policy, setPolicy] = useState('Commercial AI-generated derivatives using this registered style require prior authorization.');
  const [threshold, setThreshold] = useState(82);
  const [confidence, setConfidence] = useState(75);
  const [bountyGen, setBountyGen] = useState('0.25');

  // Multi-source artwork support
  const [uploadMode, setUploadMode] = useState('x_link'); // 'x_link' | 'upload' | 'url'
  const [collageUrl, setCollageUrl] = useState('/images/ink-nocturne.jpg');
  const [xPostUrl, setXPostUrl] = useState('');
  const [isResolvingX, setIsResolvingX] = useState(false);
  const [xStatusMsg, setXStatusMsg] = useState('');
  const [previewImage, setPreviewImage] = useState('/images/ink-nocturne.jpg');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-resolve X/Twitter post to high-res media URL
  const handleXUrlChange = async (url) => {
    setXPostUrl(url);
    const trimmed = url.trim();
    const match = trimmed.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/(\d+)/);
    if (match) {
      const [, user, id] = match;
      setIsResolvingX(true);
      setXStatusMsg('Extracting original artwork from X post...');
      try {
        const res = await fetch(`https://api.fxtwitter.com/${user}/status/${id}`);
        const data = await res.json();
        const photo = data.tweet?.media?.photos?.[0]?.url || data.tweet?.media?.mosaic?.formats?.jpeg;
        if (photo) {
          setCollageUrl(photo);
          setPreviewImage(photo);
          setXStatusMsg('✓ Successfully loaded original image from X!');
        } else {
          setXStatusMsg('No image found attached to this post.');
        }
      } catch (err) {
        console.warn('X fetch error:', err);
        setXStatusMsg('Could not fetch image automatically. You can paste the direct image URL.');
      } finally {
        setIsResolvingX(false);
      }
    } else if (trimmed) {
      setXStatusMsg('Please enter a valid X post URL (https://x.com/username/status/...)');
    } else {
      setXStatusMsg('');
    }
  };

  // Local file upload & preview
  const handleFileProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (.png, .jpg, .webp)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreviewImage(dataUrl);
      setCollageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileProcess(file);
  };

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
      
      {/* Header */}
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
      </div>


        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-zinc-200 p-6 rounded-2xl relative shadow-xs">
          
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
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Style Designation
              </label>
              <input
                type="text"
                required
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="e.g. Ink Nocturne"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
              Style Description
            </label>
            <textarea
              required
              rows={3}
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              placeholder="Comprehensive description of composition, color palette, medium, texture, and visual signatures..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors leading-relaxed"
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
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
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
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
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
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-700 mb-1.5 font-medium">
                Hunter Bounty ({currency})
              </label>
              <input
                type="text"
                value={bountyGen}
                onChange={(e) => setBountyGen(e.target.value)}
                placeholder="0.25"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Reference Artwork Selection */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="block text-xs font-mono text-zinc-800 font-bold uppercase tracking-wide">
                Reference Artwork Collage
              </label>

              {/* Mode Selector */}
              <div className="flex items-center gap-1 bg-zinc-200/70 p-0.5 rounded-lg text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setUploadMode('x_link')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    uploadMode === 'x_link' ? 'bg-white text-zinc-900 font-bold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  𝕏 Post Link (Auto-fetch)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    uploadMode === 'upload' ? 'bg-white text-zinc-900 font-bold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  📁 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    uploadMode === 'url' ? 'bg-white text-zinc-900 font-bold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  🔗 Paste Image URL
                </button>
              </div>
            </div>

            {/* Mode 1: X / Twitter Post Link */}
            {uploadMode === 'x_link' && (
              <div className="space-y-2">
                <p className="text-xs text-zinc-600">
                  Paste link to an X/Twitter post (e.g. <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded">https://x.com/dezzyyy_eth/status/...</code>) — original high-res artwork will be automatically extracted!
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={xPostUrl}
                    onChange={(e) => handleXUrlChange(e.target.value)}
                    placeholder="https://x.com/username/status/123456789..."
                    className="flex-1 bg-white border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleXUrlChange(xPostUrl)}
                    disabled={isResolvingX || !xPostUrl}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-50"
                  >
                    {isResolvingX ? 'Fetching...' : 'Fetch Image'}
                  </button>
                </div>
                {xStatusMsg && (
                  <p className={`text-xs font-mono ${xStatusMsg.startsWith('✓') ? 'text-emerald-600 font-semibold' : 'text-zinc-500'}`}>
                    {xStatusMsg}
                  </p>
                )}
              </div>
            )}

            {/* Mode 2: Local File Upload */}
            {uploadMode === 'upload' && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => handleFileProcess(e.target.files?.[0])}
                  className="hidden"
                />
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-purple-600 bg-purple-50/50' : 'border-zinc-300 hover:border-purple-500 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-zinc-900">
                    Click to choose image file or drag and drop here
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Supports PNG, JPG, WebP. Processed locally in-browser without a backend server.
                  </p>
                </div>
              </div>
            )}

            {/* Mode 3: Direct URL */}
            {uploadMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  required
                  value={collageUrl}
                  onChange={(e) => {
                    setCollageUrl(e.target.value);
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3.5 py-2.5 text-xs text-zinc-950 outline-none focus:border-purple-600 font-mono"
                />
              </div>
            )}

            {/* Image Preview Box */}
            {previewImage && (
              <div className="mt-4 pt-3 border-t border-zinc-200/80 flex items-center gap-4 bg-white p-3 rounded-lg border border-zinc-200">
                <img
                  src={previewImage}
                  alt="Reference Preview"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-lg object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                  onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      ✓ Artwork loaded
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 truncate mt-1 max-w-md">
                    {collageUrl.startsWith('data:') ? 'Local Image File (Data URI)' : collageUrl}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCollageUrl('');
                      setPreviewImage('');
                      setXPostUrl('');
                      setXStatusMsg('');
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 hover:underline mt-1 font-medium"
                  >
                    Change image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating || !collageUrl}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {isCreating ? 'Registering On-Chain...' : 'Register Style on GenLayer'}
            </button>
          </div>

        </form>

    </div>
  );
}
