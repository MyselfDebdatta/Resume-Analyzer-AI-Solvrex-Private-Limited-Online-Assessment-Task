import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, Search, ChevronRight, Sparkles, Rocket, ArrowLeft, Home, LogOut, Calendar, Activity, FileCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserStatsFn, getHistoryFn } from "@/lib/server-fns";

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
  loader: async () => {
    const [stats, history] = await Promise.all([
      getUserStatsFn(),
      getHistoryFn(),
    ]);
    return { stats, history };
  },
  component: HistoryPage,
});

function HistoryPage() {
  const router = useRouter();
  const { stats, history } = Route.useLoaderData();
  const { data: sessionData, isPending } = authClient.useSession();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.navigate({ to: "/login" });
    }
  }, [isPending, sessionData, router]);

  if (isPending || !sessionData) {
    return (
      <div className="min-h-screen bg-hero grid place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-r-transparent"></div>
      </div>
    );
  }

  const { user, session } = sessionData;

  const filtered = history.filter((i) =>
    (i.role).toLowerCase().includes(q.toLowerCase()),
  );

  const handleLogout = async () => {
    await authClient.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      {/* App Header (Same as Dashboard) */}
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
          
          {/* Profile Sidebar */}
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

                <Link
                  to="/dashboard"
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-brand/20 bg-brand/5 text-brand py-3 font-semibold text-sm hover:bg-brand hover:text-primary-foreground transition-all duration-200"
                >
                  <Home className="h-4 w-4" /> Back to Dashboard
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

          {/* Main History Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Clock className="h-3.5 w-3.5" /> My History
                </span>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                  Every scorecard, <span className="text-gradient">saved for you</span>.
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Revisit any past analysis. Track your score over time.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                <Sparkles className="h-4 w-4" /> New analysis
              </Link>
            </div>

            <div className="mt-8 flex items-center rounded-2xl border border-border bg-card px-3 shadow-card">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by targeted role..."
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>

            <div className="mt-4 space-y-3">
              {filtered.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-card hover:shadow-glow transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-brand text-lg font-bold text-primary-foreground shadow-glow">
                      {it.matchPercentage}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {it.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(it.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to="/dashboard"
                      className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Open Analysis <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  {history.length === 0 ? "You haven't run any analyses yet." : `No scorecards match "${q}".`}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
