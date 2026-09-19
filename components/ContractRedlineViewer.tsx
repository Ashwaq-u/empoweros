'use client';

import React, { useState } from 'react';
import { ContractRedline } from '@/lib/types';
import { FileDiff, Copy, Check, Scale, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ContractRedlineViewerProps {
  redlines?: ContractRedline[];
}

export default function ContractRedlineViewer({ redlines }: ContractRedlineViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!redlines || redlines.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-400">
        No contract redlines available for this document.
      </div>
    );
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <FileDiff className="w-4 h-4 text-indigo-400" />
            Side-by-Side Contract Redline Diff
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Surgical contract amendments replacing predatory clauses with standard employee protections
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          {redlines.length} Clauses Redlined
        </span>
      </div>

      <div className="space-y-5">
        {redlines.map((redline, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-lg transition-all"
          >
            {/* Header */}
            <div className="px-5 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-indigo-300 border border-zinc-700">
                  {redline.sectionNumber}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {redline.clauseTitle}
                </h4>
              </div>

              <button
                onClick={() => handleCopy(redline.amendedText, idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                title="Copy proposed replacement clause"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Clause!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Amendment</span>
                  </>
                )}
              </button>
            </div>

            {/* Side-by-side Diff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
              {/* Left: Original Predatory Clause */}
              <div className="p-5 bg-rose-950/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Original Predatory Language (To Be Struck)</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-rose-900/40 text-xs text-zinc-300 font-mono leading-relaxed">
                  <span className="line-through decoration-rose-500 decoration-2 bg-rose-500/15 text-rose-300 px-1 py-0.5 rounded">
                    {redline.strikeThroughText}
                  </span>
                </div>
              </div>

              {/* Right: EmpowerOS Protective Amendment */}
              <div className="p-5 bg-emerald-950/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>EmpowerOS Proposed Amendment (Replacement)</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-900/40 text-xs text-zinc-200 font-mono leading-relaxed">
                  <span className="bg-emerald-500/15 text-emerald-300 px-1 py-0.5 rounded border-b border-emerald-500/40">
                    {redline.amendedText}
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Rationale Footer */}
            <div className="px-5 py-3 bg-zinc-900/40 border-t border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-300">Negotiation Legal Rationale: </span>
                {redline.legalRationale}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
