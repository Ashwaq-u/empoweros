'use client';

import React from 'react';
import { Scale } from 'lucide-react';

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export default function DisclaimerBanner({ className = '', compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 rounded-md px-3 py-1.5 ${className}`}>
        <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Disclaimer:</strong> AI analysis for informational and negotiation preparation only. Not formal legal or financial advice.
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-amber-950/40 via-zinc-900/70 to-amber-950/40 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200/90 flex items-start sm:items-center gap-3 shadow-sm backdrop-blur-sm ${className}`}>
      <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
        <Scale className="w-4 h-4" />
      </div>
      <div className="flex-1 leading-relaxed">
        <span className="font-semibold text-amber-300">⚖️ Legal & Financial Disclaimer:</span> EmpowerOS provides AI-driven analysis for informational and negotiation preparation purposes only. It does not constitute formal legal representation, attorney-client privileged counsel, or binding financial advice. Always consult a licensed labor attorney or certified financial planner for jurisdiction-specific counsel.
      </div>
    </div>
  );
}
