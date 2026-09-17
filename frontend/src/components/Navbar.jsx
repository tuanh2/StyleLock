import React from 'react';
import { Shield, Compass, Target, PlusCircle, ShoppingBag, ExternalLink, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, addressExplorerUrl } from '../config';

export default function Navbar({ activeTab, setActiveTab, account, onConnect, isConnecting }) {
  const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:border-purple-400 group-hover:bg-purple-100 transition-all shadow-xs">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-zinc-950 tracking-tight font-sans">STYLELOCK</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/80 font-medium">
                Autonomous Protocol
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono hidden sm:block">Decentralized Visual Identity Escrow</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'explore' 
                ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            Explore Styles
          </button>

          <button
            onClick={() => setActiveTab('hunt')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'hunt' 
                ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-purple-400" />
            Hunter Board
          </button>

          <button
            onClick={() => setActiveTab('artist')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'artist' 
                ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            Artist Studio
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'market' 
                ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />
            Demo Market
          </button>
        </nav>

        {/* Contract Status & Connect Wallet */}
        <div className="flex items-center gap-3">
          <a
            href={addressExplorerUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-purple-600 transition-colors bg-zinc-100/80 hover:bg-purple-50 px-2.5 py-1 rounded-md border border-zinc-200"
            title="Inspect Intelligent Contract on GenLayer Explorer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GenLayer Studionet</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          {account ? (
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span className="font-medium">{shortAddr(account)}</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg border border-purple-500/20 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
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
