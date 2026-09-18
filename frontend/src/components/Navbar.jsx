import React from 'react';
import { CONTRACT_ADDRESS, addressExplorerUrl } from '../config';

export default function Navbar({ activeTab, setActiveTab, account, connectedChain, onConnect, onDisconnect, isConnecting }) {
  const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#eadfea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo with the uploaded StyleLock ribbon S */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <img
            src="/logo-mark.png"
            alt="StyleLock"
            className="w-9 h-9 rounded-lg object-contain border border-zinc-200 shadow-xs group-hover:border-purple-300 transition-all"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base text-zinc-950 tracking-wider font-sans leading-none">
              STYLELOCK
            </span>
            <span className="text-[11px] text-zinc-400 font-mono mt-0.5 leading-none">
              Style Protection Protocol
            </span>
          </div>
        </div>

        {/* Navigation Tabs - Clean typography, zero redundant icons */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'explore' 
                ? 'bg-zinc-950 text-white font-semibold' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Explore Styles
          </button>

          <button
            onClick={() => setActiveTab('hunt')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'hunt' 
                ? 'bg-zinc-950 text-white font-semibold' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Hunter Board
          </button>

          <button
            onClick={() => setActiveTab('artist')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'artist' 
                ? 'bg-zinc-950 text-white font-semibold' 
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Register Style
          </button>
        </nav>

        {/* Contract Link & Wallet Connect */}
        <div className="flex items-center gap-3">
          <a
            href={addressExplorerUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors bg-zinc-100 hover:bg-zinc-200/70 px-2.5 py-1.5 rounded-md border border-zinc-200"
            title="View contract on GenLayer explorer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Studio Next</span>
          </a>

          {account ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onConnect}
                className="flex items-center gap-2 bg-zinc-100 hover:bg-purple-50 hover:border-purple-200 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-800 transition-colors cursor-pointer group"
                title="Click to switch chain or network"
              >
                {connectedChain && (
                  <span className="text-sm leading-none">{connectedChain.icon}</span>
                )}
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium">{shortAddr(account)}</span>
                {connectedChain && (
                  <span className="text-zinc-500 hidden sm:inline font-sans font-medium text-[11px] bg-white px-1.5 py-0.5 rounded border border-zinc-200">{connectedChain.name}</span>
                )}
                <svg className="w-3 h-3 text-zinc-400 group-hover:text-purple-600 ml-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={onDisconnect}
                className="bg-zinc-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-zinc-200 text-zinc-500 font-medium text-xs px-2.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Disconnect wallet"
              >
                <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
