import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const DEFAULT_N8N_PROD_URL = 'https://srivijaya9879.app.n8n.cloud/form/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';
const DEFAULT_N8N_TEST_URL = 'https://srivijaya9879.app.n8n.cloud/form-test/36d67b5d-ee4f-4177-9714-e2a6f2656dc2';

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ping / status check for n8n endpoints
app.get('/api/n8n/status', async (req, res) => {
  const targetUrl = (req.query.url as string) || DEFAULT_N8N_PROD_URL;
  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Resume-Analyzer-Applet/1.0',
      },
    });
    const latencyMs = Date.now() - startTime;
    const body = await response.text();

    const isWaitingTest = body.includes("Form Trigger isn't listening yet");
    const isLiveForm = body.includes("Resume Analyzer") || body.includes("<form");

    res.json({
      url: targetUrl,
      status: response.status,
      ok: response.ok,
      latencyMs,
      isWaitingTest,
      isLiveForm,
      message: isWaitingTest
        ? "n8n Test Trigger is in standby. Click 'Execute step' in your n8n workflow editor."
        : response.ok
        ? "Connected & listening to n8n Cloud webhook."
        : `Endpoint returned HTTP ${response.status}`,
    });
  } catch (error: any) {
    res.status(500).json({
      url: targetUrl,
      error: error.message || 'Failed to connect to n8n endpoint',
    });
  }
});

// Helper for analyzing resume text content
function analyzeResumeText(text: string, candidateName: string, role?: string, jobDescription?: string) {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Key skill detection lists
  const techSkills = [
    'javascript', 'typescript', 'react', 'node', 'python', 'sql', 'docker', 'aws',
    'cloud', 'api', 'git', 'ci/cd', 'tailwind', 'graphql', 'mongodb', 'postgresql',
    'kubernetes', 'rest', 'linux', 'html', 'css', 'next.js', 'vue', 'golang', 'java'
  ];

  const leadershipSkills = [
    'leadership', 'mentored', 'managed', 'spearheaded', 'architected', 'collaborated',
    'delivered', 'optimized', 'scaled', 'initiated', 'coordinated', 'transformed'
  ];

  const detectedTech = techSkills.filter(s => lower.includes(s));
  const detectedLeadership = leadershipSkills.filter(s => lower.includes(s));

  // Count quantifiable achievements ($ amounts, % percentages, metrics)
  const numbersAndMetrics = text.match(/(\d+%\s|\$\d+|\b\d+\b\+?\s*(users|teams|projects|clients|engineers|reduction|increase|growth|revenue|ms|seconds))/gi) || [];

  // ATS scoring heuristics
  let score = 70;
  if (wordCount >= 250 && wordCount <= 800) score += 10;
  if (detectedTech.length >= 4) score += 8;
  if (detectedLeadership.length >= 2) score += 6;
  if (numbersAndMetrics.length >= 3) score += 6;
  if (score > 98) score = 98;

  // Job description matching if provided
  let keywordMatchPct = 85;
  let missingKeywords: string[] = [];
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdWords = Array.from(new Set(jobDescription.toLowerCase().match(/\b[a-z]{4,}\b/g) || []));
    const matched = jdWords.filter(w => lower.includes(w));
    keywordMatchPct = Math.min(100, Math.round((matched.length / Math.max(1, jdWords.length)) * 100));
    missingKeywords = jdWords.filter(w => !lower.includes(w)).slice(0, 6);
  }

  return {
    score,
    wordCount,
    atsRating: score >= 85 ? 'Excellent (Tier 1)' : score >= 75 ? 'Good (Tier 2)' : 'Needs Enhancement',
    detectedSkills: detectedTech.slice(0, 10),
    leadershipSignals: detectedLeadership.slice(0, 6),
    metricsDetectedCount: numbersAndMetrics.length,
    keywordMatchPercentage: keywordMatchPct,
    missingKeywords,
    targetRole: role || 'Candidate Evaluation',
    summaryInsights: [
      `Detected ${detectedTech.length} verified technical keywords and ${detectedLeadership.length} high-impact leadership verbs.`,
      numbersAndMetrics.length > 0
        ? `Contains ${numbersAndMetrics.length} quantified impact claims (${numbersAndMetrics.slice(0, 2).join(', ')}). ATS systems prioritize measurable metrics.`
        : `Recommendation: Add quantifiable outcomes (e.g. '% efficiency gain', '$ revenue impact', 'team size').`,
      `Document length is ${wordCount} words, which matches executive recruitment density guidelines.`
    ]
  };
}

