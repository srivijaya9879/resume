export interface DiagnosticReport {
  score: number;
  wordCount: number;
  atsRating: string;
  detectedSkills: string[];
  leadershipSignals: string[];
  metricsDetectedCount: number;
  keywordMatchPercentage: number;
  missingKeywords: string[];
  targetRole: string;
  summaryInsights: string[];
  sectionScores?: {
    summary: number;
    experience: number;
    skills: number;
    formatting: number;
  };
}

export interface CandidateInfo {
  name: string;
  email: string;
  fileName: string;
  fileSizeKb: number;
}

export interface N8nDeliveryInfo {
  url: string;
  statusCode: number;
  response: string;
  fallbackUsed?: boolean;
}

export interface SubmissionResult {
  success: boolean;
  timestamp: string;
  candidate: CandidateInfo;
  n8nDelivery: N8nDeliveryInfo;
  diagnosticReport: DiagnosticReport;
}

export interface SampleProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  summary: string;
  content: string;
  skills: string[];
}
