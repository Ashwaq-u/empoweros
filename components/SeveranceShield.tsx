'use client';

import React, { useState, useMemo } from 'react';
import {
  Flag,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Upload,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DocumentAnalysisResponse, SeverityLevel } from '@/lib/types';

interface SeveranceShieldProps {
  analysis?: DocumentAnalysisResponse | null;
  onLoadLayoffSample?: () => void;
}

export default function SeveranceShield({
  analysis,
  onLoadLayoffSample,
}: SeveranceShieldProps) {
  // Runway Calculator States matching screenshots 5, 8, 13, 16
  const [savings, setSavings] = useState<number>(45000);
  const [severance, setSeverance] = useState<number>(12000);
  const [expenses, setExpenses] = useState<number>(7500);

  // Tabs for Analyzed State
  const [activeTab, setActiveTab] = useState<'RED_FLAGS' | 'COUNTER_ASKS' | 'COUNTER_EMAIL'>('RED_FLAGS');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedAskIndex, setCopiedAskIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic runway calculation
  const totalFunds = savings + severance;
  const runwayMonths = Math.max(1, Math.round(totalFunds / Math.max(1, expenses)));

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

  // IF NO ANALYSIS IS LOADED: Render the Landing State (screenshots 5, 8, 13, 16)
  if (!analysis) {
    return (
      <div className="space-y-8">
        {/* Title & Tag */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            <span>Stage 3 · Termination Defense</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            SeveranceShield
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Audit your exposure. Calculate your runway. Fight back.
          </p>
        </div>

        {/* Two Teaser Cards matching screenshots 5 & 13 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: 90-Day Option Cliff */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">90-Day Option Cliff</h4>
                <div className="text-[11px] text-zinc-500">Unvested equity forfeiture risk</div>
              </div>
            </div>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-500 font-mono tracking-tight">
              $102,000
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              12,000 unvested shares × $8.50 strike price. Your options expire in 90 days unless you negotiate an extension. Market standard is 12–24 months.
            </p>
            {onLoadLayoffSample && (
              <button
                onClick={onLoadLayoffSample}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 pt-1"
              >
                Load Layoff Notice to Analyze →
              </button>
            )}
          </div>

          {/* Card 2: Severance Deficit */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">Severance Deficit</h4>
                <div className="text-[11px] text-zinc-500">Below-market package gap</div>
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
              6 Weeks Short
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Offered 2 weeks for 3 years of service. Market standard is 8 weeks. Reference to "enhanced severance" in your offer letter was never defined.
            </p>
            {onLoadLayoffSample && (
              <button
                onClick={onLoadLayoffSample}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 pt-1"
              >
                Calculate True Market Value →
              </button>
            )}
          </div>
        </div>

        {/* Financial Runway Calculator matching screenshots 5 & 13 */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Financial Runway Calculator</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Adjust sliders to model your financial survival window in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders on Left */}
            <div className="lg:col-span-7 space-y-5">
              {/* Slider 1: Current Savings */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Current Savings</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    ${savings.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={1000}
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Slider 2: Severance Offered */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Severance Offered</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    ${severance.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={severance}
                  onChange={(e) => setSeverance(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Slider 3: Monthly Expenses */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Monthly Expenses</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    ${expenses.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={250}
                  value={expenses}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Dial Gauge on Right matching screenshots */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-2">
              <div className="relative w-36 h-28 flex items-center justify-center">
                {/* SVG Semi-Circle Dial */}
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <path
                    d="M 15 65 A 40 40 0 0 1 85 65"
                    fill="none"
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-[#27272a]"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 15 65 A 40 40 0 0 1 85 65"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="8"
                    strokeDasharray="125"
                    strokeDashoffset={Math.max(0, 125 - (runwayMonths / 12) * 125)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                  <span className="text-4xl font-black text-foreground font-mono">
                    {runwayMonths}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                    MONTHS RUNWAY
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Total: <span className="font-bold text-foreground">${totalFunds.toLocaleString()}</span> ÷{' '}
                <span className="font-bold text-foreground">${expenses.toLocaleString()}/mo</span>
              </div>
              <div className="text-xs font-bold text-teal-700 dark:text-teal-400">
                Strong position — negotiate from strength
              </div>
            </div>
          </div>
        </div>

        {/* Ready to fight back CTA matching screenshots 8 & 16 */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 bg-grid-pattern shadow-sm dark:shadow-none p-8 text-center space-y-4">
          <h3 className="text-lg font-bold text-foreground">Ready to fight back?</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Upload your layoff notice for a personalized counter-offer letter addressing your equity cliff, below-market severance, and COBRA rights.
          </p>
          {onLoadLayoffSample && (
            <button
              onClick={onLoadLayoffSample}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-lg shadow-purple-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Generate 1-Click Counter-Negotiation Email</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // IF ANALYSIS IS LOADED: Render the Analyzed State (screenshots 11, 12, 21, 22)
  const redFlags = analysis.redFlags;
  const counterStrategy = analysis.counterStrategy;

  return (
    <div className="space-y-6">
      {/* 3 Tabs: Red Flags (3), Counter-Asks, Counter Email */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
        <button
          onClick={() => setActiveTab('RED_FLAGS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'RED_FLAGS'
              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Red Flags ({redFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COUNTER_ASKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'COUNTER_ASKS'
              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 shadow-sm'
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
              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Counter Email</span>
        </button>
      </div>

      {/* TAB 1: Audited Contract Traps matching screenshots 12 & 22 */}
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                        <Flag className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Critical Trap
                      </span>
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

                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-zinc-500 dark:text-teal-400/90 uppercase tracking-wider font-mono">
                          EXACT QUOTED CLAUSE
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono code-clause leading-relaxed">
                          "{flag.quotedText}"
                        </div>
                      </div>

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
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md"
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
