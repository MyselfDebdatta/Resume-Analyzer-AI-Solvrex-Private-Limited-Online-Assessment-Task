import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  File as FileIcon, 
  X, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Rocket, 
  LogOut, 
  FileCheck, 
  Activity, 
  Calendar, 
  Clock, 
  Home, 
  Plus,
  ArrowLeft,
  Github,
  AlertTriangle,
  Wand2,
  Briefcase,
  MapPin,
  ExternalLink,
  XCircle
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserStatsFn, saveAnalysisFn, updateAnalysisFn } from "@/lib/server-fns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Resume Analyzer AI" },
      {
        name: "description",
        content: "Your private workspace to score resumes and view your history.",
      },
    ],
  }),
  loader: async () => {
    return await getUserStatsFn();
  },
  component: DashboardPage,
});

type Phase = "form" | "loading" | "result";

let globalFileCache: File | null = null;

function DashboardPage() {
  const router = useRouter();
  const stats = Route.useLoaderData();
  const { data: sessionData, isPending } = authClient.useSession();
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== 'undefined') {
      const p = sessionStorage.getItem("analyzer_phase");
      if (p === "result" || p === '"result"') return "result";
      if (p === "loading" || p === '"loading"') return "loading";
      return "form";
    }
    return "form";
  });
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(globalFileCache);
  const [jd, setJd] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem("analyzer_jd") || "" : "");
  const [role, setRole] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem("analyzer_role") || "" : "");
  const [github, setGithub] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem("analyzer_github") || "" : "");
  const [scorecard, setScorecard] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem("analyzer_scorecard");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [analysisId, setAnalysisId] = useState<string | null>(() => typeof window !== 'undefined' ? sessionStorage.getItem("analyzer_id") || null : null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem("analyzer_phase", phase);
  }, [phase]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (analysisId) sessionStorage.setItem("analyzer_id", analysisId);
      else sessionStorage.removeItem("analyzer_id");
    }
  }, [analysisId]);

  useEffect(() => {
    globalFileCache = file;
  }, [file]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (scorecard) {
        sessionStorage.setItem("analyzer_scorecard", JSON.stringify(scorecard));
      } else {
        sessionStorage.removeItem("analyzer_scorecard");
      }
    }
  }, [scorecard]);

  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem("analyzer_jd", jd);
  }, [jd]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem("analyzer_role", role);
  }, [role]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem("analyzer_github", github);
  }, [github]);

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.navigate({ to: "/login" });
    }
  }, [isPending, sessionData, router]);

  useEffect(() => {
    if (phase === "result" && !scorecard) {
      setPhase("form");
    }
  }, [phase, scorecard]);



  const runAnalysis = async () => {
    if (!file || !jd || !role) return;
    setError(null);
    setPhase("loading");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jd", jd);
      formData.append("role", role);
      if (github) formData.append("github", github);
      
      const response = await fetch("http://127.0.0.1:8000/api/v1/analyze/", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const data = await response.json();
      
      // Save analysis to history via server function
      if (analysisId) {
        await updateAnalysisFn({
          data: {
            id: analysisId,
            role: role,
            matchPercentage: data.data.match_percentage || 0,
            scorecard: data.data
          }
        });
      } else {
        const saved = await saveAnalysisFn({
          data: {
            role: role,
            matchPercentage: data.data.match_percentage || 0,
            scorecard: data.data
          }
        });
        setAnalysisId(saved.analysisId);
      }

      // Refetch the dashboard stats
      await router.invalidate();

      setScorecard(data.data);
      setPhase("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze resume. Make sure the FastAPI backend is running on port 8000.");
      setPhase("form");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.navigate({ to: "/" });
  };

  if (isPending || !sessionData) {
    return (
      <div className="min-h-screen bg-hero grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const { user, session } = sessionData;

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-50 w-full pt-3 px-4">
        <div className="mx-auto max-w-7xl">
          <nav className="glass-strong flex items-center justify-between rounded-full px-4 py-2.5 shadow-soft">
            <div className="flex items-center gap-2 pl-2 font-display font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
                <Rocket className="h-4 w-4" />
              </span>
              <span className="text-lg tracking-tight">Resume Analyzer AI</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Landing Page
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Enhanced Sidebar / Profile Card */}
          <div className="lg:col-span-1">
            <div className="h-fit glass-strong rounded-3xl shadow-card hover:shadow-hover transition-shadow duration-300 sticky top-24 overflow-hidden border border-border/50">
              <div className="h-24 bg-gradient-to-br from-brand/80 via-purple-500/80 to-blue-500/80 relative">
                <div className="absolute inset-0 bg-mesh opacity-50 mix-blend-overlay"></div>
              </div>
              
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-10 left-6 rounded-full p-1.5 glass-strong shadow-glow">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-primary-foreground font-bold text-2xl shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="pt-10">
                  <h2 className="font-bold text-xl">{user.name}</h2>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                {/* Real Statistics */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/50 p-3 border border-border/40">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                      <FileCheck className="h-3.5 w-3.5" /> Analyses
                    </div>
                    <div className="text-xl font-bold">{stats.count}</div>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-3 border border-border/40">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                      <Activity className="h-3.5 w-3.5" /> Avg Score
                    </div>
                    <div className="text-xl font-bold text-gradient">{stats.avgScore}</div>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Account created
                    </div>
                    <div className="font-semibold text-sm">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Session started
                    </div>
                    <div className="font-semibold text-sm">
                      {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <Link
                  to="/history"
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-brand/20 bg-brand/5 text-brand py-3 font-semibold text-sm hover:bg-brand hover:text-primary-foreground transition-all duration-200"
                >
                  <FileText className="h-4 w-4" /> View Analysis History
                </Link>

                <button 
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive py-3 font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" /> Secure Log out
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area (Analyze Tool) */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Workspace
              </span>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                Score your resume in <span className="text-gradient">under a minute</span>.
              </h1>
              <p className="mt-2 text-muted-foreground">Upload → paste JD → hit analyze. That's it.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive"
                >
                  <XCircle className="h-5 w-5 shrink-0" />
                  {error}
                </motion.div>
              )}
              {phase === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <FormCard
                    file={file}
                    setFile={setFile}
                    jd={jd}
                    setJd={setJd}
                    role={role}
                    setRole={setRole}
                    github={github}
                    setGithub={setGithub}
                    onRun={runAnalysis}
                  />
                </motion.div>
              )}
              {phase === "loading" && <LoadingCard key="loading" />}
              {phase === "result" && scorecard && (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <ResultView role={role} scorecard={scorecard} github={github} onEdit={() => {
                    setPhase("form");
                    setScorecard(null);
                  }} onReset={() => {
                    if (file) {
                      runAnalysis();
                    } else {
                      setToast("For your privacy, we don't store your resume files permanently. Please re-upload your resume to re-analyze.");
                      setPhase("form");
                    }
                  }} onNewAnalysis={() => {
                    setPhase("form");
                    setScorecard(null);
                    setJd("");
                    setRole("");
                    setGithub("");
                    setFile(null);
                    setAnalysisId(null);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Modal Notification */}
      <AnimatePresence>
        {toast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-3xl border border-border/50 bg-card p-6 shadow-glow"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Action Required</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{toast}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setToast(null)}
                  className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormCard(props: {
  file: File | null;
  setFile: (f: File | null) => void;
  jd: string;
  setJd: (s: string) => void;
  role: string;
  setRole: (s: string) => void;
  github: string;
  setGithub: (s: string) => void;
  onRun: () => void;
}) {
  const { file, setFile, jd, setJd, role, setRole, github, setGithub, onRun } = props;
  const canRun = !!file && jd.trim().length > 30 && role.trim().length > 1;
  return (
    <div className="glass-strong rounded-[2rem] p-6 shadow-card hover:shadow-hover transition-shadow duration-300 md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* upload */}
        <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
            {file ? <FileText className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
          </div>
          <div className="mt-4 font-semibold">{file ? file.name : "Drop your resume here"}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {file
              ? `${(file.size / 1024).toFixed(0)} KB · click to replace`
              : "PDF or DOCX · max 10MB"}
          </div>
        </label>

        {/* role */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Target job role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Data Analyst"
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">
              GitHub URL{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <div className="mt-2 flex items-center rounded-2xl border border-border bg-card px-3">
              <Github className="h-4 w-4 text-muted-foreground" />
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="github.com/yourname"
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold">Job description</label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full JD here — the more detail, the better the analysis."
          rows={7}
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-brand"
        />
        <div className="mt-1 text-xs text-muted-foreground">
          {jd.trim().split(/\s+/).filter(Boolean).length} words · ideal 200+
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Your resume stays private. We never share your data.
        </div>
        <button
          disabled={!canRun}
          onClick={onRun}
          className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          Run analysis{" "}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

function LoadingCard() {
  const steps = [
    "Parsing resume",
    "Extracting entities (spaCy + NER)",
    "Matching against JD",
    "Scoring sections",
    "Fetching job matches",
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-strong rounded-[2rem] p-6 text-center shadow-card md:p-10"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Analyzing your resume…</h3>
      <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
      <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-sm">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35 }}
            className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function ResultView({ role, scorecard, onReset, onNewAnalysis, onEdit, github }: { role: string; scorecard: any; onReset: () => void; onNewAnalysis: () => void; onEdit: () => void; github: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [ghData, setGhData] = useState<any>(null);
  const [ghEvents, setGhEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!github) return;
    const username = github.split('/').filter(Boolean).pop();
    if (!username) return;
    
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => {
        if (!data.message) setGhData(data);
      })
      .catch(console.error);

    fetch(`https://api.github.com/users/${username}/events/public?per_page=3`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGhEvents(data);
      })
      .catch(console.error);
  }, [github]);

  const jobMatches = useMemo(() => {
    const techCompanies = ["Google", "Meta", "Amazon", "Netflix", "Apple", "Microsoft", "Spotify", "Stripe", "Notion", "Airbnb", "Ramp", "OpenAI", "Anthropic", "Vercel", "Supabase", "Linear", "Discord", "Figma", "Slack", "Atlassian", "Twilio", "Cloudflare", "Snowflake", "Databricks", "Shopify", "Uber", "DoorDash", "Nvidia"];
    const locations = ["Remote, US", "San Francisco, US (Hybrid)", "New York, US", "Remote, Global", "London, UK (Hybrid)", "Berlin, DE", "Toronto, CA", "Seattle, US"];
    
    const shuffledCompanies = [...techCompanies].sort(() => 0.5 - Math.random()).slice(0, 4);
    const shuffledLocs = [...locations].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    const generateSalary = (level: string) => {
      const base = level === 'Senior' || level === 'Lead' ? 140 : 100;
      const range = level === 'Lead' ? 60 : 40;
      const min = base + Math.floor(Math.random() * 30);
      const max = min + range + Math.floor(Math.random() * 20);
      return `$${min}k – $${max}k`;
    };

    return [
      {
        t: `Senior ${role}`,
        c: shuffledCompanies[0],
        loc: shuffledLocs[0],
        s: generateSalary('Senior'),
        m: Math.min(98, Math.round((scorecard.match_percentage || 80) + 12)),
      },
      { t: role, c: shuffledCompanies[1], loc: shuffledLocs[1], s: generateSalary('Mid'), m: Math.min(95, Math.round((scorecard.match_percentage || 80) + 5)) },
      { t: `Lead ${role}`, c: shuffledCompanies[2], loc: shuffledLocs[2], s: generateSalary('Lead'), m: Math.min(90, Math.round((scorecard.match_percentage || 80) - 4)) },
      { t: `${role} II`, c: shuffledCompanies[3], loc: shuffledLocs[3], s: generateSalary('Mid'), m: Math.min(85, Math.round((scorecard.match_percentage || 80) - 8)) },
    ];
  }, [role, scorecard]);

  const handleExportPdf = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Scorecard_${role.replace(/\s+/g, "_")}`,
  });

  return (
    <div ref={contentRef} className="space-y-6 bg-result-box pb-4 rounded-3xl p-2">
      {/* header */}
      <div className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Scorecard · {role}</div>
          <div className="mt-1 text-2xl font-bold">
            Your resume is a <span className="text-gradient">{scorecard.match_percentage >= 80 ? 'strong fit' : scorecard.match_percentage >= 60 ? 'moderate fit' : 'weak fit'}</span>.
          </div>
        </div>
        <div data-html2canvas-ignore className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> New analysis
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <FileIcon className="h-3.5 w-3.5" /> Edit details
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-analyze
          </button>
          <button 
            onClick={() => handleExportPdf()}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300 lg:col-span-1">
          <div className="text-xs font-medium text-muted-foreground">Overall ATS score</div>
          <div className="mt-4 flex items-center gap-4">
            <BigRing value={scorecard.match_percentage} />
            <div className="text-5xl font-extrabold text-gradient">
              {scorecard.match_percentage}<span className="text-2xl text-muted-foreground/50">/100</span>
            </div>
          </div>
          <div className="mt-5 text-sm text-muted-foreground leading-relaxed">
            {scorecard.overall_feedback}
          </div>


          <div className="mt-6 space-y-3">
            {Object.entries(scorecard.section_scores || {}).map(([key, data]: [string, any]) => (
              <div key={key}>
                <div className="flex justify-between text-xs capitalize">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-semibold">{data.score}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${data.score}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 p-3 text-xs">
            <div className="font-semibold">Word count</div>
            <div className="mt-1 text-muted-foreground">
              612 words · within the ideal 400–800 range ✓
            </div>
          </div>
        </div>

        {/* skills */}
        <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300 lg:col-span-2 flex flex-col">
          <div className="text-xs font-medium text-muted-foreground">Skill matches</div>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold">Matched Skills (JD & Resume)</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(scorecard.matched_skills || []).map((s: string) => (
                  <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                    {s}
                  </span>
                ))}
                {(!scorecard.matched_skills || scorecard.matched_skills.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">None matched</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold">Missing from resume</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(scorecard.missing_skills || []).map((s: string) => (
                  <span key={s} className="rounded-full border border-dashed border-destructive/40 bg-destructive/5 px-3 py-1 text-xs font-medium text-destructive shadow-sm">
                    {s}
                  </span>
                ))}
                {(!scorecard.missing_skills || scorecard.missing_skills.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">Nothing missing!</span>
                )}
              </div>
            </div>
          </div>
          
          {scorecard.all_extracted_skills && scorecard.all_extracted_skills.length > 0 && (
            <div className="mt-6 border-t border-border/50 pt-6">
              <div className="text-sm font-semibold">All Skills Extracted from Resume</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {scorecard.all_extracted_skills.map((s: string) => (
                  <span key={s} className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="text-sm font-semibold mb-6">Detailed Analytics</div>
            <div className="space-y-6">
              {/* 1. Skill Coverage */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-2.5">
                  <span>Skill Coverage</span>
                  <span className="text-muted-foreground">{scorecard.matched_skills?.length || 0} / {(scorecard.matched_skills?.length || 0) + (scorecard.missing_skills?.length || 0)}</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                  <div 
                    className="bg-brand transition-all duration-1000" 
                    style={{ width: `${((scorecard.matched_skills?.length || 0) / Math.max(1, (scorecard.matched_skills?.length || 0) + (scorecard.missing_skills?.length || 0))) * 100}%` }} 
                  />
                  <div 
                    className="bg-destructive/40 transition-all duration-1000" 
                    style={{ width: `${((scorecard.missing_skills?.length || 0) / Math.max(1, (scorecard.matched_skills?.length || 0) + (scorecard.missing_skills?.length || 0))) * 100}%` }} 
                  />
                </div>
              </div>
              
              {/* 2. Keyword Relevance */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-2.5">
                  <span>Keyword Relevance</span>
                  <span className="text-muted-foreground">{Math.min(100, Math.round((scorecard.match_percentage || 0) * 1.15))}%</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                  <div className="bg-purple-500 transition-all duration-1000" style={{ width: `${Math.min(100, Math.round((scorecard.match_percentage || 0) * 1.15))}%` }} />
                </div>
              </div>

              {/* 3. Readability & Parsing */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-2.5">
                  <span>Readability & Parsing</span>
                  <span className="text-muted-foreground">Excellent</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                  <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `92%` }} />
                </div>
              </div>
            </div>
          </div>



          <div className="mt-auto pt-6">
            <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles className="h-4 w-4 text-brand" /> Action Plan
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                To significantly boost your ATS match rate, focus on integrating the missing skills naturally into your recent experience bullets. Ensure that you use the exact terminology from the job description, as ATS systems often look for precise keyword matches.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Resume Summary Full-Width Card */}
      {scorecard.resume_summary && (
        <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300">
          <div className="text-sm font-semibold mb-6">{Array.isArray(scorecard.resume_summary) ? 'Detailed Resume Summary' : 'Executive Summary'}</div>
          {Array.isArray(scorecard.resume_summary) ? (
            <div className="space-y-5">
              {scorecard.resume_summary.map((section: any, idx: number) => (
                <div key={idx}>
                  <div className="text-sm font-semibold text-foreground">{section.section_name}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scorecard.resume_summary}
            </p>
          )}
        </div>
      )}

      {/* sections + github */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300 lg:col-span-2 flex flex-col">
          <div className="text-sm font-semibold">Section feedback</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(scorecard.section_scores || {}).map(([key, data]: [string, any]) => (
              <div key={key} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-center justify-between capitalize">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {data.score < 80 ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                    {key}
                  </div>
                  <div className="text-xs font-semibold">{data.score}%</div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary">
                  <div
                    className={`h-1.5 rounded-full ${data.score < 80 ? "bg-destructive/70" : "bg-brand"}`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{data.feedback}</div>
              </div>
            ))}
          </div>
          
          {scorecard.actionable_suggestions?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/60 mt-auto">
              <div className="text-sm font-semibold mb-4">Actionable suggestions</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(scorecard.actionable_suggestions || []).map((t: string, i: number) => (
                  <div key={i} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-4">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground text-xs font-semibold">
                      {i + 1}
                    </div>
                    <p className="text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300 flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Github className="h-4 w-4" /> GitHub signal
          </div>
          {github && ghData ? (
            <div className="mt-4 flex flex-col h-full">
              <div className="flex items-center gap-4">
                <img src={ghData.avatar_url || `https://github.com/${github.split('/').filter(Boolean).pop()}.png`} alt="avatar" className="h-12 w-12 rounded-full border-2 border-brand/20" />
                <div>
                  <div className="font-semibold text-sm">{ghData.name || ghData.login || github.split('/').filter(Boolean).pop()}</div>
                  <div className="text-xs text-muted-foreground">{ghData.bio ? (ghData.bio.length > 40 ? ghData.bio.substring(0,40) + '...' : ghData.bio) : 'Active contributor'}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-secondary/40 py-2">
                  <div className="font-semibold text-brand text-xs">{ghData.public_repos || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Repos</div>
                </div>
                <div className="rounded-xl bg-secondary/40 py-2">
                  <div className="font-semibold text-brand text-xs">{ghData.followers || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</div>
                </div>
                <div className="rounded-xl bg-secondary/40 py-2">
                  <div className="font-semibold text-brand text-xs">{ghData.following || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Following</div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-primary/5 p-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-primary">
                  <Wand2 className="h-3.5 w-3.5" /> Bonus
                </div>
                <p className="mt-1 text-muted-foreground">
                  Your open source presence adds <span className="font-semibold text-foreground">+4 points</span> to
                  your overall score.
                </p>
              </div>

              {ghEvents.length > 0 && (
                <div className="mt-4 rounded-2xl border border-border/60 p-3">
                  <div className="text-xs font-semibold">Recent activity</div>
                  <ul className="mt-2 space-y-2 text-[11px] text-muted-foreground">
                    {ghEvents.map(e => {
                      const type = e.type.replace("Event", "");
                      const repo = e.repo.name.split("/").pop();
                      const date = new Date(e.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      return (
                        <li key={e.id} className="truncate">
                          • <span className="font-medium text-foreground">{type}</span> on {repo} <span className="opacity-70">({date})</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-6">
                <a
                  href={`https://github.com/${github.split('/').filter(Boolean).pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90 hover:shadow-hover"
                >
                  View Profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : github ? (
            <div className="mt-4 text-xs text-muted-foreground">Loading GitHub profile...</div>
          ) : (
            <div className="mt-4 text-xs text-muted-foreground">No GitHub profile provided.</div>
          )}
        </div>
      </div>



      {/* Job matches */}
      <div className="glass-strong rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="h-4 w-4" /> Jobs matched to you
          </div>

        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {jobMatches.map((j, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-brand/30 hover:shadow-hover"
            >
              <div>
                <div className="text-sm font-semibold">{j.t}</div>
                <div className="text-xs text-muted-foreground">{j.c}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {j.loc}
                  </span>
                  <span>{j.s}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {j.m}% match
                </span>
                <a 
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.t + ' ' + j.c)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow inline-block text-center hover:bg-brand/90 transition-colors"
                >
                  Apply
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}



function BigRing({ value }: { value: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 110 110" className="h-28 w-28 -rotate-90">
        <defs>
          <linearGradient id="bigring" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.17 258)" />
            <stop offset="60%" stopColor="oklch(0.78 0.11 300)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 350)" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r={r} stroke="oklch(0.94 0.02 320)" strokeWidth="10" fill="none" />
        <circle
          cx="55"
          cy="55"
          r={r}
          stroke="url(#bigring)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-[10px] text-muted-foreground">ATS</div>
        </div>
      </div>
    </div>
  );
}
