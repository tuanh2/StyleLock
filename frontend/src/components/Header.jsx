import React, { useState } from 'react';
import { Shield, Zap, ExternalLink, Wallet, CheckCircle2 } from 'lucide-react';

export default function Header({ account, setAccount }) {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to connect.');
      return;
    }
    try {
      setConnecting(true);
      // Switch / Add GenLayer Studio Next chain (61997)
      const CHAIN_ID_HEX = '0x' + (61997).toString(16); // 0xF22D
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      } catch (err) {
        if (err.code === 4902 || err.code === -32603) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CHAIN_ID_HEX,
              chainName: 'GenLayer Studio Next',
              nativeCurrency: { name: 'GEN Token', symbol: 'GEN', decimals: 18 },
              rpcUrls: ['https://studio-next.genlayer.com/api'],
              blockExplorerUrls: ['https://explorer-studio-dev.genlayer.com/'],
            }],
          });
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Wallet connect error:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#07070C]/90 backdrop-blur-md border-b border-borderDark/80 px-4 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - inspired by de1.ai aesthetic */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface border border-purple-500/30 flex items-center justify-center glow-purple-sm">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">SENTINEL<span className="text-purple-400 font-mono">.AI</span></span>
              <span className="text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded-full">
                GenLayer Studio Next
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">Chain ID: 61997 | Security Court</p>
          </div>
        </div>

        {/* Navigation & Wallet */}
        <div className="flex items-center gap-4">
          <a
            href="https://explorer-studio-dev.genlayer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors font-mono"
          >
            Explorer <ExternalLink className="w-3 h-3" />
          </a>

          {account ? (
            <div className="flex items-center gap-2 bg-surface border border-purple-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-medium text-xs rounded-lg px-4 py-2 border border-purple-400/30 transition-all glow-purple-sm active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
