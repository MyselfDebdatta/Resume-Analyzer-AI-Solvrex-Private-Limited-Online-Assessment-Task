import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Clock, Search, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My History — Resume Analyzer AI" },
      {
        name: "description",
        content: "Revisit every past resume scorecard from your Resume Analyzer AI account.",
      },
    ],
  }),
  component: HistoryPage,
});

const items = [
  {
    id: 1,
    role: "Senior Data Analyst",
    company: "Ramp",
    score: 87,
    date: "Today · 2:14 PM",
    delta: +6,
  },
  { id: 2, role: "Analytics Engineer", company: "Notion", score: 81, date: "Yesterday", delta: +3 },
  { id: 3, role: "BI Developer", company: "Stripe", score: 78, date: "3 days ago", delta: -2 },
  { id: 4, role: "Data Analyst II", company: "Airbnb", score: 74, date: "Last week", delta: +8 },
  { id: 5, role: "Product Analyst", company: "Figma", score: 66, date: "2 weeks ago", delta: 0 },
];

function HistoryPage() {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) =>
    (i.role + i.company).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Clock className="h-3.5 w-3.5" /> My History
            </span>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Every scorecard, <span className="text-gradient">saved for you</span>.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Revisit any past analysis. Track your score over time.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Sparkles className="h-4 w-4" /> New analysis
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Analyses run" value="12" />
          <StatCard label="Average score" value="78" />
          <StatCard label="Trending" value="+11" hint="last 7 days" />
        </div>

        <div className="mt-8 flex items-center rounded-2xl border border-border bg-card px-3 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by role or company"
            className="w-full bg-transparent px-2 py-3 text-sm outline-none"
          />
        </div>

        <div className="mt-4 space-y-3">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between rounded-3xl border border-border/60 bg-card p-5 shadow-card hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-sm font-bold text-primary-foreground shadow-glow">
                  {it.score}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {it.role}{" "}
                    <span className="font-normal text-muted-foreground">· {it.company}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{it.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${it.delta > 0 ? "bg-primary/10 text-primary" : it.delta < 0 ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}
                >
                  <TrendingUp className="h-3 w-3" /> {it.delta > 0 ? "+" : ""}
                  {it.delta}
                </span>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                >
                  Open <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No scorecards match "{q}".
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold text-gradient">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
