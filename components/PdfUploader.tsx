'use client';

import React, { useState, useRef } from 'react';
import { Upload, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { extractTextFromFile } from '@/lib/pdfParser';

interface PdfUploaderProps {
  onTextExtracted: (text: string, fileName: string) => Promise<void>;
  onLoadSample: (type: 'OFFER' | 'HANDBOOK' | 'LAYOFF') => void;
  isAnalyzing: boolean;
  documentTypeName: string; // e.g. "Offer Letter", "Policy Handbook", "Layoff Notice"
}

export default function PdfUploader({
  onTextExtracted,
  onLoadSample,
  isAnalyzing,
  documentTypeName,
}: PdfUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [parsingStep, setParsingStep] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 15MB limit. Please upload a smaller file.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt' && ext !== 'md') {
      setErrorMessage('Please upload a PDF (.pdf) or text (.txt) file.');
      return;
    }

    try {
      setParsingStep('Extracting text and structure in browser...');
      const extractedText = await extractTextFromFile(file);

      if (!extractedText || extractedText.trim().length < 20) {
        setErrorMessage('Could not extract readable text. The document may be empty or an image-only scan.');
        setParsingStep(null);
        return;
      }

      setParsingStep('Sanitizing PII & initiating AI batch scan...');
      await onTextExtracted(extractedText, file.name);
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setErrorMessage(err.message || 'Failed to parse file. Try uploading a .txt version or use our demo samples.');
    } finally {
      setParsingStep(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Dropzone Container matching exact design in screenshots */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl p-10 sm:p-14 border transition-all duration-200 text-center ${
          dragOver
            ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/20 shadow-lg shadow-purple-500/10'
            : 'border-zinc-300 dark:border-zinc-800/90 bg-[#f9fafb] dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-700'
        } ${isAnalyzing ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-3.5">
          {/* Cloud upload icon inside a rounded container */}
          <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors shadow-sm">
            {isAnalyzing || parsingStep ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              {parsingStep || (isAnalyzing ? 'Analyzing with Google Gemini...' : `Drop your ${documentTypeName} here`)}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Drag & drop your <span className="text-zinc-700 dark:text-zinc-200 font-semibold">.pdf</span> or{' '}
              <span className="text-zinc-700 dark:text-zinc-200 font-semibold">.txt</span> (up to 15 MB)
            </p>
          </div>

          {/* Privacy Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-[11px] font-semibold text-teal-700 dark:text-teal-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Client-side PII masking · Zero-storage</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Try a sample buttons row matching screenshots */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-1">
        <span className="text-zinc-500 text-xs">Try a sample —</span>
        <button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => {
            e.stopPropagation();
            onLoadSample('OFFER');
          }}
          className="px-3 py-1 rounded-lg bg-[#f3f4f6] dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 transition-colors disabled:opacity-50 text-[11px] font-medium"
        >
          Sample Offer Letter
        </button>
        <button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => {
            e.stopPropagation();
            onLoadSample('HANDBOOK');
          }}
          className="px-3 py-1 rounded-lg bg-[#f3f4f6] dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 transition-colors disabled:opacity-50 text-[11px] font-medium"
        >
          Sample Handbook
        </button>
        <button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => {
            e.stopPropagation();
            onLoadSample('LAYOFF');
          }}
          className="px-3 py-1 rounded-lg bg-[#f3f4f6] dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 transition-colors disabled:opacity-50 text-[11px] font-medium"
        >
          Sample Layoff Notice
        </button>
      </div>

      {/* Legal & Financial Disclaimer bar matching screenshots */}
      <div className="rounded-2xl border border-zinc-800/80 dark:border-zinc-800/80 bg-zinc-900/30 dark:bg-zinc-900/30 p-4 text-[11px] text-zinc-500 leading-relaxed flex items-start gap-2.5">
        <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-400 shrink-0 mt-0.5 font-bold">
          i
        </div>
        <div>
          <strong className="text-zinc-400 font-semibold">Legal & Financial Disclaimer: </strong>
          EmpowerOS provides AI-driven analysis for informational and negotiation preparation only. It does not constitute formal legal representation, attorney-client privileged counsel, or binding financial advice. Always consult a licensed labor attorney or certified financial planner for jurisdiction-specific counsel.
        </div>
      </div>
    </div>
  );
}
