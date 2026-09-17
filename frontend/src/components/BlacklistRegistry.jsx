import React from 'react';
import { Database, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

export default function BlacklistRegistry({ reports }) {
  return (
    <section className="py-12 px-4 lg:px-12 bg-surface/50 border-t border-borderDark/60">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>On-Chain Blacklist & Threat Registry</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Live security reports stored in GenLayer Intelligent Contract state on Studio Next.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-300 bg-purple-950/80 border border-purple-800/60 px-3 py-1 rounded-lg">
              {reports.length} Total Reports Recorded
            </span>
          </div>
        </div>

        {/* Registry Table Box */}
        <div className="de1-card bg-surface border border-borderDark rounded-xl overflow-hidden">
          <div className="de1-corner-tl"></div>
          <div className="de1-corner-br"></div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderDark bg-[#07070C] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Target URL / Threat</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderDark/60 font-mono text-xs">
                {reports.map((r, idx) => (
                  <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 text-purple-300 font-bold">#{r.id}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-200">
                      <span className="truncate block" title={r.target_url}>{r.target_url}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.verdict === 'SCAM_CONFIRMED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-950/80 border border-rose-800 text-rose-300">
                          <ShieldAlert className="w-3 h-3" /> SCAM
                        </span>
                      )}
                      {r.verdict === 'PAUSE_TARGET' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-950/80 border border-amber-800 text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> EXPLOIT
                        </span>
                      )}
                      {r.verdict === 'SAFE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                          <ShieldCheck className="w-3 h-3" /> SAFE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{r.confidence}%</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{r.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </section>
  );
}
