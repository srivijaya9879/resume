import React from 'react';
import { ArrowRight, CheckCircle, Database, GitBranch, Cpu, Mail } from 'lucide-react';

export const N8nPipelineArchitecture: React.FC = () => {
  return (
    <section id="workflow-section" className="py-16 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
            <span>Workflow Engine</span>
            <span aria-hidden="true">·</span>
            <span>n8n Cloud Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Automated Processing</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">
            How Your n8n Pipeline Operates
          </h2>
          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
            This web portal functions as the high-fidelity candidate interface for your n8n workflow, transforming unstructured resume uploads into validated multipart payloads.
          </p>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-rose-400 font-semibold">01</span>
                <Database className="h-5 w-5 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Form Trigger Ingestion
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Captures candidate identity (<code className="text-neutral-300">field-0</code>), contact (<code className="text-neutral-300">field-1</code>), and binary resume (<code className="text-neutral-300">field-2</code>).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 font-mono">
              POST /form/{'{uuid}'}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-rose-400 font-semibold">02</span>
                <Cpu className="h-5 w-5 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Document Parsing & OCR
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Extracts raw candidate text, validates file integrity, and isolates work chronology, competencies, and metrics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 font-mono">
              Binary &bull; PDF / DOCX
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-rose-400 font-semibold">03</span>
                <GitBranch className="h-5 w-5 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                ATS Alignment Scoring
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Evaluates keyword density, checks quantifiable metrics, and generates executive diagnostic indicators.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 font-mono">
              Score: 0 &ndash; 100 Index
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-rose-400 font-semibold">04</span>
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Automated Dispatch
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dispatches notification emails to the applicant, synchronizes with ATS spreadsheets, or pings hiring slack channels.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 font-mono">
              HTTP 200 Delivery
            </div>
          </div>

        </div>

        {/* Integration Insight Bento Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <CheckCircle className="h-4 w-4" />
              <span>Production Webhook vs Test Webhook Guide</span>
            </div>
            
            <h3 className="text-xl font-bold text-white font-display">
              Seamlessly Bridging Development and Production
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed">
              When working in n8n, the <code className="text-neutral-200 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">/form-test/</code> URL is used for interactive testing when you click <em>"Execute step"</em> in your canvas. The <code className="text-neutral-200 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">/form/</code> URL is active 24/7 once your workflow is switched to Active.
            </p>

            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-semibold shrink-0">&bull;</span>
                <span><strong>Automatic fallback:</strong> If test mode is chosen but your editor is in standby, our server proxy smoothly falls back to the live production endpoint.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-semibold shrink-0">&bull;</span>
                <span><strong>No CORS barriers:</strong> Express proxy eliminates browser cross-origin constraints when communicating with n8n Cloud instances.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-neutral-800 overflow-hidden shadow-lg aspect-[4/3] bg-neutral-900">
              <img
                src="/src/assets/images/resume_analysis_desk_1790759466751.jpg"
                alt="Document analysis and executive career portfolio"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs text-neutral-300 font-medium">
                Real-time parsing & heuristic extraction
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
