import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { SubmissionResult } from '../types';

interface AnalysisResultsProps {
  result: SubmissionResult;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset }) => {
  const { candidate, n8nDelivery, diagnosticReport, timestamp } = result;

  useEffect(() => {
    // Fire celebratory confetti on initial render
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#10b981', '#38bdf8', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback if canvas is restricted
    }
  }, []);

  const handleDownloadReport = () => {
    const reportText = `RESUME ANALYZER EXECUTIVE REPORT
Generated: ${new Date(timestamp).toLocaleString()}
Candidate: ${candidate.name} (${candidate.email})
Target Discipline: ${diagnosticReport.targetRole}
File: ${candidate.fileName} (${candidate.fileSizeKb} KB)
n8n Webhook Target: ${n8nDelivery.url} (HTTP ${n8nDelivery.statusCode})

OVERALL READINESS SCORE: ${diagnosticReport.score}/100 (${diagnosticReport.atsRating})
ATS Keyword Alignment: ${diagnosticReport.keywordMatchPercentage}%
Word Count: ${diagnosticReport.wordCount} words
Quantified Metrics Identified: ${diagnosticReport.metricsDetectedCount}

DETECTED CORE COMPETENCIES:
${diagnosticReport.detectedSkills.map(s => `- ${s}`).join('\n')}

LEADERSHIP & IMPACT VERBS:
${diagnosticReport.leadershipSignals.map(s => `- ${s}`).join('\n')}

KEY EXECUTIVE INSIGHTS:
${diagnosticReport.summaryInsights.map(s => `- ${s}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name.toLowerCase().replace(/\s+/g, '_')}_resume_evaluation.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 animate-fadeIn">
      {/* Success banner */}
      <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Resume Transmitted to n8n Cloud Pipeline
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mt-1">
                <span>Candidate: <strong className="text-white">{candidate.name}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{candidate.email}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-400">HTTP {n8nDelivery.statusCode} OK</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>

        {n8nDelivery.fallbackUsed && (
          <div className="mt-3 text-xs text-amber-300/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
            Note: The requested test webhook was in standby mode, so our engine automatically routed your submission to your live 24/7 Production endpoint at <code className="font-mono">{n8nDelivery.url}</code>.
          </div>
        )}
      </div>

      {/* Main Scorecard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Overall Impact Score */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-left">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Candidate Score</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tabular-nums font-display">
              {diagnosticReport.score}
            </span>
            <span className="text-sm text-neutral-500">/ 100</span>
          </div>
          <p className="mt-2 text-xs text-emerald-400 font-medium">
            {diagnosticReport.atsRating}
          </p>
        </div>

        {/* Card 2: ATS Keyword Match */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-left">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">ATS Alignment</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-400 tabular-nums font-display">
              {diagnosticReport.keywordMatchPercentage}%
            </span>
            <span className="text-sm text-neutral-500">keyword overlap</span>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            High density for {diagnosticReport.targetRole}
          </p>
        </div>

        {/* Card 3: Metrics & Word Count */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-left">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Quantified Proof</span>
            <Layers className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tabular-nums font-display">
              {diagnosticReport.metricsDetectedCount}
            </span>
            <span className="text-sm text-neutral-500">impact metrics</span>
          </div>
          <p className="mt-2 text-xs text-neutral-400 tabular-nums">
            {diagnosticReport.wordCount} words analyzed
          </p>
        </div>

      </div>

      {/* Detailed Diagnostic Insights */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
        
        {/* Executive Feedback */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-rose-400" />
            <h3 className="text-base font-bold text-white font-display">
              Executive Evaluation Insights
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-neutral-300">
            {diagnosticReport.summaryInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Detected */}
        <div className="pt-6 border-t border-neutral-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Verified Competencies & Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {diagnosticReport.detectedSkills.length > 0 ? (
              diagnosticReport.detectedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-200 capitalize"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">No primary tech keywords flagged.</span>
            )}
          </div>
        </div>

        {/* Leadership & Action Verbs */}
        <div className="pt-6 border-t border-neutral-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Strong Action & Leadership Signals
          </h3>
          <div className="flex flex-wrap gap-2">
            {diagnosticReport.leadershipSignals.length > 0 ? (
              diagnosticReport.leadershipSignals.map((verb, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs font-medium text-rose-300 capitalize"
                >
                  {verb}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">No prominent leadership verbs flagged.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords (if any) */}
        {diagnosticReport.missingKeywords.length > 0 && (
          <div className="pt-6 border-t border-neutral-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Recommended Target Role Keywords</span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">
              Consider incorporating these terms to maximize applicant tracking system relevance:
            </p>
            <div className="flex flex-wrap gap-2">
              {diagnosticReport.missingKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-amber-800/60 bg-amber-950/30 px-2.5 py-1 text-xs font-medium text-amber-200"
                >
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transmission metadata footer */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-2">
          <span>Processed by n8n Cloud Webhook Engine</span>
          <span className="font-mono text-[11px] truncate max-w-sm">{n8nDelivery.url}</span>
        </div>

      </div>
    </div>
  );
};
