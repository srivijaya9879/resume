import React from 'react';
import { SAMPLE_PROFILES } from '../data/sampleResumes';
import { ArrowRight, UserCheck, Briefcase, Mail } from 'lucide-react';

interface SampleProfilesSectionProps {
  onSelectProfile: (id: string) => void;
}

export const SampleProfilesSection: React.FC<SampleProfilesSectionProps> = ({ onSelectProfile }) => {
  return (
    <section id="samples-section" className="py-16 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2">
            <span>Instant Demo</span>
            <span aria-hidden="true">·</span>
            <span>Pre-Loaded Candidates</span>
            <span aria-hidden="true">·</span>
            <span>Zero Setup Required</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">
            Sample Candidate Portfolios
          </h2>
          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
            Test the live n8n transmission pipeline with a single click. Select any candidate below to populate the analyzer and verify webhook delivery.
          </p>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_PROFILES.map((profile) => (
            <div
              key={profile.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all hover:bg-neutral-900/70"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Verified Profile
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {profile.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-3">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="truncate">{profile.role}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                  {profile.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {profile.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-neutral-800/80 px-2 py-0.5 text-[11px] font-medium text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 4 && (
                    <span className="text-[11px] text-neutral-500 self-center">
                      +{profile.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectProfile(profile.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer"
              >
                <span>Load & Analyze Profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
