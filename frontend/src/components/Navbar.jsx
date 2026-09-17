import React from 'react';
import { Shield, Sparkles, PlusCircle, Compass, Target, ShoppingBag, ExternalLink, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, addressExplorerUrl } from '../config';

export default function Navbar({ activeTab, setActiveTab, account, onConnect, isConnecting }) {
  const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';

  return (
    <header className="sticky top-0 z-50 bg-[#090A0F]/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all shadow-sm">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-zinc-100 tracking-tight font-sans">STYLELOCK</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                Autonomous
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">Autonomous Style Protection for Creators</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'explore' ? 'bg-zinc-800/80 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-400" />
            Explore Styles
          </button>

          <button
            onClick={() => setActiveTab('hunt')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'hunt' ? 'bg-zinc-800/80 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-4 h-4 text-purple-400" />
            Hunter Board
          </button>

          <button
            onClick={() => setActiveTab('artist')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'artist' ? 'bg-zinc-800/80 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            Artist Studio
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'market' ? 'bg-zinc-800/80 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Demo Market
          </button>
        </nav>

        {/* Right Actions: Contract + Wallet */}
        <div className="flex items-center gap-3">
          <a
            href={addressExplorerUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-purple-300 transition-colors"
            title="View Contract on Explorer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GenLayer Studionet</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {account ? (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>{shortAddr(account)}</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs px-4 py-2 rounded-lg border border-purple-400/30 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
