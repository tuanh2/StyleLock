import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Cpu, ExternalLink, Award, FileText, ArrowLeft, Zap, DollarSign } from 'lucide-react';
import { txExplorerUrl, addressExplorerUrl } from '../config';

export default function CaseView({ caseData, onBack, onClaimReward, isClaiming }) {
  if (!caseData) return null;

  const isEnforced = caseData.status === 'ENFORCED';
  const isClean = caseData.status === 'CLEAN';
  const isAmbiguous = caseData.status === 'AMBIGUOUS';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Styles & Cases</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Case ID:</span>
          <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
            #{caseData.case_id}
          </span>
        </div>
      </div>

      {/* Autonomous Consensus Banner */}
      <div className={`p-5 rounded-xl border mb-6 ${
        isEnforced
          ? 'bg-rose-950/20 border-rose-500/40'
          : isClean
          ? 'bg-emerald-950/20 border-emerald-500/40'
          : 'bg-amber-950/20 border-amber-500/40'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isEnforced && (
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
            )}
            {isClean && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            )}
            {isAmbiguous && (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">VERDICT: {caseData.verdict}</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isEnforced ? 'bg-rose-500/30 text-rose-300' : isClean ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
                }`}>
                  STATUS: {caseData.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Target: Style #{caseData.style_id} ({caseData.style_name})
              </p>
            </div>
          </div>

          {caseData.txHash && (
            <a
              href={txExplorerUrl(caseData.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View On-Chain Consensus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-mono text-zinc-400 block">Style Similarity</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{caseData.similarity}%</span>
          <span className="text-[10px] text-zinc-500 font-mono">Decentralized score</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-mono text-zinc-400 block">Commercial Use</span>
          <span className={`text-2xl font-bold font-mono mt-1 block ${caseData.commercial_use ? 'text-rose-400' : 'text-emerald-400'}`}>
            {caseData.commercial_use ? 'CONFIRMED' : 'NO'}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Storefront detected</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-mono text-zinc-400 block">AI Confidence</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{caseData.confidence}%</span>
          <span className="text-[10px] text-zinc-500 font-mono">Validator certainty</span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-[11px] font-mono text-zinc-400 block">Bounty Action</span>
          <span className={`text-xl font-bold font-mono mt-1.5 block ${caseData.reward_allocated ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {caseData.reward_allocated ? 'ALLOCATED' : 'NONE'}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Autonomous payout</span>
        </div>
      </div>

      {/* Autonomous Actions Banner (If Enforced) */}
      {isEnforced && (
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-purple-600/40 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Autonomous Protocol Actions Executed Automatically:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Immutable Enforcement Record: <strong>#{caseData.enforcement_record_id || 'SL-0001'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Bounty Credited to Hunter Claim Pool: <strong>0.25 GEN</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Artist Confirmed Detection Counter: <strong>+1</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Suspect URL Permanently Blacklisted for this Style</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytical Reasoning */}
      <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 mb-6 font-mono text-xs">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>GenLayer AI Jury Analytical Rationale</span>
        </h3>
        <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
          "{caseData.reason}"
        </p>

        {/* Matched Traits & Differences */}
        {caseData.matched_traits?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800">
            <span className="text-zinc-400 block mb-1 font-semibold">Matched Distinctive Traits:</span>
            <div className="flex flex-wrap gap-1.5">
              {caseData.matched_traits.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 text-[11px]">
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {caseData.differences?.length > 0 && (
          <div className="mt-3">
            <span className="text-zinc-400 block mb-1 font-semibold">Observed Differences / Mitigating Evidence:</span>
            <div className="space-y-1 text-zinc-400 text-[11px]">
              {caseData.differences.map((d, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-zinc-600">•</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suspect URL & Submission Metadata */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-2 text-zinc-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Suspect Evidence URL:</span>
          <a
            href={caseData.suspect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline break-all"
          >
            {caseData.suspect_url}
          </a>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-zinc-800">
          <span>Hunter Address:</span>
          <span className="text-zinc-200">{caseData.hunter_address}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-zinc-800">
          <span>Legal & Technical Disclaimer:</span>
          <span className="text-zinc-500 italic">StyleLock provides decentralized evidence assessment, not a court determination.</span>
        </div>
      </div>

    </div>
  );
}
