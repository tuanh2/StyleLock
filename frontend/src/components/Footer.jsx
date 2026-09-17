import React from 'react';
import { Shield, Github, ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-borderDark/80 bg-[#050508] py-8 px-4 lg:px-12 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-slate-200 font-bold">Sentinel.AI</span>
          <span>— Built for GenLayer Agent Tank Hackathon Season 1</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://studio-next.genlayer.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            Studio Next RPC <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://portal.genlayer.foundation/agent-tank/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            Portal Entry <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
}
