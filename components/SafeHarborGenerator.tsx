'use client';

import React, { useState } from 'react';
import { SafeHarborProject } from '@/lib/types';
import { ShieldCheck, Plus, Trash2, Copy, Check, FileText, Sparkles, Code2 } from 'lucide-react';

interface SafeHarborGeneratorProps {
  candidateName?: string;
  companyName?: string;
}

export default function SafeHarborGenerator({
  candidateName = 'Alex Morgan',
  companyName = 'Acme Cloud Technologies Inc.',
}: SafeHarborGeneratorProps) {
  const [projects, setProjects] = useState<SafeHarborProject[]>([
    {
      id: '1',
      projectName: 'OpenSource Distributed Cache',
      description: 'High-performance in-memory key-value cache built in Go with Raft consensus.',
      repositoryOrUrl: 'https://github.com/alexmorgan/dist-cache',
      dateStarted: 'January 2024',
    },
    {
      id: '2',
      projectName: 'Developer Productivity Micro-SaaS',
      description: 'CLI tool and web dashboard for tracking cloud infrastructure costs on personal AWS account.',
      repositoryOrUrl: 'https://github.com/alexmorgan/cloud-tracker',
      dateStarted: 'June 2024',
    },
  ]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: SafeHarborProject = {
      id: Date.now().toString(),
      projectName: newProjectName.trim(),
      description: newDescription.trim() || 'Independent personal project created off-hours.',
      repositoryOrUrl: newRepoUrl.trim() || undefined,
      dateStarted: 'Prior to Employment',
    };
    setProjects([...projects, newProj]);
    setNewProjectName('');
    setNewDescription('');
    setNewRepoUrl('');
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Generate formal legal text
  const generateLegalRiderText = () => {
    return `EXHIBIT A: SCHEDULE OF EXCLUDED INVENTIONS & PRIOR INTELLECTUAL PROPERTY
ATTACHMENT TO EMPLOYMENT & PROPRIETARY INFORMATION AGREEMENT

1. IDENTIFICATION OF PRIOR INVENTIONS:
Pursuant to Section 7 of the Offer and Intellectual Property Agreement between ${companyName} ("Company") and ${candidateName} ("Employee"), the following represents a complete and comprehensive list of all inventions, software, original works of authorship, and developments conceived, created, or reduced to practice by the Employee prior to commencement of employment, which are strictly EXCLUDED from Company assignment and remain the sole exclusive property of Employee:

${projects
  .map(
    (p, i) => `[Project ${i + 1}]
• Title: ${p.projectName}
• Description: ${p.description}
${p.repositoryOrUrl ? `• Repository / URL: ${p.repositoryOrUrl}\n` : ''}• Date Conceived: ${p.dateStarted}
`
  )
  .join('\n')}
2. SAFE HARBOR ACKNOWLEDGMENT:
The Company acknowledges and agrees that the Employee retains full, unencumbered ownership and copyright over the above-listed prior inventions and any future updates or maintenance performed off-hours, on personal equipment, without use of Company trade secrets or confidential data.

AGREED AND ACKNOWLEDGED:

Employee Signature: ______________________    Date: ______________
${candidateName}

Company Representative: __________________    Date: ______________
${companyName}`;
  };

  const copyRider = async () => {
    try {
      await navigator.clipboard.writeText(generateLegalRiderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-zinc-900/60 to-zinc-950 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Tech Worker IP Protection Tool</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Side-Project & Prior Inventions Safe Harbor Rider (Exhibit A)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Legally carve out your personal GitHub repositories, indie apps, and off-hours projects before you sign
          </p>
        </div>

        <button
          onClick={copyRider}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied Exhibit A Rider!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Exhibit A Addendum</span>
            </>
          )}
        </button>
      </div>

      {/* Input to Add Side Projects */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <span className="text-xs font-semibold text-zinc-300 block">
          Add Your Personal Side-Projects / Repositories to Exclude:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            placeholder="Project Name (e.g. My Next.js SaaS)"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Brief Description (e.g. Personal analytics tool)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="GitHub / Website URL (optional)"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={addProject}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* List of currently protected projects */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Currently Protected Items ({projects.length})
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-white">{proj.projectName}</span>
                </div>
                <p className="text-zinc-400">{proj.description}</p>
                {proj.repositoryOrUrl && (
                  <span className="font-mono text-[11px] text-indigo-300 block truncate max-w-xs">
                    {proj.repositoryOrUrl}
                  </span>
                )}
              </div>
              <button
                onClick={() => removeProject(proj.id)}
                className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Rider Output Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Signature-Ready Exhibit A Rider Preview</span>
          <span className="font-mono text-[11px]">Attachment to Offer Letter</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
          {generateLegalRiderText()}
        </div>
      </div>
    </div>
  );
}
