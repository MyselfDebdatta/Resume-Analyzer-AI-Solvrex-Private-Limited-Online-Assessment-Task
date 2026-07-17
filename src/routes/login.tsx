import { createFileRoute, Link } from "@tanstack/react-router";
import { Rocket, Mail, Lock, Github } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — ResumePilot" },
      {
        name: "description",
        content: "Log in to your ResumePilot account to access saved scorecards.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  return (
    <div className="grid min-h-screen bg-hero lg:grid-cols-2">
      <div className="hidden flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="text-lg">ResumePilot</span>
        </Link>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-mesh opacity-40 blur-2xl" />
          <div className="glass-strong rounded-[2rem] p-8 shadow-glow">
            <div className="text-xs font-medium text-muted-foreground">Latest scorecard</div>
            <div className="mt-2 text-3xl font-bold text-gradient">87 / 100</div>
            <p className="mt-2 text-sm text-muted-foreground">
              "The section-level feedback is what did it — I jumped from 62 to 91 in two rewrites."
            </p>
            <div className="mt-4 text-xs font-medium">Ananya P. · Data Analyst at Ramp</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ResumePilot
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 shadow-glow">
            <h1 className="text-3xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLogin
                ? "Log in to see your saved scorecards."
                : "Start scoring resumes in seconds."}
            </p>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && <Field label="Full name" placeholder="Alex Rivera" />}
              <Field label="Email" placeholder="you@work.com" icon={<Mail className="h-4 w-4" />} />
              <Field
                label="Password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                type="password"
              />

              <button className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
                {isLogin ? "Log in" : "Create account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or continue with{" "}
              <div className="h-px flex-1 bg-border" />
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary">
              <Github className="h-4 w-4" /> Continue with GitHub
            </button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5 flex items-center rounded-2xl border border-border bg-card px-3">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent px-2 py-3 text-sm outline-none"
        />
      </div>
    </label>
  );
}
