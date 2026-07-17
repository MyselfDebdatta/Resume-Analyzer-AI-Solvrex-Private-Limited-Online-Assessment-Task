import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Rocket, Mail, Lock, Github, Chrome, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Resume Analyzer AI" },
      {
        name: "description",
        content: "Log in to your Resume Analyzer AI account to access saved scorecards.",
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
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [needsOtp, setNeedsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const isFormValid = isLogin 
    ? email.length > 0 && password.length > 0 
    : email.length > 0 && password.length > 7 && name.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) throw new Error(signInError.message || "Failed to sign in.");
        router.navigate({ to: "/dashboard" });
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (signUpError) throw new Error(signUpError.message || "Failed to create account.");
        
        // Send OTP
        const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification",
        });
        if (otpError) {
          // If Resend fails (e.g. unverified domain), we catch it here.
          throw new Error("Account created, but failed to send OTP: " + (otpError.message || "Email provider error."));
        }
        
        setNeedsOtp(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: verifyError } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });
      if (verifyError) throw new Error(verifyError.message || "Invalid OTP code.");
      setVerified(true);
    } catch (err: any) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      setError("");
      setLoading(true);
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
      if (error) throw new Error(error.message || `Failed to sign in with ${provider}.`);
    } catch (err: any) {
      setError(err.message || "Something went wrong during social login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-hero lg:grid-cols-2">
      <div className="hidden flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="text-lg">Resume Analyzer AI</span>
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
          © {new Date().getFullYear()} Resume Analyzer AI
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 shadow-glow">
            {verified ? (
              <div className="flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary shadow-glow mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold">Verified!</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your email has been successfully verified.
                </p>
                <button
                  onClick={() => router.navigate({ to: "/dashboard" })}
                  className="mt-8 w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                >
                  Continue to Dashboard
                </button>
              </div>
            ) : !needsOtp ? (
              <>
                <h1 className="text-3xl font-bold">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLogin
                    ? "Log in to see your saved scorecards."
                    : "Start scoring resumes in seconds."}
                </p>

                {error && (
                  <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Field 
                      label="Full name" 
                      placeholder="Alex Rivera" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}
                  <Field 
                    label="Email" 
                    placeholder="you@work.com" 
                    icon={<Mail className="h-4 w-4" />} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                  <Field
                    label="Password"
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button 
                    disabled={loading || !isFormValid}
                    className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? "Please wait..." : (isLogin ? "Log in" : "Create account")}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" /> or continue with{" "}
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => handleSocialLogin("github")}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary"
                  >
                    <Github className="h-4 w-4" /> Continue with GitHub
                  </button>
                  <button 
                    onClick={() => handleSocialLogin("google")}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary"
                  >
                    <Chrome className="h-4 w-4" /> Continue with Google
                  </button>
                </div>

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
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">Check your email</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  We sent a 6-digit verification code to <strong>{email}</strong>.
                </p>
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-500 font-medium">
                  Please also check your <strong>spam or junk folder</strong> if you don't see it in your inbox!
                </p>

                {error && (
                  <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
                  <Field 
                    label="Verification Code" 
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />

                  <button 
                    disabled={loading}
                    className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              </>
            )}
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
  value,
  onChange,
  required
}: {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5 flex items-center rounded-2xl border border-border bg-card px-3">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-transparent px-2 py-3 text-sm outline-none"
        />
      </div>
    </label>
  );
}
