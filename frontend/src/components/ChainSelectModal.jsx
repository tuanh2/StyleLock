import React from "react";

export const CHAINS = [
  {
    key: "genlayer",
    name: "GenLayer Studio",
    subtitle: "Studio Next Devnet",
    icon: "⚙️",
    color: "purple",
    type: "evm",
    chainId: 61871,
    chainIdHex: "0xF1EF",
    rpc: "https://studio-next.genlayer.com/api",
    currency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
    explorer: "https://explorer-studio-dev.genlayer.com",
  },
  {
    key: "arc",
    name: "Arc Mainnet",
    subtitle: "Circle L1 · USDC Native",
    icon: "🔵",
    color: "blue",
    type: "evm",
    chainId: 5042,
    chainIdHex: "0x13B2",
    rpc: "https://rpc.mainnet.arc.io",
    currency: { name: "USD Coin", symbol: "USDC", decimals: 6 },
    explorer: "https://explorer.arc.io",
  },
  {
    key: "bnb",
    name: "BNB Chain",
    subtitle: "Binance Smart Chain",
    icon: "🟡",
    color: "yellow",
    type: "evm",
    chainId: 56,
    chainIdHex: "0x38",
    rpc: "https://bsc-dataseed.binance.org/",
    currency: { name: "BNB", symbol: "BNB", decimals: 18 },
    explorer: "https://bscscan.com",
  },
  {
    key: "solana",
    name: "Solana",
    subtitle: "Mainnet · Phantom",
    icon: "🟣",
    color: "violet",
    type: "solana",
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

export default function ChainSelectModal({ isOpen, onClose, onSelect, isConnecting }) {
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
            <h2 className="text-base font-bold text-zinc-950 tracking-tight">Connect Wallet</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Choose your network to continue</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded-lg hover:bg-zinc-100 -mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chain List */}
        <div className="p-4 space-y-2.5">
          {CHAINS.map((chain) => {
            const c = colorMap[chain.color];
            return (
              <button
                key={chain.key}
                onClick={() => onSelect(chain)}
                disabled={isConnecting}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-zinc-200 transition-all text-left cursor-pointer active:scale-[0.98] disabled:opacity-50 ${c.hover}`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-xl shrink-0 border border-zinc-100`}>
                  {chain.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-950">{chain.name}</span>
                    {chain.key === "genlayer" && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${c.badge}`}>
                        Contract
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">{chain.subtitle}</p>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
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
