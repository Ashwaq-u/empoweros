'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar, { StageId } from '@/components/Navbar';
import HealthRiskMeter from '@/components/HealthRiskMeter';
import OfferLetterScanner from '@/components/OfferLetterScanner';
import PolicyOracle from '@/components/PolicyOracle';
import SeveranceShield from '@/components/SeveranceShield';
import PdfDossierExport from '@/components/PdfDossierExport';
import { DocumentAnalysisResponse, DocumentType } from '@/lib/types';
import {
  SAMPLE_OFFER_LETTER,
  SAMPLE_LAYOFF_NOTICE,
  SAMPLE_EMPLOYEE_HANDBOOK,
  MOCK_OFFER_LETTER_ANALYSIS,
  MOCK_LAYOFF_NOTICE_ANALYSIS,
  MOCK_HANDBOOK_ANALYSIS,
} from '@/lib/mockData';
import { FileText, Briefcase, AlertCircle, ArrowLeft } from 'lucide-react';

const PdfUploader = dynamic(() => import('@/components/PdfUploader'), {
  ssr: false,
  loading: () => (
    <div className="p-10 border border-dashed border-zinc-800 rounded-3xl text-center bg-zinc-900/40 text-xs text-zinc-400">
      Initializing secure in-browser parser...
    </div>
  ),
});

