import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Target,
  Brain,
  Github,
  Briefcase,
  FileText,
  Zap,
  ShieldCheck,
  Search,
  ChevronRight,
  CheckCircle2,
  Wand2,
  History,
  BarChart3,
  Star,
  Quote,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <Hero />
      <LogosStrip />
      <Features />
      <ScorePreview />
      <HowItWorks />
      <DeepFeatures />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}

/* ----------------------------- HERO ----------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* floating blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-pink/40 blur-3xl animate-pulse-glow" />
        <div
          className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-sky/50 blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute left-1/3 top-96 h-64 w-64 rounded-full bg-brand-lilac/40 blur-3xl animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 md:pt-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            NLP-powered · 379 skill patterns · GitHub signal
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Land interviews with a resume{" "}
            <span className="text-gradient animate-gradient">built to beat the ATS.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Resume Analyzer AI scans your resume against any job description and target role, then hands
            back a detailed scorecard — skills matched, gaps to close, weak sections, and
            hand-picked job matches. All in one delightful workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.04]"
            >
              Analyze my resume free
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold shadow-card hover:bg-secondary"
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Instant scorecard
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> History saved
            </div>
          </div>
        </motion.div>

        {/* Hero visual — floating scorecard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <HeroScorecard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroScorecard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-mesh opacity-40 blur-2xl" />

      <div className="glass-strong rounded-[2rem] p-4 shadow-glow md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Score ring */}
          <div className="glass rounded-3xl p-6 shadow-card">
            <div className="text-xs font-medium text-muted-foreground">ATS Match Score</div>
            <div className="mt-3 flex items-center gap-4">
              <ScoreRing value={87} />
              <div>
                <div className="text-3xl font-bold text-gradient">
                  87<span className="text-lg">/100</span>
                </div>
                <div className="text-xs text-muted-foreground">Strong fit for role</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: "Semantic similarity", val: 91 },
                { label: "Keyword coverage", val: 82 },
                { label: "Section quality", val: 88 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{row.label}</span>
                    <span>{row.val}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${row.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills matched */}
          <div className="glass rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">Hard Skills</div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                12 matched
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Python", "SQL", "Pandas", "NumPy", "Tableau", "AWS", "Airflow", "dbt"].map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
              {["Snowflake", "Spark"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-dashed border-destructive/40 bg-destructive/5 px-2.5 py-1 text-xs font-medium text-destructive"
                >
                  {s} · missing
                </span>
              ))}
            </div>
            <div className="mt-5 text-xs font-medium text-muted-foreground">Soft Skills</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Collaboration", "Ownership", "Communication"].map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-accent/60 px-2.5 py-1 text-xs font-medium text-accent-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* GitHub + suggestions */}
          <div className="glass rounded-3xl p-6 shadow-card">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Github className="h-3.5 w-3.5" /> GitHub signal
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
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
            <div className="mt-5 rounded-2xl border border-border/60 bg-card p-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Wand2 className="h-3.5 w-3.5 text-primary" /> Suggestion
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add Snowflake to your Skills and quantify the dashboard project in Experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.17 258)" />
            <stop offset="50%" stopColor="oklch(0.78 0.11 300)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 350)" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} stroke="oklch(0.94 0.02 320)" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="url(#ring)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-bold">{value}</div>
    </div>
  );
}

