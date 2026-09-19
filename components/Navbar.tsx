'use client';

import React from 'react';
import { Shield, FileText, Briefcase, AlertCircle, Upload, Sun, Moon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export type StageId = 'STAGE_1' | 'STAGE_2' | 'STAGE_3';

interface NavbarProps {
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onLoadSample: (type: 'OFFER' | 'HANDBOOK' | 'LAYOFF') => void;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  onOpenExportModal: () => void;
  onResetHome?: () => void;
}

export default function Navbar({
  activeStage,
  onSelectStage,
  onLoadSample,
  isAnalyzing,
  hasAnalysis,
  onOpenExportModal,
  onResetHome,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-background/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Subtitle */}
          <div
            onClick={() => onResetHome ? onResetHome() : onSelectStage('STAGE_1')}
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none group"
            title="Return to EmpowerOS Home / Upload"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white dark:bg-zinc-900 border border-zinc-700/60 shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-zinc-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  EmpowerOS
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 uppercase">
                  V2 AI
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
                Leveling workplace information asymmetry
              </p>
            </div>
          </div>

          {/* Center: 3-Segment Switcher matching screenshots */}
          <nav className="flex items-center p-1 rounded-xl bg-[#f3f4f6] dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80">
            {/* Stage 1: Before Signing */}
            <button
              onClick={() => onSelectStage('STAGE_1')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeStage === 'STAGE_1'
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Stage 1:
                </div>
                <div className="font-bold text-[11px]">Before Signing</div>
              </div>
            </button>

            {/* Stage 2: While Working */}
            <button
              onClick={() => onSelectStage('STAGE_2')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeStage === 'STAGE_2'
                  ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Stage 2:
                </div>
                <div className="font-bold text-[11px]">While Working</div>
              </div>
            </button>

            {/* Stage 3: Terminated */}
            <button
              onClick={() => onSelectStage('STAGE_3')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeStage === 'STAGE_3'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Stage 3:
                </div>
                <div className="font-bold text-[11px]">Terminated</div>
              </div>
            </button>
          </nav>

          {/* Right: Quick Sample Buttons + Export + Theme Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                disabled={isAnalyzing}
                onClick={() => onLoadSample('OFFER')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800/80 dark:shadow-none transition-colors disabled:opacity-50"
              >
                Offer Letter
              </button>
              <button
                disabled={isAnalyzing}
                onClick={() => onLoadSample('HANDBOOK')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800/80 dark:shadow-none transition-colors disabled:opacity-50"
              >
                Handbook
              </button>
              <button
                disabled={isAnalyzing}
                onClick={() => onLoadSample('LAYOFF')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800/80 dark:shadow-none transition-colors disabled:opacity-50"
              >
                Layoff Notice
              </button>
            </div>

            {/* Export Button (visible matching screenshots) */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800/80 dark:shadow-none transition-colors"
              title="Export complete analysis"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
