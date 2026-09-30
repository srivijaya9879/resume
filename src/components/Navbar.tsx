import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (id: string) => void;
  onOpenTester: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection, onOpenTester }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 font-display"
        >
          Resume Analyzer
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-400 md:flex">
          <button
            onClick={() => onScrollToSection('analyzer-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Analysis Tool
          </button>
          <button
            onClick={() => onScrollToSection('workflow-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            n8n Pipeline
          </button>
          <button
            onClick={() => onScrollToSection('samples-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sample Resumes
          </button>
          <button
            onClick={onOpenTester}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Webhook Status
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onScrollToSection('analyzer-section')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            <span>Analyze Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
