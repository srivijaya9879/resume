import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenTester: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTester }) => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-xs text-neutral-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Privacy */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="font-bold text-neutral-200 font-display text-sm">
            Resume Analyzer
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>Automated n8n Cloud Pipeline Interface</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-neutral-400">Resumes processed securely in memory</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenTester}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Webhook Diagnostics
          </button>
          <a
            href="https://srivijaya9879.app.n8n.cloud/form/36d67b5d-ee4f-4177-9714-e2a6f2656dc2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            <span>Direct n8n Form</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span>&copy; {new Date().getFullYear()} ResumeIQ</span>
        </div>

      </div>
    </footer>
  );
};
