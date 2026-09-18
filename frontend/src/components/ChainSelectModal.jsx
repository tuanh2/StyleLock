import React from "react";

export const CHAINS = [
  {
    key: "genlayer",
    name: "GenLayer Studio",
    subtitle: "Studio Next Devnet · GEN",
    color: "purple",
    type: "evm",
    currencySymbol: "GEN",
    chainId: 61997,
    chainIdHex: "0xF22D",
    rpc: "https://studio-next.genlayer.com/api",
    currency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
    explorer: "https://explorer-studio-dev.genlayer.com",
  },
  {
    key: "arc",
    name: "Arc Mainnet",
    subtitle: "Circle L1 · USDC Native",
    color: "blue",
    type: "evm",
    currencySymbol: "USDC",
    chainId: 5042,
    chainIdHex: "0x13B2",
    rpc: "https://rpc.mainnet.arc.io",
    currency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
    explorer: "https://explorer.arc.io",
  },
  {
    key: "bnb",
    name: "BNB Chain",
    subtitle: "Binance Smart Chain · USDT",
    color: "yellow",
    type: "evm",
    currencySymbol: "USDT",
    chainId: 56,
    chainIdHex: "0x38",
    rpc: "https://bsc-dataseed.binance.org/",
    currency: { name: "Tether USD", symbol: "USDT", decimals: 18 },
    explorer: "https://bscscan.com",
  },
  {
    key: "solana",
    name: "Solana",
    subtitle: "Mainnet · USDC",
    color: "violet",
    type: "solana",
    currencySymbol: "USDC",
  },
];

const colorMap = {
  purple: {
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
    hover: "hover:border-purple-300 hover:bg-purple-50/60",
  },
  blue: {
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    hover: "hover:border-blue-300 hover:bg-blue-50/60",
  },
  yellow: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    hover: "hover:border-yellow-300 hover:bg-yellow-50/60",
  },
  violet: {
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    hover: "hover:border-violet-300 hover:bg-violet-50/60",
  },
};

export default function ChainSelectModal({ isOpen, onClose, onSelect, isConnecting, connectedChain }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-sm overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950 tracking-tight">Select Network</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Switch network or connect your wallet</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded-lg hover:bg-zinc-100 -mt-0.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chain List */}
        <div className="p-4 space-y-2">
          {CHAINS.map((chain) => {
            const c = colorMap[chain.color];
            const isCurrent = connectedChain?.key === chain.key;
            return (
              <button
                key={chain.key}
                onClick={() => onSelect(chain)}
                disabled={isConnecting}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer active:scale-[0.98] disabled:opacity-50 ${
                  isCurrent ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-500/20 shadow-xs' : `border-zinc-200 bg-white ${c.hover}`
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-950 tracking-tight">{chain.name}</span>
                    {chain.key === "genlayer" && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${c.badge}`}>
                        Contract
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">{chain.subtitle}</p>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-emerald-500 ring-4 ring-emerald-100' : c.dot}`} />
              </button>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <p className="text-[11px] text-zinc-400 text-center font-mono">
            EVM chains use MetaMask · Solana uses Phantom
          </p>
        </div>
      </div>
    </div>
  );
}
