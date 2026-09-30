import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  Sparkles,
  Link2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  User,
  Mail,
  Briefcase,
  FileCheck2
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/sampleResumes';
import { SubmissionResult } from '../types';

interface ResumeAnalyzerFormProps {
  onAnalysisComplete: (result: SubmissionResult) => void;
  selectedSampleId?: string;
  onClearSample?: () => void;
}

const PROD_URL = 'https://srivijaya9879.app.n8n.cloud/form/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';
const TEST_URL = 'https://srivijaya9879.app.n8n.cloud/form-test/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';

export const ResumeAnalyzerForm: React.FC<ResumeAnalyzerFormProps> = ({
  onAnalysisComplete,
  selectedSampleId,
  onClearSample,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // n8n endpoint configuration
  const [targetUrl, setTargetUrl] = useState<string>(PROD_URL);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [showEndpointConfig, setShowEndpointConfig] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ testing: boolean; message: string | null; ok: boolean | null }>({
    testing: false,
    message: null,
    ok: null,
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle sample selection when parent passes a profile ID or user picks one
  const handleLoadSample = (profileId: string) => {
    const profile = SAMPLE_PROFILES.find((p) => p.id === profileId);
    if (!profile) return;

    setName(profile.name);
    setEmail(profile.email);
    setTargetRole(profile.role);

    // Create a virtual File object for the sample resume text
    const blob = new Blob([profile.content], { type: 'text/plain' });
    const file = new File([blob], `${profile.name.toLowerCase().replace(/\s+/g, '_')}_resume.txt`, {
      type: 'text/plain',
    });
    setSelectedFile(file);
    setErrorMessage(null);
  };

  // React to prop change if selectedSampleId changes
  React.useEffect(() => {
    if (selectedSampleId) {
      handleLoadSample(selectedSampleId);
    }
  }, [selectedSampleId]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    // Validate file size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClearSample) onClearSample();
  };

  // Test ping the n8n endpoint
  const handleTestPing = async () => {
    setPingStatus({ testing: true, message: 'Testing connectivity...', ok: null });
    try {
      const res = await fetch(`/api/n8n/status?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      if (res.ok) {
        setPingStatus({
          testing: false,
          message: data.message,
          ok: data.ok && !data.isWaitingTest,
        });
      } else {
        setPingStatus({
          testing: false,
          message: data.error || 'Failed to connect to n8n',
          ok: false,
        });
      }
    } catch (err: any) {
      setPingStatus({
        testing: false,
        message: err.message || 'Network error pinging n8n',
        ok: false,
      });
    }
  };

  // Switch between Production and Test Webhook
  const handleModeSwitch = (useTest: boolean) => {
    setIsTestMode(useTest);
    setTargetUrl(useTest ? TEST_URL : PROD_URL);
    setPingStatus({ testing: false, message: null, ok: null });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter candidate name (n8n field-0).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid candidate email (n8n field-1).');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Please select or upload a resume file (n8n field-2).');
      return;
    }

    setSubmitting(true);
    setSubmissionStep('Preparing multipart payload (field-0, field-1, field-2)...');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('targetRole', targetRole.trim());
      formData.append('jobDescription', jobDescription.trim());
      formData.append('targetUrl', targetUrl);
      formData.append('resume', selectedFile);

      setSubmissionStep('Transmitting to n8n cloud webhook...');

      const response = await fetch('/api/submit-resume', {
        method: 'POST',
        body: formData,
      });

      setSubmissionStep('Executing ATS parsing & scorecard evaluation...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit resume to n8n');
      }

      onAnalysisComplete(data);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(
        err.message || 'Error occurred while submitting to n8n. Please check connectivity and try again.'
      );
    } finally {
      setSubmitting(false);
      setSubmissionStep('');
    }
  };

  return (
    <div id="analyzer-section" className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      {/* Container header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
          <span>Form Ingestion</span>
          <span aria-hidden="true">·</span>
          <span>Multipart Transmission</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-mono">Webhook 200 Ready</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
          Resume Submission & Cloud Pipeline
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Upload any resume to dispatch directly to your n8n workflow. The system packages fields as <span className="font-mono text-neutral-300">field-0</span>, <span className="font-mono text-neutral-300">field-1</span>, and <span className="font-mono text-neutral-300">field-2</span>.
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        
        {/* Sample profiles quick bar */}
        <div className="mb-8 border-b border-neutral-800/80 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              One-Click Sample Profiles
            </span>
            <span className="text-xs text-neutral-500">Test the live pipeline immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PROFILES.map((profile) => {
              const isSelected = name === profile.name;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleLoadSample(profile.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500/80 bg-rose-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{profile.name}</span>
                    <Sparkles className="h-3 w-3 text-rose-400" />
                  </div>
                  <span className="text-xs text-neutral-400 truncate mt-0.5">{profile.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Candidate Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="field-0" className="block text-xs font-semibold text-neutral-300 mb-2">
                Candidate Name <span className="text-rose-400">*</span>
                <span className="ml-2 font-mono text-[11px] text-neutral-500">(field-0)</span>
              </label>
              <div className="relative rounded-lg border border-neutral-700/80 bg-neutral-950/70 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="field-0"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  required
                  className="w-full bg-transparent py-2.5 pl-10 pr-3 text-sm text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="field-1" className="block text-xs font-semibold text-neutral-300 mb-2">
                Email Address <span className="text-rose-400">*</span>
                <span className="ml-2 font-mono text-[11px] text-neutral-500">(field-1)</span>
              </label>
              <div className="relative rounded-lg border border-neutral-700/80 bg-neutral-950/70 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="field-1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.chen@example.com"
                  required
                  className="w-full bg-transparent py-2.5 pl-10 pr-3 text-sm text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Target Role & Optional ATS Alignment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="target-role" className="text-xs font-semibold text-neutral-300">
                Target Role / Discipline
              </label>
              <button
                type="button"
                onClick={() => setShowJdInput(!showJdInput)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{showJdInput ? 'Hide Job Description' : '+ Add Job Description for ATS Match'}</span>
                {showJdInput ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            <div className="relative rounded-lg border border-neutral-700/80 bg-neutral-950/70 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <input
                id="target-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Principal Cloud Architect"
                className="w-full bg-transparent py-2.5 pl-10 pr-3 text-sm text-white placeholder-neutral-500 outline-none"
              />
            </div>

            {/* Collapsible Job Description Area */}
            {showJdInput && (
              <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950/90 p-3 space-y-2">
                <span className="text-xs text-neutral-400">
                  Paste the requirements or key qualifications from the job posting to benchmark keyword overlap.
                </span>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={3}
                  placeholder="Paste job posting requirements here (e.g. 5+ years Kubernetes, microservices, Go, high-throughput systems...)"
                  className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none resize-none"
                />
              </div>
            )}
          </div>

          {/* Resume Upload Dropzone (field-2) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Candidate Resume File <span className="text-rose-400">*</span>
              <span className="ml-2 font-mono text-[11px] text-neutral-500">(field-2)</span>
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer ${
                dragActive
                  ? 'border-rose-500 bg-rose-500/10'
                  : selectedFile
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-neutral-700/80 bg-neutral-950/40 hover:border-neutral-600 hover:bg-neutral-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="field-2"
                name="field-2"
                accept=".pdf,.docx,.doc,.txt,.rtf,.md"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between w-full max-w-md px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700/80">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileCheck2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div className="truncate text-left">
                      <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                      <p className="text-xs text-neutral-400 tabular-nums">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Ready for transmission
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-300">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white hover:underline">
                      Click to choose a file
                    </span>{' '}
                    <span className="text-sm text-neutral-400">or drag and drop here</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    PDF, DOCX, TXT or RTF up to 10MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* n8n Webhook Inspector Drawer */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-rose-400" />
                <span className="font-semibold text-white">n8n Cloud Webhook Routing</span>
                <span className={`inline-block h-2 w-2 rounded-full ${isTestMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              </div>
              <button
                type="button"
                onClick={() => setShowEndpointConfig(!showEndpointConfig)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {showEndpointConfig ? 'Hide Config' : 'View / Change Target'}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-neutral-400">
              <span className="font-mono text-[11px] truncate max-w-md">{targetUrl}</span>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={pingStatus.testing}
                className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {pingStatus.testing ? 'Testing...' : 'Ping Webhook'}
              </button>
            </div>

            {pingStatus.message && (
              <div
                className={`mt-2 p-2 rounded text-[11px] flex items-center gap-1.5 ${
                  pingStatus.ok ? 'bg-emerald-950/50 text-emerald-300' : 'bg-amber-950/40 text-amber-300'
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{pingStatus.message}</span>
              </div>
            )}

            {showEndpointConfig && (
              <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(false)}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      !isTestMode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    Production Webhook (24/7 Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(true)}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      isTestMode
                        ? 'bg-amber-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    Test Webhook (form-test)
                  </button>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Note: The provided URL <code className="text-neutral-300">/form-test/...</code> is n8n's test trigger.
                  When active, submissions hit test mode; if test mode is inactive, our proxy gracefully routes to the live production endpoint.
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submission Button & Live Loading Telemetry */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-semibold text-white shadow-lg transition-all cursor-pointer ${
                submitting
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-950/50'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                  <span className="text-sm font-medium">{submissionStep}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="text-sm">Submit to n8n Resume Analyzer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
