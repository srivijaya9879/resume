/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResumeAnalyzerForm } from './components/ResumeAnalyzerForm';
import { AnalysisResults } from './components/AnalysisResults';
import { SampleProfilesSection } from './components/SampleProfilesSection';
import { N8nPipelineArchitecture } from './components/N8nPipelineArchitecture';
import { N8nWebhookTester } from './components/N8nWebhookTester';
import { Footer } from './components/Footer';
import { SubmissionResult } from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<SubmissionResult | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);
  const [isTesterOpen, setIsTesterOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSample = (profileId: string) => {
    setSelectedSampleId(profileId);
    setAnalysisResult(null); // Return to form view with loaded profile
    setTimeout(() => {
      scrollToSection('analyzer-section');
    }, 100);
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedSampleId(undefined);
    setTimeout(() => {
      scrollToSection('analyzer-section');
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-rose-500/20 selection:text-rose-200">
      {/* Navigation */}
      <Navbar
        onScrollToSection={scrollToSection}
        onOpenTester={() => setIsTesterOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToForm={() => scrollToSection('analyzer-section')}
          onSelectSample={handleSelectSample}
        />

        {/* Dynamic Centerpiece: Interactive Form or Live Results */}
        {analysisResult ? (
          <AnalysisResults
            result={analysisResult}
            onReset={handleResetAnalysis}
          />
        ) : (
          <ResumeAnalyzerForm
            onAnalysisComplete={(res) => setAnalysisResult(res)}
            selectedSampleId={selectedSampleId}
            onClearSample={() => setSelectedSampleId(undefined)}
          />
        )}

        {/* Pre-configured Candidate Samples */}
        <SampleProfilesSection onSelectProfile={handleSelectSample} />

        {/* n8n Architecture Breakdown */}
        <N8nPipelineArchitecture />
      </main>

      {/* Webhook Status & Diagnostics Inspector Modal */}
      <N8nWebhookTester
        isOpen={isTesterOpen}
        onClose={() => setIsTesterOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenTester={() => setIsTesterOpen(true)} />
    </div>
  );
}
