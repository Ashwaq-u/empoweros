'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Flag,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Upload,
  Loader2,
} from 'lucide-react';
import { DocumentAnalysisResponse, ChatMessage } from '@/lib/types';

interface PolicyOracleProps {
  analysis: DocumentAnalysisResponse;
  documentContext: string;
}

export default function PolicyOracle({ analysis, documentContext }: PolicyOracleProps) {
  const { unclaimedValueOrBenefits, redFlags, counterStrategy } = analysis;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Hello! I am your Policy Oracle. Ask me any question about your company handbook, leaves, stipends, or benefits. Every answer includes exact chapter and section citations.',
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'RED_FLAGS' | 'COUNTER_ASKS' | 'COUNTER_EMAIL'>('RED_FLAGS');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedAskIndex, setCopiedAskIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          documentContext: documentContext || '',
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Unable to retrieve answer.',
        citation: data.citation,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ An error occurred while retrieving policy citations. Please verify your connection or try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Dynamic benefits to display (fallback to defaults if empty)
  const displayBenefits = (unclaimedValueOrBenefits && unclaimedValueOrBenefits.length > 0)
    ? unclaimedValueOrBenefits
    : [
        { title: '$1,200/yr', estimatedValue: '$100 per month', actionRequired: 'Submit gym, biometric tracker, or ergonomic claims before December 15th.' },
        { title: '$1,500/yr', estimatedValue: 'certs & courses', actionRequired: 'Obtain manager pre-approval for technical certifications, conferences, or courses.' },
        { title: '15 Days', estimatedValue: 'base salary', actionRequired: 'Maintain 10 days reserve and apply during the annual Open Enrollment window.' },
        { title: '5%', estimatedValue: 'immediate vesting', actionRequired: 'Ensure elective deferral is set to at least 5% to capture full employer match.' },
      ];

  return (
    <div className="space-y-6">
      {/* Top 4 Benefits Cards matching screenshot 9 & 10 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayBenefits.slice(0, 4).map((benefit, idx) => {
          // Identify prominent value vs descriptive title
          const hasAmountInValue = /\$|%|\d+\s*day/i.test(benefit.estimatedValue);
          const hasAmountInTitle = /\$|%|\d+\s*day/i.test(benefit.title);

          let displayHeader = benefit.title;
          let displaySub = benefit.estimatedValue;

          if (hasAmountInValue && !hasAmountInTitle) {
            displayHeader = benefit.estimatedValue;
            displaySub = benefit.title;
          }

          return (
            <div
              key={idx}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none p-5 space-y-2"
            >
              <div className="text-xl font-bold text-teal-600 dark:text-teal-400 font-mono truncate" title={displayHeader}>
                {displayHeader}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2" title={displaySub}>
                {displaySub}
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                <span className="font-bold text-zinc-400 dark:text-zinc-500 block mb-0.5 uppercase tracking-wider">
                  Action to Claim
                </span>
                {benefit.actionRequired}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cited Policy Oracle Chat matching screenshot 9 & 17 */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 overflow-hidden shadow-sm dark:shadow-lg">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Flag className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Cited Policy Oracle</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50">
                  Grounded in Handbook
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Every answer references exact sections.</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                    <Flag className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-[#f3f4f6] dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.citation && (
                    <div className="mt-2 text-[11px] font-mono text-teal-700 dark:text-teal-400">
                      Citation: {msg.citation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
              <span>Checking handbook sections...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with teal Send button */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-[#f9fafb] dark:bg-zinc-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about benefits, leave policy, stipends..."
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-teal-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Tabs matching screenshot 9 & 17: Red Flags, Counter-Asks, Counter Email */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
        <button
          onClick={() => setActiveTab('RED_FLAGS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'RED_FLAGS'
              ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Red Flags ({redFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COUNTER_ASKS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'COUNTER_ASKS'
              ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/50 shadow-sm'
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
              ? 'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/50 shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Counter Email</span>
        </button>
      </div>

      {/* TAB 1: Audited Contract Traps matching screenshot 9 & 17 */}
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
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        flag.severity === 'CRITICAL'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                          : flag.severity === 'WARNING'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                          : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50'
                      }`}>
                        <Flag className="w-3 h-3" /> {flag.severity}
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

                      {flag.quotedText && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-zinc-500 dark:text-teal-400/90 uppercase tracking-wider font-mono">
                            EXACT QUOTED CLAUSE
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono code-clause leading-relaxed">
                            "{flag.quotedText}"
                          </div>
                        </div>
                      )}

                      {flag.recommendation && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider font-mono">
                            RECOMMENDED COUNTER ACTION
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#f0fdf4] dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 text-xs text-[#115e59] dark:text-teal-300 leading-relaxed">
                            {flag.recommendation}
                          </div>
                        </div>
                      )}
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
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-white" />
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