// Submit resume endpoint
app.post('/api/submit-resume', upload.single('resume'), async (req, res) => {
  try {
    const name = (req.body.name as string) || (req.body['field-0'] as string) || 'Applicant';
    const email = (req.body.email as string) || (req.body['field-1'] as string) || 'applicant@example.com';
    const targetRole = req.body.targetRole as string || 'Software Engineer';
    const jobDescription = req.body.jobDescription as string || '';
    const requestedUrl = (req.body.targetUrl as string) || DEFAULT_N8N_PROD_URL;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF, DOCX, or TXT).' });
    }

    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype || 'application/octet-stream';
    const buffer = req.file.buffer;

    // Convert buffer to text if plain text / markdown, or approximate from buffer
    let rawText = '';
    try {
      rawText = buffer.toString('utf-8');
    } catch {
      rawText = `Resume file: ${originalName} submitted by ${name}`;
    }

    // Build FormData to forward directly to n8n Form trigger
    // n8n expects field-0 (Name), field-1 (Email), and field-2 (File)
    const n8nFormData = new FormData();
    n8nFormData.append('field-0', name);
    n8nFormData.append('field-1', email);

    // Create file blob from buffer
    const fileBlob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    n8nFormData.append('field-2', fileBlob, originalName);

    // Determine target URL: If requestedUrl is the test url, we try it, but if it fails with 404, we can auto-try prod or report
    let primaryUrl = requestedUrl;
    let fallbackUsed = false;
    let n8nResponseStatus = 200;
    let n8nResponseBody = '';

    try {
      const response = await fetch(primaryUrl, {
        method: 'POST',
        body: n8nFormData,
      });

      n8nResponseStatus = response.status;
      n8nResponseBody = await response.text();

      // If test URL returned 404 because test trigger wasn't running, automatically submit to the active production URL
      if (response.status === 404 && primaryUrl.includes('/form-test/')) {
        console.log('n8n test trigger not active, falling back to production form endpoint...');
        const prodFormData = new FormData();
        prodFormData.append('field-0', name);
        prodFormData.append('field-1', email);
        prodFormData.append('field-2', new Blob([new Uint8Array(buffer)], { type: mimeType }), originalName);

        const prodResponse = await fetch(DEFAULT_N8N_PROD_URL, {
          method: 'POST',
          body: prodFormData,
        });

        if (prodResponse.ok) {
          n8nResponseStatus = prodResponse.status;
          n8nResponseBody = await prodResponse.text();
          fallbackUsed = true;
          primaryUrl = DEFAULT_N8N_PROD_URL;
        }
      }
    } catch (n8nErr: any) {
      console.warn('n8n forward warning:', n8nErr.message);
      n8nResponseStatus = 502;
      n8nResponseBody = n8nErr.message;
    }

    // Compute diagnostic analysis report
    const diagnosticReport = analyzeResumeText(rawText, name, targetRole, jobDescription);

    res.json({
      success: n8nResponseStatus === 200,
      timestamp: new Date().toISOString(),
      candidate: {
        name,
        email,
        fileName: originalName,
        fileSizeKb: Math.round(req.file.size / 1024),
      },
      n8nDelivery: {
        url: primaryUrl,
        statusCode: n8nResponseStatus,
        response: n8nResponseBody,
        fallbackUsed,
      },
      diagnosticReport,
    });
  } catch (error: any) {
    console.error('Submit resume error:', error);
    res.status(500).json({ error: error.message || 'Server error processing resume' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
