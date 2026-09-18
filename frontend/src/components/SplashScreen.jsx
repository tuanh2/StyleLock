import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('connecting to genlayer...');

  useEffect(() => {
    const startTime = Date.now();
    const duration = 800; // 0.8 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct > 70) {
        setStatusText('syncing style registry...');
      } else if (pct > 35) {
        setStatusText('loading intelligent contract...');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 250);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#FAFAFC] de1-grid flex flex-col items-center justify-center select-none transition-all duration-250 ease-out ${
        fadeOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100 scale-100'
      }`}
    >
      {/* Corner crosshairs for technical minimalist aesthetic */}
      <span className="corner-cross top-6 left-6 text-purple-400 text-sm font-mono">+</span>
      <span className="corner-cross top-6 right-6 text-purple-400 text-sm font-mono">+</span>
      <span className="corner-cross bottom-6 left-6 text-purple-400 text-sm font-mono">+</span>
      <span className="corner-cross bottom-6 right-6 text-purple-400 text-sm font-mono">+</span>

      {/* Center Container */}
      <div className="flex flex-col items-center text-center max-w-xs px-4">
        
        {/* 3D Ribbon Logo Mark */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-200 shadow-md shadow-purple-500/5 flex items-center justify-center p-2.5">
            <img
              src="/logo-mark.png"
              alt="StyleLock"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -inset-2 bg-purple-500/10 rounded-3xl blur-md -z-10 animate-pulse" />
        </div>

        {/* Brand Name */}
        <h1 className="text-xl font-bold tracking-[0.25em] text-zinc-950 font-sans mb-1 uppercase">
          STYLELOCK
        </h1>
        <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-6">
          Style Protection Protocol
        </p>

        {/* 2-second Hairline Loading Bar */}
        <div className="w-48 h-1 bg-zinc-200/80 rounded-full overflow-hidden relative mb-3">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="lowercase">{statusText}</span>
          <span className="text-zinc-400">({progress}%)</span>
        </div>

      </div>

    </div>
  );
}
