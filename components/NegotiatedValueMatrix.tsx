'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

interface NegotiatedValueMatrixProps {
  baseSalary?: number;
  initialSeveranceWeeks?: number;
  initialOptionValue?: number;
  initialStipendValue?: number;
}

export default function NegotiatedValueMatrix({
  baseSalary = 150000,
  initialSeveranceWeeks = 12,
  initialOptionValue = 45000,
  initialStipendValue = 2700,
}: NegotiatedValueMatrixProps) {
  const [extraWeeks, setExtraWeeks] = useState<number>(initialSeveranceWeeks);
  const [optionValue, setOptionValue] = useState<number>(initialOptionValue);
  const [stipendValue, setStipendValue] = useState<number>(initialStipendValue);

  // Weekly salary calculation
  const weeklyRate = baseSalary / 52;
  const severanceGain = Math.round(extraWeeks * weeklyRate);
  const totalValueUnlocked = severanceGain + optionValue + stipendValue;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-zinc-900/60 to-zinc-950 p-6 shadow-xl space-y-6">
      {/* Header & Total Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Negotiation ROI & Value Matrix</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Total Negotiated Financial Upside
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Quantifying the monetary value reclaimed through EmpowerOS counter-strategies
          </p>
        </div>

        <div className="flex flex-col items-end bg-zinc-950/80 border border-emerald-500/40 rounded-2xl px-5 py-3 shadow-lg shadow-emerald-500/10">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Value at Stake
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight flex items-baseline gap-1">
            <span>+${totalValueUnlocked.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-emerald-500/90 font-medium">
            Projected Employee Gain
          </span>
        </div>
      </div>

      {/* Interactive Levers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lever 1: Additional Severance Weeks */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Severance Counter Weeks</span>
            <span className="font-mono font-bold text-emerald-400">+{extraWeeks} Weeks</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={extraWeeks}
            onChange={(e) => setExtraWeeks(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-500">Cash Gain:</span>
            <span className="font-mono font-bold text-white">+${severanceGain.toLocaleString()}</span>
          </div>
        </div>

        {/* Lever 2: Equity Preserved via 1-Yr PTE Extension */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Equity Preserved (PTE)</span>
            <span className="font-mono font-bold text-indigo-400">${optionValue.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100000}
            step={2500}
            value={optionValue}
            onChange={(e) => setOptionValue(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-500">Option Window:</span>
            <span className="font-mono font-bold text-indigo-300">90 Days ➔ 1 Year</span>
          </div>
        </div>

        {/* Lever 3: Unclaimed Stipends & PTO Liquidation */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Stipends & PTO Cashout</span>
            <span className="font-mono font-bold text-amber-400">${stipendValue.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={15000}
            step={250}
            value={stipendValue}
            onChange={(e) => setStipendValue(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-500">Includes:</span>
            <span className="font-mono font-bold text-amber-300">Wellness + Learning + PTO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
