import React from 'react';
import { txExplorerUrl } from '../config';

export default function CaseView({ caseData, onBack, onClaimReward, isClaiming }) {
  if (!caseData) return null;

  const isEnforced = caseData.status === 'ENFORCED';
  const isClean = caseData.status === 'CLEAN';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          ← Back to Styles & Cases
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Case:</span>
          <span className="text-xs font-mono font-bold text-zinc-900 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
            #{caseData.case_id}
          </span>
        </div>
      </div>

      {/* Consensus Banner */}
      <div className={`p-5 rounded-xl border mb-6 ${
        isEnforced
          ? 'bg-rose-50 border-rose-200'
          : isClean
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-950 font-mono">VERDICT: {caseData.verdict}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isEnforced ? 'bg-rose-200 text-rose-800' : isClean ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
              }`}>
                {caseData.status}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Subject: Style #{caseData.style_id} ({caseData.style_name})
            </p>
          </div>

          {caseData.txHash && (
            <a
              href={txExplorerUrl(caseData.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-purple-700 hover:text-purple-900 bg-white px-3 py-1.5 rounded-md border border-purple-200 transition-colors"
            >
              View On-Chain Consensus ↗
            </a>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-white border border-zinc-200">
          <span className="text-[11px] font-mono text-zinc-400 block uppercase">Style Match</span>
          <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{caseData.similarity}%</span>
          <span className="text-[10px] text-zinc-400 font-mono">Similarity score</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200">
          <span className="text-[11px] font-mono text-zinc-400 block uppercase">Commercial Use</span>
          <span className={`text-2xl font-bold font-mono mt-1 block ${caseData.commercial_use ? 'text-rose-600' : 'text-emerald-600'}`}>
            {caseData.commercial_use ? 'CONFIRMED' : 'NO'}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">Storefront check</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200">
          <span className="text-[11px] font-mono text-zinc-400 block uppercase">Confidence</span>
          <span className="text-2xl font-bold text-zinc-950 font-mono mt-1 block">{caseData.confidence}%</span>
          <span className="text-[10px] text-zinc-400 font-mono">Validator agreement</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200">
          <span className="text-[11px] font-mono text-zinc-400 block uppercase">Bounty</span>
          <span className={`text-xl font-bold font-mono mt-1.5 block ${caseData.reward_allocated ? 'text-emerald-600' : 'text-zinc-400'}`}>
            {caseData.reward_allocated ? 'ALLOCATED' : 'NONE'}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">Escrow status</span>
        </div>
      </div>

      {/* Enforcement Actions Executed */}
      {isEnforced && (
        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 mb-6">
          <span className="text-xs font-mono font-bold text-purple-950 block mb-2">
            Protocol Actions Executed On-Chain:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-800">
            <div>• Enforcement Log: <strong>#{caseData.enforcement_record_id || 'SL-0001'}</strong></div>
            <div>• Bounty Credited: <strong>0.25 GEN</strong></div>
            <div>• Style Counter: <strong>+1 Confirmed Infringement</strong></div>
            <div>• URL Flagged permanently in style registry</div>
          </div>
        </div>
      )}

      {/* Analytical Reasoning */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200 mb-6 font-mono text-xs">
        <h3 className="text-sm font-bold text-zinc-950 mb-2">
          Validator Rationale
        </h3>
        <p className="text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-200">
          "{caseData.reason}"
        </p>

        {caseData.matched_traits?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-200">
            <span className="text-zinc-800 block mb-1 font-semibold">Matched Traits:</span>
            <div className="flex flex-wrap gap-1.5">
              {caseData.matched_traits.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {caseData.differences?.length > 0 && (
          <div className="mt-3">
            <span className="text-zinc-800 block mb-1 font-semibold">Differentiating Traits:</span>
            <div className="space-y-1 text-zinc-600 text-[11px]">
              {caseData.differences.map((d, i) => (
                <div key={i}>– {d}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suspect URL & Submission Metadata */}
      <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs font-mono space-y-2 text-zinc-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Suspect Evidence URL:</span>
          <a
            href={caseData.suspect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline break-all font-medium"
          >
            {caseData.suspect_url}
          </a>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-zinc-100">
          <span>Hunter Address:</span>
          <span className="text-zinc-900">{caseData.hunter_address}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-zinc-100">
          <span>Notice:</span>
          <span className="text-zinc-400">StyleLock provides decentralized evidence evaluation, not legal representation.</span>
        </div>
      </div>

    </div>
  );
}
