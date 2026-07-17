import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Github,
  Briefcase,
  MapPin,
  Wand2,
  RefreshCw,
  Download,
  LogOut,
  Calendar,
  Clock,
  ArrowLeft,
  Activity,
  FileCheck,
  Rocket
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserStatsFn, saveAnalysisFn } from "@/lib/server-fns";

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

function DashboardPage() {
  const router = useRouter();
  const stats = Route.useLoaderData();
  const { data: sessionData, isPending } = authClient.useSession();
  const [phase, setPhase] = useState<Phase>("form");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.navigate({ to: "/login" });
    }
  }, [isPending, sessionData, router]);

  const [scorecard, setScorecard] = useState<any>(null);

  const runAnalysis = async () => {
    if (!file || !jd || !role) return;
    setPhase("loading");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jd", jd);
      formData.append("role", role);
      if (github) formData.append("github", github);
      
      const response = await fetch("http://localhost:8000/api/v1/analyze/", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const data = await response.json();
      
      // Save analysis to the database
      await saveAnalysisFn({
        data: {
          role: role,
          matchPercentage: data.data.match_percentage,
          scorecard: data.data,
        }
      });

      // Refetch the dashboard stats
      await router.invalidate();

      setScorecard(data.data);
      setPhase("result");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Make sure the FastAPI backend is running on port 8000.");
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
            <div className="glass-strong rounded-3xl shadow-glow sticky top-24 overflow-hidden border border-border/50">
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

                <button 
                  onClick={handleLogout}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive py-3 font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
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
                  <ResultView role={role} scorecard={scorecard} onReset={() => {
                    setPhase("form");
                    setScorecard(null);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
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
    <div className="glass-strong rounded-[2rem] p-6 shadow-glow md:p-10">
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
      className="mx-auto max-w-xl glass-strong rounded-3xl p-10 text-center shadow-glow"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Analyzing your resume…</h3>
      <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
      <ul className="mt-6 space-y-2 text-left text-sm">
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

function ResultView({ role, scorecard, onReset }: { role: string; scorecard: any; onReset: () => void }) {
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 shadow-glow">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Scorecard · {role}</div>
          <div className="mt-1 text-2xl font-bold">
            Your resume is a <span className="text-gradient">strong fit</span>.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-analyze
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-3xl p-6 shadow-card lg:col-span-1">
          <div className="text-xs font-medium text-muted-foreground">Overall ATS score</div>
          <div className="mt-3 flex items-center gap-6">
            <BigRing value={scorecard.match_percentage} />
            <div>
              <div className="text-4xl font-bold text-gradient">
                {scorecard.match_percentage}<span className="text-xl">/100</span>
              </div>
              <div className="text-xs text-muted-foreground max-w-[200px]">{scorecard.overall_feedback}</div>
            </div>
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
        <div className="glass-strong rounded-3xl p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Skill analysis</div>
            <span className="text-xs text-muted-foreground">Expanded via NLP synonyms</span>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <SkillBlock
              title="Matched skills"
              matched={scorecard.matched_skills || []}
              missing={[]}
            />
            <SkillBlock
              title="Missing skills"
              matched={[]}
              missing={scorecard.missing_skills || []}
              tone="accent"
            />
          </div>
        </div>
      </div>

      {/* sections + github */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-3xl p-6 shadow-card lg:col-span-2">
          <div className="text-sm font-semibold">Section feedback</div>
          <div className="mt-4 space-y-3">
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
        </div>

        <div className="glass-strong rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Github className="h-4 w-4" /> GitHub signal
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "142", v: "commits" },
              { k: "18", v: "PRs" },
              { k: "9", v: "repos" },
            ].map((m) => (
              <div key={m.v} className="rounded-2xl bg-secondary/70 p-3">
                <div className="text-lg font-bold">{m.k}</div>
                <div className="text-[10px] text-muted-foreground">{m.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-border/60 p-3">
            <div className="text-xs font-semibold">Recent activity</div>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>
                • Merged PR in{" "}
                <span className="font-medium text-foreground">analytics-toolkit</span> · 3d ago
              </li>
              <li>
                • 12 commits to <span className="font-medium text-foreground">dbt-playground</span>{" "}
                · this week
              </li>
              <li>
                • Opened issue in <span className="font-medium text-foreground">airflow-dags</span>{" "}
                · 5d ago
              </li>
            </ul>
          </div>
          <div className="mt-4 rounded-2xl bg-primary/5 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Wand2 className="h-3.5 w-3.5" /> Bonus
            </div>
            <p className="mt-1 text-muted-foreground">
              Your GitHub adds <span className="font-semibold text-foreground">+4 points</span> to
              your overall score.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass-strong rounded-3xl p-6 shadow-card">
        <div className="text-sm font-semibold">Actionable suggestions</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
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

      {/* Job matches */}
      <div className="glass-strong rounded-3xl p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="h-4 w-4" /> Jobs matched to you
          </div>
          <span className="text-xs text-muted-foreground">Powered by Adzuna</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            {
              t: "Senior Data Analyst",
              c: "Ramp",
              loc: "New York, US (Hybrid)",
              s: "$140k – $180k",
              m: 94,
            },
            { t: "Analytics Engineer", c: "Notion", loc: "Remote", s: "$150k – $190k", m: 89 },
            { t: "BI Developer", c: "Stripe", loc: "Dublin, IE", s: "€90k – €120k", m: 82 },
            {
              t: "Data Analyst II",
              c: "Airbnb",
              loc: "San Francisco, US",
              s: "$130k – $160k",
              m: 80,
            },
          ].map((j) => (
            <div
              key={j.t}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4"
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
                <button className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm">
        <Link to="/history" className="text-primary hover:underline">
          View all past scorecards →
        </Link>
      </div>
    </div>
  );
}

function SkillBlock({
  title,
  matched,
  missing,
  tone = "primary",
}: {
  title: string;
  matched: string[];
  missing: string[];
  tone?: "primary" | "accent";
}) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {matched.map((s) => (
          <span
            key={s}
            className={
              tone === "accent"
                ? "rounded-full bg-accent/60 px-2.5 py-1 text-xs font-medium text-accent-foreground"
                : "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            }
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs font-medium text-muted-foreground">Missing from resume</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {missing.map((s) => (
          <span
            key={s}
            className="rounded-full border border-dashed border-destructive/40 bg-destructive/5 px-2.5 py-1 text-xs font-medium text-destructive"
          >
            {s}
          </span>
        ))}
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
