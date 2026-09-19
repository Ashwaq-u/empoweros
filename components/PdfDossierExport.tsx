'use client';

import React, { useState } from 'react';
import { DocumentAnalysisResponse } from '@/lib/types';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Shield,
  Download,
  Scale,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface PdfDossierExportProps {
  analysis: DocumentAnalysisResponse;
  fileName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfDossierExport({
  analysis,
  fileName = 'Document',
  isOpen,
  onClose,
}: PdfDossierExportProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = async () => {
    const md = `# EMPOWEROS EMPLOYEE DEFENSE DOSSIER
CONFIDENTIAL LEGAL & COMPENSATION STRATEGY MEMORANDUM
Generated: ${new Date().toLocaleDateString()} | Target Document: ${fileName}

## 1. EXECUTIVE POSTURE & HEALTH SCORE
- Overall Health Score: ${analysis.healthScore} / 100 (${analysis.riskLevel} Risk)
- Document Type: ${analysis.documentType}
- Executive Summary: ${analysis.summary}

## 2. AUDITED RED FLAGS & LEGAL TRAPS
${analysis.redFlags
  .map(
    (rf, i) => `### ${i + 1}. ${rf.clauseTitle} [${rf.severity}]
- Quoted Language: "${rf.quotedText}"
- Legal Issue: ${rf.issueExplanation}
- Strategic Counter: ${rf.recommendation}
`
  )
  .join('\n')}

## 3. UNCLAIMED MONETARY VALUE & PERKS
${analysis.unclaimedValueOrBenefits
  .map((uv, i) => `- ${uv.title}: ${uv.estimatedValue} (Action: ${uv.actionRequired})`)
  .join('\n')}

## 4. CRITICAL DEADLINES
${analysis.criticalDeadlines
  .map((cd, i) => `- ${cd.event} | Timeframe: ${cd.timeframe} | Impact: ${cd.impact}`)
  .join('\n')}

## 5. COUNTER-NEGOTIATION DRAFT EMAIL
${analysis.counterStrategy.generatedDraftEmail || 'N/A'}

---
⚖️ DISCLAIMER: EmpowerOS provides AI-driven analysis for informational and negotiation preparation purposes only. Not formal legal or financial advice.`;

    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Executive Defense Dossier & PDF Export
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                  Ready to Print
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Official audit memorandum formatted for download, printing, or sharing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0 print:overflow-visible font-sans text-zinc-200">
          {/* Dossier Header */}
          <div className="border-b-2 border-zinc-800 pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-black tracking-tight text-white uppercase">
                  EmpowerOS Defense Audit
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">
                MEMO ID: EMP-{Math.abs(analysis.healthScore * 3137).toString().padStart(6, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs border-t border-zinc-800/80">
              <div>
                <span className="text-zinc-500 block">Target Document:</span>
                <span className="font-semibold text-white font-mono">{fileName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Document Type:</span>
                <span className="font-semibold text-white">{analysis.documentType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Date of Audit:</span>
                <span className="font-semibold text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Overall Posture:</span>
                <span
                  className={`font-bold ${
                    analysis.riskLevel === 'LOW'
                      ? 'text-emerald-400'
                      : analysis.riskLevel === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {analysis.healthScore}/100 ({analysis.riskLevel} Risk)
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              1. Executive Summary & Assessment
            </h4>
            <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              {analysis.summary}
            </p>
          </div>

          {/* Red Flags Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Contract Traps & Restrictive Covenants
            </h4>
            <div className="space-y-3">
              {analysis.redFlags.map((flag, i) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{flag.clauseTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="italic text-zinc-400 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">
                    "{flag.quotedText}"
                  </p>
                  <p className="text-zinc-300">{flag.issueExplanation}</p>
                  <div className="text-emerald-400 font-medium">
                    💡 Recommendation: {flag.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unclaimed Value & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                3. Unclaimed Value Discovered
              </h4>
              <div className="space-y-2">
                {analysis.unclaimedValueOrBenefits.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs">
                    <span className="font-bold text-emerald-400 block">{item.title}</span>
                    <span className="text-white font-mono font-semibold">{item.estimatedValue}</span>
                    <p className="text-zinc-400 mt-1">{item.actionRequired}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                4. Critical Action Deadlines
              </h4>
              <div className="space-y-2">
                {analysis.criticalDeadlines.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs">
                    <span className="font-bold text-amber-400 block">{item.event}</span>
                    <span className="text-white font-mono font-semibold">{item.timeframe}</span>
                    <p className="text-zinc-400 mt-1">{item.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Counter Email Draft */}
          {analysis.counterStrategy.generatedDraftEmail && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                5. Calibrated Counter-Negotiation Draft
              </h4>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {analysis.counterStrategy.generatedDraftEmail}
              </div>
            </div>
          )}

          {/* Legal Disclaimer Footer */}
          <div className="pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 text-center leading-relaxed">
            ⚖️ DISCLAIMER: EmpowerOS provides AI-driven analysis for informational and negotiation preparation purposes only. It does not constitute formal legal or financial advice. Always consult a licensed attorney or certified financial planner.
          </div>
        </div>
      </div>
    </div>
  );
}
