'use client';

import React, { useState } from 'react';
import {
  Flag,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Mail,
  Upload,
  Lightbulb,
} from 'lucide-react';
import { DocumentAnalysisResponse, SeverityLevel } from '@/lib/types';

interface OfferLetterScannerProps {
  analysis: DocumentAnalysisResponse;
}

export default function OfferLetterScanner({ analysis }: OfferLetterScannerProps) {
  const { redFlags, counterStrategy } = analysis;
  const [copiedAskIndex, setCopiedAskIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'RED_FLAGS' | 'COUNTER_ASKS' | 'COUNTER_EMAIL'>('RED_FLAGS');

  const copyToClipboard = async (text: string, type: 'ask' | 'email', index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'ask' && index !== undefined) {
        setCopiedAskIndex(index);
        setTimeout(() => setCopiedAskIndex(null), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
            <Flag className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Critical Trap
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <Flag className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            <Flag className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Tabs matching screenshots 6 & 7: Red Flags (3), Counter-Asks, Counter Email */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
        <button
          onClick={() => setActiveTab('RED_FLAGS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'RED_FLAGS'
              ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Red Flags ({redFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COUNTER_ASKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'COUNTER_ASKS'
              ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Counter-Asks</span>
        </button>

        <button
          onClick={() => setActiveTab('COUNTER_EMAIL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'COUNTER_EMAIL'
              ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Counter Email</span>
        </button>
      </div>

      {/* TAB 1: Audited Contract Traps */}
      {activeTab === 'RED_FLAGS' && (
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
            AUDITED CONTRACT TRAPS & RESTRICTIVE COVENANTS
          </div>

          <div className="space-y-3">
            {redFlags.map((flag, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(flag.severity)}
                      <h4 className="text-sm font-bold text-foreground">
                        {flag.clauseTitle}
                      </h4>
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3.5 border-t border-zinc-100 dark:border-zinc-800/60">
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {flag.issueExplanation}
                      </p>

                      {/* Exact Quoted Clause matching screenshots */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 dark:text-teal-400/90 uppercase tracking-wider font-mono">
                          EXACT QUOTED CLAUSE
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono code-clause leading-relaxed">
                          "{flag.quotedText}"
                        </div>
                      </div>

                      {/* Recommended Counter Action matching screenshots */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider font-mono">
                          RECOMMENDED COUNTER ACTION
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#f0fdf4] dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 text-xs text-[#115e59] dark:text-teal-300 leading-relaxed">
                          {flag.recommendation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Counter-Asks */}
      {activeTab === 'COUNTER_ASKS' && (
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
            3 STRATEGIC COUNTER-ASKS READY TO COPY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {counterStrategy.keyNegotiationPoints.map((point, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                      ASK #{index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end">
                  <button
                    onClick={() => copyToClipboard(point, 'ask', index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-transparent transition-colors"
                  >
                    {copiedAskIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="text-teal-600 dark:text-teal-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Counter Email */}
      {activeTab === 'COUNTER_EMAIL' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
              CALIBRATED COUNTER-NEGOTIATION EMAIL DRAFT
            </div>
            <button
              onClick={() => copyToClipboard(counterStrategy.generatedDraftEmail || '', 'email')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-teal-300" />
                  <span>Copied Draft!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Email</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 p-6 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed shadow-sm dark:shadow-inner">
            {counterStrategy.generatedDraftEmail || 'No draft generated.'}
          </div>
        </div>
      )}
    </div>
  );
}
