import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
  onSelectSample: (profileId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm, onSelectSample }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-800/60">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-500/5 via-neutral-900/0 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed clean metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="text-rose-400 font-semibold">n8n Cloud Workflow</span>
              <span aria-hidden="true">·</span>
              <span>Automated Resume Ingestion</span>
              <span aria-hidden="true">·</span>
              <span>Instant ATS Diagnostics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] [text-wrap:balance] font-display">
              Transform candidate resumes into structured hiring insights.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              Connected directly to your automated n8n cloud pipeline. Upload applicant resumes, trigger multi-stage parsing, and review structured scoring metrics in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToForm}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer shadow-lg shadow-rose-950/40"
              >
                <span>Upload Candidate Resume</span>
                <ArrowDown className="h-4 w-4" />
              </button>

              <button
                onClick={() => onSelectSample('cloud-architect')}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              >
                <span>Try Sample (Sarah Chen)</span>
              </button>
            </div>

            {/* Unboxed Trust Signals */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-6 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Webhook Ingestion</span>
                </div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">850ms</div>
                <div className="text-xs text-neutral-500">Instant cloud payload</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>ATS Match Index</span>
                </div>
                <div className="text-lg font-bold text-white tabular-nums mt-0.5">Tier 1</div>
                <div className="text-xs text-neutral-500">Heuristic keyword scan</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Execution Status</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">Active</div>
                <div className="text-xs text-neutral-500">n8n Form Trigger live</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-2 overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900">
                <img
                  src="/src/assets/images/hero_resume_workspace_1790759455126.jpg"
                  alt="Modern workspace for talent evaluation and candidate assessment"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-semibold text-white">Live n8n Target:</span>
                    <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[220px]">
                      srivijaya9879.app.n8n.cloud
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