/* ------------------------- LOGOS STRIP ------------------------- */
function LogosStrip() {
  const items = ["Google", "Stripe", "Shopify", "Airbnb", "Notion", "Figma", "Linear", "Vercel"];
  return (
    <div className="mx-auto max-w-6xl px-4 pb-4">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Optimized for candidates applying to
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-14 opacity-70">
          {[...items, ...items].map((n, i) => (
            <span
              key={i}
              className="font-display text-xl font-semibold tracking-tight text-muted-foreground/70"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- FEATURES ------------------------- */
const features = [
  {
    icon: Target,
    title: "Blended ATS Score",
    desc: "Semantic similarity, keyword match, section quality and title alignment — all fused into a single, explainable score.",
    color: "from-brand-blue to-brand-lilac",
  },
  {
    icon: Brain,
    title: "NLP Skill Extraction",
    desc: "Custom spaCy Entity Ruler with 379 patterns + trained NER. Hard skills, soft skills, titles, education and certs — locally.",
    color: "from-brand-lilac to-brand-pink",
  },
  {
    icon: Wand2,
    title: "Keyword Expansion",
    desc: "Mention data analyst? We infer NumPy, matplotlib and friends so hidden strengths still count.",
    color: "from-brand-pink to-brand-peach",
  },
  {
    icon: FileText,
    title: "Weak Section Detection",
    desc: "Summary, experience, education and more — flagged with concrete rewrites you can apply in a click.",
    color: "from-brand-sky to-brand-blue",
  },
  {
    icon: Github,
    title: "GitHub Analysis",
    desc: "We read commits, PRs, and recent activity from your linked GitHub — bonus signal your resume can't show.",
    color: "from-brand-mint to-brand-sky",
  },
  {
    icon: Briefcase,
    title: "Live Job Suggestions",
    desc: "Every scorecard ends with real open roles from Adzuna — matched to your skills and target title.",
    color: "from-brand-peach to-brand-pink",
  },
  {
    icon: History,
    title: "Score History",
    desc: "Every analysis auto-saves to your account. Compare versions and watch your score climb over time.",
    color: "from-brand-blue to-brand-mint",
  },
  {
    icon: ShieldCheck,
    title: "Word Count Check",
    desc: "Too short, too long, or in the 400–800 sweet spot — instantly.",
    color: "from-brand-lilac to-brand-sky",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Everything you need"
          title={
            <>
              Analysis that goes <span className="text-gradient">deeper</span> than a keyword count.
            </>
          }
          subtitle="Eight tightly-woven modules combine into one clear, actionable scorecard."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-card transition-all hover:shadow-glow hover:-translate-y-1"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
              />
              <div
                className={`inline-grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-glow`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------- SCORE PREVIEW ------------------- */
function ScorePreview() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <BarChart3 className="h-3.5 w-3.5" /> The Scorecard
            </span>
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              A score that explains <span className="text-gradient">why</span>, not just what.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every number is decomposable. Hover any bar to see the sentences, keywords, and
              sections behind it. No black boxes — just clarity.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Semantic similarity across your bullets and the JD",
                "Weighted keyword coverage with synonym expansion",
                "Section-by-section quality scoring",
                "Target title vs your latest role alignment",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03]"
              >
                Try it with your resume <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-mesh opacity-40 blur-2xl" />
            <div className="glass-strong rounded-3xl p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Target role</div>
                  <div className="text-lg font-semibold">Senior Data Analyst · Fintech</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Overall</div>
                  <div className="text-3xl font-bold text-gradient">87</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { l: "Semantic", v: 91 },
                  { l: "Keywords", v: 82 },
                  { l: "Sections", v: 88 },
                  { l: "Title fit", v: 84 },
                ].map((m) => (
                  <div key={m.l} className="rounded-2xl bg-secondary/60 p-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{m.l}</span>
                      <span className="font-semibold">{m.v}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-background">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${m.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border/60 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Weak section</div>
                <div className="mt-1 text-sm">
                  <span className="font-semibold">Summary</span> — feels generic. Try leading with a
                  concrete metric from your last role (e.g. "cut reporting time 40%…").
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- HOW IT WORKS --------------------- */
function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Upload resume",
      desc: "PDF or DOCX. We parse structure, headings, and content locally.",
    },
    {
      icon: Search,
      title: "Paste job description",
      desc: "Add the JD and your target role. The more specific, the better.",
    },
    {
      icon: Zap,
      title: "Get your scorecard",
      desc: "Blended score, skill gaps, weak sections and rewrite suggestions — in seconds.",
    },
    {
      icon: Briefcase,
      title: "Apply with matched jobs",
      desc: "Curated open roles from Adzuna with salary, location and apply links.",
    },
  ];
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="How it works"
          title={
            <>
              Four calm steps between you and a <span className="text-gradient">stronger</span>{" "}
              resume.
            </>
          }
          subtitle="No dashboards to configure. No integrations to set up. Just answers."
        />

        <div className="relative mt-14 grid gap-5 md:grid-cols-4">
          <div className="pointer-events-none absolute left-6 right-6 top-11 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-3xl border border-border/60 bg-card p-6 shadow-card"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-medium text-muted-foreground">Step {i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- DEEP FEATURES -------------------- */
function DeepFeatures() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl space-y-16 px-4">
        <FeatureRow
          eyebrow="NLP pipeline"
          title={
            <>
              A local ML pipeline that <span className="text-gradient">actually understands</span>{" "}
              resumes.
            </>
          }
          desc="We replaced the Groq-only extraction with a spaCy Entity Ruler layering 379 patterns across hard skills, soft skills, job titles, education and certifications — reinforced by a custom-trained NER model. Faster, cheaper, more accurate."
          bullets={[
            "379 handcrafted skill & role patterns",
            "Custom-trained NER on real resumes",
            "Deterministic — no hallucinated skills",
            "Fully local extraction pipeline",
          ]}
          visual={<PipelineVisual />}
        />
        <FeatureRow
          reverse
          eyebrow="Job matching"
          title={
            <>
              Real jobs, right after your score.{" "}
              <span className="text-gradient">Zero context switch.</span>
            </>
          }
          desc="Every analysis ends with matched open roles from the Adzuna Jobs API — filtered to your skills and target title, with salary, location and one-click apply."
          bullets={[
            "Skill-weighted match ranking",
            "Salary + location + freshness",
            "Direct apply links",
            "Save roles to your history",
          ]}
          visual={<JobsVisual />}
        />
      </div>
    </section>
  );
}

function FeatureRow({
  eyebrow,
  title,
  desc,
  bullets,
  visual,
  reverse,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </span>
        <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{desc}</p>
        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function PipelineVisual() {
  const chips = [
    { l: "Hard skills", v: 142, c: "bg-brand-blue/20 text-brand-blue" },
    { l: "Soft skills", v: 58, c: "bg-brand-pink/25 text-foreground" },
    { l: "Job titles", v: 96, c: "bg-brand-lilac/25 text-foreground" },
    { l: "Education", v: 42, c: "bg-brand-mint/30 text-foreground" },
    { l: "Certs", v: 41, c: "bg-brand-peach/40 text-foreground" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-mesh opacity-40 blur-2xl" />
      <div className="glass-strong rounded-3xl p-6 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">spaCy Entity Ruler</div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            379 patterns
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {chips.map((c) => (
            <div key={c.l} className="flex items-center gap-3">
              <div className="w-24 text-xs text-muted-foreground">{c.l}</div>
              <div className="h-2 flex-1 rounded-full bg-secondary">
                <div
                  className={`h-2 rounded-full ${c.c.replace("text-", "").split(" ")[0]}`}
                  style={{ width: `${(c.v / 150) * 100}%`, background: "var(--gradient-brand)" }}
                />
              </div>
              <div className="w-8 text-right text-xs font-semibold">{c.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 text-xs">
          <span className="font-semibold text-primary">+ NER model</span> layered on top for
          context-aware entity recognition beyond the pattern list.
        </div>
      </div>
    </div>
  );
}

function JobsVisual() {
  const jobs = [
    { t: "Senior Data Analyst", c: "Ramp · New York", s: "$140k – $180k", m: 94 },
    { t: "Analytics Engineer", c: "Notion · Remote", s: "$150k – $190k", m: 89 },
    { t: "BI Developer", c: "Stripe · Dublin", s: "€90k – €120k", m: 82 },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-mesh opacity-40 blur-2xl" />
      <div className="glass-strong rounded-3xl p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">Matched roles for you</div>
          <span className="text-xs text-muted-foreground">via Adzuna</span>
        </div>
        <div className="space-y-3">
          {jobs.map((j) => (
            <div
              key={j.t}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-3"
            >
              <div>
                <div className="text-sm font-semibold">{j.t}</div>
                <div className="text-xs text-muted-foreground">
                  {j.c} · {j.s}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {j.m}% match
                </span>
                <button className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- TESTIMONIALS -------------------- */
function Testimonials() {
  const t = [
    {
      n: "Ananya P.",
      r: "Data Analyst · Acquired offer at Ramp",
      q: "I jumped from 62 to 91 in two rewrites. The section-level feedback is what did it — no other tool gets that specific.",
    },
    {
      n: "Marcus D.",
      r: "Backend Engineer · Hired at Vercel",
      q: "The GitHub signal was the unlock. It surfaced work my resume didn't and my recruiter actually mentioned it.",
    },
    {
      n: "Priya S.",
      r: "PM · Interview at Notion",
      q: "Loved that every score is explainable. It doesn't just tell me I'm at 74 — it shows me the exact bullets pulling it down.",
    },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Loved by candidates"
          title={
            <>
              Resumes rewritten. Interviews <span className="text-gradient">landed.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.map((x, i) => (
            <motion.div
              key={x.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-3xl border border-border/60 bg-card p-6 shadow-card"
            >
              <Quote className="h-6 w-6 text-primary/50" />
              <p className="mt-3 text-sm leading-relaxed">{x.q}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-semibold text-primary-foreground">
                  {x.n
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{x.n}</div>
                  <div className="text-xs text-muted-foreground">{x.r}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- FAQ ---------------------- */
function FAQ() {
  const items = [
    {
      q: "Is my resume kept private?",
      a: "Yes. Your resume is analyzed for your account only and never shared. Extraction runs through our local NLP pipeline — not shipped to a third-party LLM.",
    },
    {
      q: "What formats are supported?",
      a: "PDF and DOCX today. We preserve section structure, headings, and bullet formatting during parsing.",
    },
    {
      q: "How is the ATS score calculated?",
      a: "A blended score across semantic similarity to the JD, keyword coverage (with synonym expansion), section quality, and target-title alignment.",
    },
    {
      q: "Does it really check my GitHub?",
      a: "If your resume includes a GitHub link, we fetch public commits, PRs, and recent activity to add signal to your score.",
    },
    {
      q: "Do I need an account?",
      a: "You can try a single analysis anonymously. Create an account to save score history and revisit past scorecards from My History.",
    },
  ];
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeader
          eyebrow="Questions"
          title={
            <>
              Everything you might be <span className="text-gradient">wondering.</span>
            </>
          }
        />
        <div className="mt-10 space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card open:shadow-glow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {it.q}
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- FINAL CTA -------------------- */
function FinalCTA() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand p-10 text-center shadow-glow md:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-primary-foreground md:text-5xl">
              Your next role is worth <br className="hidden md:block" /> a better resume.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
              Get your first ATS scorecard in under a minute. Free forever for individuals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/analyze"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-soft hover:scale-[1.03] transition-transform"
              >
                Start free analysis
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-white/20"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- shared bits ----------------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
