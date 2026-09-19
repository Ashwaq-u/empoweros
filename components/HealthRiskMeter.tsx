'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  DollarSign,
  Calendar,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { DocumentAnalysisResponse, RiskLevel } from '@/lib/types';
import PowerBalanceRadar from './PowerBalanceRadar';

interface HealthRiskMeterProps {
  analysis: DocumentAnalysisResponse;
  fileName?: string;
  onClear?: () => void;
}

export default function HealthRiskMeter({ analysis, fileName, onClear }: HealthRiskMeterProps) {
  const {
    healthScore,
    riskLevel,
    summary,
    redFlags,
    unclaimedValueOrBenefits,
    criticalDeadlines,
    documentType,
    powerBalanceDimensions,
  } = analysis;

  const isLowRisk = healthScore >= 80 || riskLevel === 'LOW';
  const themeColor = isLowRisk ? '#14b8a6' : '#f43f5e';

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const criticalCount = redFlags.filter((f) => f.severity === 'CRITICAL').length;

  // Compute total unclaimed value display dynamically from analysis.unclaimedValueOrBenefits
  const totalUnclaimedFormatted = (() => {
    if (!unclaimedValueOrBenefits || unclaimedValueOrBenefits.length === 0) {
      return '$0';
    }

    let total = 0;
    let foundDollar = false;

    for (const item of unclaimedValueOrBenefits) {
      let textToScan = `${item.estimatedValue || ''} ${item.title || ''}`;

      // Normalize 'k' suffix (e.g., $15k -> $15000, $10k - $20k -> $10000 - $20000)
      textToScan = textToScan.replace(/\$([0-9]+(?:\.[0-9]+)?)\s*k\b/gi, (_, num) => {
        return `$${Math.round(parseFloat(num) * 1000)}`;
      });

      // Normalize trailing USD notation (e.g., 15,000 USD -> $15,000)
      textToScan = textToScan.replace(/([0-9]{1,3}(?:,[0-9]{3})+)\s*USD/gi, '$$$1');

      // Check if it's an explicit range like $10,000 – $20,000 or $10,000 - $20,000
      const rangeMatch = textToScan.match(/\$([0-9,]+(?:\.[0-9]+)?)\s*(?:–|-|to)\s*\$([0-9,]+(?:\.[0-9]+)?)/i);
      if (rangeMatch) {
        foundDollar = true;
        const n1 = parseFloat(rangeMatch[1].replace(/,/g, ''));
        const n2 = parseFloat(rangeMatch[2].replace(/,/g, ''));
        if (!isNaN(n1) && !isNaN(n2)) {
          total += (n1 + n2) / 2;
          continue;
        }
      }

      // Otherwise match individual dollar amounts
      const matches = textToScan.match(/\$([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)/g);
      if (matches && matches.length > 0) {
        foundDollar = true;
        const nums = matches
          .map((m) => parseFloat(m.replace(/[$,]/g, '')))
          .filter((n) => !isNaN(n) && n > 0);

        if (nums.length === 1) {
          total += nums[0];
        } else if (nums.length >= 2) {
          // If there's an annual amount and a monthly breakdown like $1,200/year ($100/mo), take the primary (larger) annual figure
          if (textToScan.includes('/mo') || textToScan.includes('/month') || textToScan.includes('per month')) {
            total += Math.max(...nums);
          } else {
            total += (nums[0] + nums[1]) / 2;
          }
        }
      }
    }

    if (foundDollar && total > 0) {
      return `$${Math.round(total).toLocaleString()}`;
    }

    return '$0';
  })();

  const fileNameDisplay = fileName || (
    documentType === 'OFFER_LETTER' ? 'sample_offer.txt' :
    documentType === 'POLICY_HANDBOOK' ? 'sample_handbook.txt' : 'sample_layoff.txt'
  );

  return (
    <div className="space-y-6">
      {/* Top Health & Risk Meter Card matching screenshots */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Gauge & Score */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
              <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-zinc-100 dark:stroke-zinc-800/80"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={themeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1s ease-in-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {healthScore}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {isLowRisk ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Low Risk
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    High Risk
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 uppercase tracking-wider">
                  {documentType.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Document Health & Risk Meter
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                Instant 5-second evaluation of legal exposure, contractual traps, and monetary upside.
              </p>
            </div>
          </div>

          {/* Right: 3 Metric Cards matching screenshots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Card 1: Red Flags */}
            <div className="bg-[#f4f5f7] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl px-5 py-4 min-w-[150px]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                <Flag className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Red Flags</span>
              </div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                {redFlags.length}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {criticalCount} critical
              </div>
            </div>

            {/* Card 2: Unclaimed */}
            <div className="bg-[#f4f5f7] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl px-5 py-4 min-w-[150px]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Unclaimed</span>
              </div>
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono">
                {totalUnclaimedFormatted}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Opportunities
              </div>
            </div>

            {/* Card 3: Deadlines */}
            <div className="bg-[#f4f5f7] dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl px-5 py-4 min-w-[150px]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Deadlines</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {criticalDeadlines.length}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Milestones
              </div>
            </div>
          </div>
        </div>

        {/* Exec Synthesis Row */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
            <span className="font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shrink-0 mt-0.5">
              EXEC SYNTHESIS
            </span>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {summary}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <span className="font-mono text-[11px] text-zinc-500">
              {fileNameDisplay}
            </span>
            {onClear && (
              <button
                onClick={onClear}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
                title="Upload or analyze another document"
              >
                Analyze New
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Power Balance Radar Card matching screenshots */}
      {powerBalanceDimensions && powerBalanceDimensions.length > 0 && (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[11px]">
              MULTI-DIMENSIONAL POWER BALANCE RADAR
            </span>
            <div className="flex items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
                <span>This Contract</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <span>Market Benchmark</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <PowerBalanceRadar
              dimensions={powerBalanceDimensions}
              riskLevel={riskLevel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