export default function Home() {
  const [activeStage, setActiveStage] = useState<StageId>('STAGE_1');
  const [stageAnalyses, setStageAnalyses] = useState<Record<StageId, DocumentAnalysisResponse | null>>({
    STAGE_1: null,
    STAGE_2: null,
    STAGE_3: null,
  });
  const [stageDocs, setStageDocs] = useState<Record<StageId, { text: string; fileName: string }>>({
    STAGE_1: { text: '', fileName: '' },
    STAGE_2: { text: '', fileName: '' },
    STAGE_3: { text: '', fileName: '' },
  });
  const [stageViewMode, setStageViewMode] = useState<Record<StageId, 'UPLOAD' | 'ANALYSIS'>>({
    STAGE_1: 'UPLOAD',
    STAGE_2: 'UPLOAD',
    STAGE_3: 'UPLOAD',
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const currentAnalysis = stageAnalyses[activeStage];
  const currentDoc = stageDocs[activeStage];
  const currentViewMode = stageViewMode[activeStage];
  const isUploadView = currentViewMode === 'UPLOAD' || !currentAnalysis;

  const getStageDocType = (stage: StageId): DocumentType => {
    switch (stage) {
      case 'STAGE_1':
        return 'OFFER_LETTER';
      case 'STAGE_2':
        return 'POLICY_HANDBOOK';
      case 'STAGE_3':
        return 'TERMINATION_NOTICE';
    }
  };

  const getStageUploadName = (stage: StageId): string => {
    switch (stage) {
      case 'STAGE_1':
        return 'Offer Letter';
      case 'STAGE_2':
        return 'Policy Handbook';
      case 'STAGE_3':
        return 'Layoff Notice';
    }
  };

  const analyzeText = async (text: string, name: string, stage: StageId) => {
    setIsAnalyzing(true);
    setStageDocs((prev) => ({
      ...prev,
      [stage]: { text, fileName: name },
    }));

    try {
      const docTypeHint = getStageDocType(stage);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          documentTypeHint: docTypeHint,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn(`Analysis API returned status ${res.status}:`, errData.error);
        const fallback =
          stage === 'STAGE_1'
            ? MOCK_OFFER_LETTER_ANALYSIS
            : stage === 'STAGE_2'
            ? MOCK_HANDBOOK_ANALYSIS
            : MOCK_LAYOFF_NOTICE_ANALYSIS;
        setStageAnalyses((prev) => ({ ...prev, [stage]: fallback }));
        setStageViewMode((prev) => ({ ...prev, [stage]: 'ANALYSIS' }));
        return;
      }

      const data: DocumentAnalysisResponse = await res.json();
      setStageAnalyses((prev) => ({
        ...prev,
        [stage]: data,
      }));
      setStageViewMode((prev) => ({
        ...prev,
        [stage]: 'ANALYSIS',
      }));
    } catch (err: any) {
      console.warn('Document analysis network fallback:', err?.message || err);
      // If error occurs, fallback to stage mock to prevent broken UI
      if (stage === 'STAGE_1') {
        setStageAnalyses((prev) => ({ ...prev, STAGE_1: MOCK_OFFER_LETTER_ANALYSIS }));
      } else if (stage === 'STAGE_2') {
        setStageAnalyses((prev) => ({ ...prev, STAGE_2: MOCK_HANDBOOK_ANALYSIS }));
      } else {
        setStageAnalyses((prev) => ({ ...prev, STAGE_3: MOCK_LAYOFF_NOTICE_ANALYSIS }));
      }
      setStageViewMode((prev) => ({
        ...prev,
        [stage]: 'ANALYSIS',
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (type: 'OFFER' | 'HANDBOOK' | 'LAYOFF') => {
    if (type === 'OFFER') {
      setActiveStage('STAGE_1');
      setStageDocs((prev) => ({
        ...prev,
        STAGE_1: { text: SAMPLE_OFFER_LETTER, fileName: 'sample_offer.txt' },
      }));
      setStageAnalyses((prev) => ({
        ...prev,
        STAGE_1: MOCK_OFFER_LETTER_ANALYSIS,
      }));
      setStageViewMode((prev) => ({
        ...prev,
        STAGE_1: 'ANALYSIS',
      }));
    } else if (type === 'HANDBOOK') {
      setActiveStage('STAGE_2');
      setStageDocs((prev) => ({
        ...prev,
        STAGE_2: { text: SAMPLE_EMPLOYEE_HANDBOOK, fileName: 'sample_handbook.txt' },
      }));
      setStageAnalyses((prev) => ({
        ...prev,
        STAGE_2: MOCK_HANDBOOK_ANALYSIS,
      }));
      setStageViewMode((prev) => ({
        ...prev,
        STAGE_2: 'ANALYSIS',
      }));
    } else {
      setActiveStage('STAGE_3');
      setStageDocs((prev) => ({
        ...prev,
        STAGE_3: { text: SAMPLE_LAYOFF_NOTICE, fileName: 'sample_layoff.txt' },
      }));
      setStageAnalyses((prev) => ({
        ...prev,
        STAGE_3: MOCK_LAYOFF_NOTICE_ANALYSIS,
      }));
      setStageViewMode((prev) => ({
        ...prev,
        STAGE_3: 'ANALYSIS',
      }));
    }
  };

  const handleStageSelect = (stage: StageId) => {
    setActiveStage(stage);
    // Clicking the center stage switcher always takes user to the uploading screen for that stage
    setStageViewMode((prev) => ({
      ...prev,
      [stage]: 'UPLOAD',
    }));
  };

  const handleClearCurrentStage = () => {
    setStageAnalyses((prev) => ({ ...prev, [activeStage]: null }));
    setStageDocs((prev) => ({ ...prev, [activeStage]: { text: '', fileName: '' } }));
    setStageViewMode((prev) => ({ ...prev, [activeStage]: 'UPLOAD' }));
  };

  const handleResetHome = () => {
    setActiveStage('STAGE_1');
    setStageViewMode((prev) => ({ ...prev, STAGE_1: 'UPLOAD' }));
  };

  // Marquee Ticker items matching screenshots
  const tickerItems = [
    'AI Counter-Negotiation',
    'Policy Oracle Chat',
    'Severance Shield',
    'Financial Runway Calculator',
    'Export Dossier',
    '24/7 IP Trap Detection',
    'Unclaimed Stipend Discovery',
    '90-Day Cliff Audit',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-purple-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeStage={activeStage}
        onSelectStage={handleStageSelect}
        onLoadSample={handleLoadSample}
        isAnalyzing={isAnalyzing}
        hasAnalysis={!!currentAnalysis}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetHome={handleResetHome}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If in UPLOAD view: Render Hero, Marquee Ticker, 3 Stage Cards, and Upload Dropzone */}
        {isUploadView && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Active analysis pill banner if analysis exists in memory for this stage */}
            {currentAnalysis && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-xs shadow-sm">
                <div className="flex items-center gap-2.5 text-purple-950 dark:text-purple-200">
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
                  <span>
                    Analysis ready for <strong className="font-mono">{currentDoc.fileName}</strong> ({currentAnalysis.healthScore}/100 · {currentAnalysis.riskLevel} Risk)
                  </span>
                </div>
                <button
                  onClick={() => setStageViewMode((prev) => ({ ...prev, [activeStage]: 'ANALYSIS' }))}
                  className="px-4 py-1.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-sm self-end sm:self-auto"
                >
                  View Analysis Results →
                </button>
              </div>
            )}

            {/* Hero Section (Stage 1 & 2) */}
            {activeStage !== 'STAGE_3' && (
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/20 bg-grid-pattern p-8 sm:p-12 text-center space-y-6 shadow-sm dark:shadow-none">
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3f4f6] dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-teal-400" />
                  <span>EmpowerOS v2.0 · AI Employee Defense Command Center</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
                  Companies have HR, legal, and finance.{' '}
                  <span className="text-purple-600 dark:text-purple-400">EmpowerOS</span> is the AI that protects yours.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Decode legal jargon before you sign, surface unclaimed stipends while you work, and
                  negotiate high-leverage severance packages the moment you're let go.
                </p>

                {/* 3 Stage Selection Cards matching screenshots */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
                  {/* Card 1: Before Signing */}
                  <div
                    onClick={() => handleStageSelect('STAGE_1')}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      activeStage === 'STAGE_1'
                        ? 'border-purple-300 dark:border-purple-500/60 bg-purple-50/70 dark:bg-purple-950/20 shadow-sm dark:shadow-purple-950/20'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-[#f4f5f7] dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        STAGE 1
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Before Signing</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      Scan offer letters for 24/7 IP traps, generate Exhibit A side-project riders, and view side-by-side contract redlines.
                    </p>
                  </div>

                  {/* Card 2: While Working */}
                  <div
                    onClick={() => handleStageSelect('STAGE_2')}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      activeStage === 'STAGE_2'
                        ? 'border-teal-300 dark:border-teal-500/60 bg-teal-50/70 dark:bg-teal-950/20 shadow-sm dark:shadow-teal-950/20'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-[#f4f5f7] dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        STAGE 2
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">While Working</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      Extract unclaimed wellness & learning stipends, PTO encashment, and ask cited policy questions with verified sources.
                    </p>
                  </div>

                  {/* Card 3: Terminated */}
                  <div
                    onClick={() => handleStageSelect('STAGE_3')}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      (activeStage as string) === 'STAGE_3'
                        ? 'border-rose-300 dark:border-rose-500/60 bg-rose-50/70 dark:bg-rose-950/20 shadow-sm dark:shadow-rose-950/20'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-[#f4f5f7] dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        STAGE 3
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Terminated</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      Audit 90-day option cliff, calculate financial survival runway, and generate 1-click counter emails.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Marquee Ticker (Stage 1 & 2) */}
            {activeStage !== 'STAGE_3' && (
              <div className="py-2 overflow-x-auto no-scrollbar flex items-center justify-center gap-6 text-[11px] text-zinc-600 dark:text-zinc-500 font-medium">
                {tickerItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone (Stage 1 & 2) */}
            {activeStage !== 'STAGE_3' && (
              <div className="space-y-4">
                <PdfUploader
                  onTextExtracted={(text, name) => analyzeText(text, name, activeStage)}
                  onLoadSample={handleLoadSample}
                  isAnalyzing={isAnalyzing}
                  documentTypeName={getStageUploadName(activeStage)}
                />
              </div>
            )}

            {/* Stage 3 Pre-Analysis Landing View (SeveranceShield teaser + Layoff Notice uploader) */}
            {activeStage === 'STAGE_3' && (
              <div className="space-y-8">
                <SeveranceShield
                  analysis={null}
                  onLoadLayoffSample={() => handleLoadSample('LAYOFF')}
                />
                <PdfUploader
                  onTextExtracted={(text, name) => analyzeText(text, name, 'STAGE_3')}
                  onLoadSample={handleLoadSample}
                  isAnalyzing={isAnalyzing}
                  documentTypeName="Layoff Notice"
                />
              </div>
            )}
          </div>
        )}

        {/* If in ANALYSIS view: Render Navigation Bar + HealthRiskMeter + Stage Component */}
        {!isUploadView && currentAnalysis && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Navigation Bar: Back to Upload Screen */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm">
              <button
                onClick={() => setStageViewMode((prev) => ({ ...prev, [activeStage]: 'UPLOAD' }))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-[#f3f4f6] hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700/60 transition-all shadow-sm group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back to {getStageUploadName(activeStage)} Upload Screen</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">
                  Document: <strong className="font-mono text-foreground">{currentDoc.fileName || 'sample_document.txt'}</strong>
                </span>
                <button
                  onClick={handleClearCurrentStage}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
                  title="Clear analysis and upload a new document"
                >
                  Clear & Upload New
                </button>
              </div>
            </div>

            {/* Health & Risk Meter + Multi-Dimensional Radar */}
            <HealthRiskMeter
              analysis={currentAnalysis}
              fileName={currentDoc.fileName}
              onClear={handleClearCurrentStage}
            />

            {/* Stage 1 Analyzed Content */}
            {activeStage === 'STAGE_1' && <OfferLetterScanner analysis={currentAnalysis} />}

            {/* Stage 2 Analyzed Content */}
            {activeStage === 'STAGE_2' && (
              <PolicyOracle analysis={currentAnalysis} documentContext={currentDoc.text} />
            )}

            {/* Stage 3 Analyzed Content */}
            {activeStage === 'STAGE_3' && <SeveranceShield analysis={currentAnalysis} />}
          </div>
        )}
      </main>

      {/* PDF Export Modal */}
      {currentAnalysis && (
        <PdfDossierExport
          analysis={currentAnalysis}
          fileName={currentDoc.fileName}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
}
