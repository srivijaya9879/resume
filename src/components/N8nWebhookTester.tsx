import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Radio, Terminal, Send, Copy, Check } from 'lucide-react';

interface N8nWebhookTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROD_URL = 'https://srivijaya9879.app.n8n.cloud/form/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';
const TEST_URL = 'https://srivijaya9879.app.n8n.cloud/form-test/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';

export const N8nWebhookTester: React.FC<N8nWebhookTesterProps> = ({ isOpen, onClose }) => {
  const [activeUrl, setActiveUrl] = useState<string>(PROD_URL);
  const [loading, setLoading] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePing = async (urlToPing: string) => {
    setLoading(true);
    setPingResult(null);
    try {
      const res = await fetch(`/api/n8n/status?url=${encodeURIComponent(urlToPing)}`);
      const data = await res.json();
      setPingResult({ ...data, httpOk: res.ok });
    } catch (e: any) {
      setPingResult({ error: e.message || 'Network error pinging n8n', httpOk: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white font-display">
              n8n Cloud Webhook Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          
          {/* Target Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select n8n Trigger Endpoint:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveUrl(PROD_URL);
                  setPingResult(null);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeUrl === PROD_URL
                    ? 'border-emerald-500/80 bg-emerald-950/20 text-white'
                    : 'border-neutral-800 bg-neutral-950/50 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs mb-1">
                  <span>Production Endpoint</span>
                  <span className="text-[10px] text-emerald-400">24/7 Live</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-400 truncate">
                  /form/36d67b5d...
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveUrl(TEST_URL);
                  setPingResult(null);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeUrl === TEST_URL
                    ? 'border-amber-500/80 bg-amber-950/20 text-white'
                    : 'border-neutral-800 bg-neutral-950/50 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs mb-1">
                  <span>Test Endpoint</span>
                  <span className="text-[10px] text-amber-400">Interactive</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-400 truncate">
                  /form-test/36d67b5d...
                </div>
              </button>
            </div>
          </div>

          {/* Current URL Bar */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-neutral-800 bg-neutral-950">
            <span className="font-mono text-[11px] text-neutral-300 truncate select-all">
              {activeUrl}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => handlePing(activeUrl)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded bg-rose-500 hover:bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Ping Handshake</span>
              </button>
            </div>
          </div>

          {/* Ping Diagnostics Result Console */}
          {pingResult && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-rose-400" />
                  <span>Handshake Diagnostics</span>
                </span>
                <span className="text-neutral-500 tabular-nums">
                  {pingResult.latencyMs ? `${pingResult.latencyMs}ms` : ''}
                </span>
              </div>

              <div className="pt-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Status:</span>
                  <span className={pingResult.ok ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    HTTP {pingResult.status || 'ERR'}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-neutral-500">Notice:</span>
                  <span className="text-neutral-300">{pingResult.message || pingResult.error}</span>
                </div>

                {pingResult.isWaitingTest && (
                  <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200 mt-2 font-sans text-xs">
                    <strong>Tip:</strong> In n8n, open your workflow canvas, click the <em>Form Trigger</em> node, and click the <em>"Execute step"</em> button. n8n will begin actively listening on this test URL!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payload schema reference */}
          <div className="pt-2">
            <span className="font-semibold text-neutral-400 block mb-1">
              n8n Form Trigger Payload Schema:
            </span>
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono text-[11px] text-neutral-400 space-y-1">
              <div><strong className="text-rose-400">field-0</strong>: string (Candidate Full Name)</div>
              <div><strong className="text-rose-400">field-1</strong>: string (Candidate Email Address)</div>
              <div><strong className="text-rose-400">field-2</strong>: Binary File (PDF / DOCX / TXT Resume Document)</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
