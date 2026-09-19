'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DimensionScore, RiskLevel } from '@/lib/types';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface PowerBalanceRadarProps {
  dimensions?: DimensionScore[];
  riskLevel: RiskLevel;
}

export default function PowerBalanceRadar({ dimensions, riskLevel }: PowerBalanceRadarProps) {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!dimensions || dimensions.length === 0) return null;

  const chartData = dimensions.map((d) => ({
    subject: d.dimension,
    Contract: d.score,
    Benchmark: d.benchmark,
    fullMark: 100,
    description: d.description,
  }));

  const getThemeColor = () => {
    switch (riskLevel) {
      case 'LOW':
        return '#10b981'; // emerald-500
      case 'MEDIUM':
        return '#f59e0b'; // amber-500
      default:
        return '#f43f5e'; // rose-500
    }
  };

  const primaryColor = getThemeColor();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>Workplace Power Balance Radar</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-mono">
            5 Dimensions
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>This Contract</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 border border-zinc-400 dark:border-zinc-500" />
            <span>Market Benchmark</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 bg-[#f4f5f7] dark:bg-transparent border border-zinc-200/80 dark:border-transparent rounded-2xl p-2 transition-colors">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke={isDark ? '#3f3f46' : '#d1d5db'} strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: isDark ? '#a1a1aa' : '#4b5563', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: isDark ? '#71717a' : '#9ca3af', fontSize: 9 }}
              stroke={isDark ? '#27272a' : '#e5e7eb'}
            />
            {/* Market Benchmark Polygon */}
            <Radar
              name="Market Benchmark"
              dataKey="Benchmark"
              stroke={isDark ? '#71717a' : '#9ca3af'}
              fill={isDark ? '#71717a' : '#9ca3af'}
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
            {/* Actual Contract Score Polygon */}
            <Radar
              name="Contract Score"
              dataKey="Contract"
              stroke={primaryColor}
              fill={primaryColor}
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="font-bold text-zinc-900 dark:text-white">{data.subject}</p>
                      <p className="text-zinc-600 dark:text-zinc-300">
                        Contract Score:{' '}
                        <span className="font-mono font-bold" style={{ color: primaryColor }}>
                          {data.Contract} / 100
                        </span>
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        Market Benchmark:{' '}
                        <span className="font-mono">{data.Benchmark} / 100</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic pt-1 border-t border-zinc-200 dark:border-zinc-800">
                        {data.description}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
