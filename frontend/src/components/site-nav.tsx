import { Link } from "@tanstack/react-router";
import { Rocket, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();
  
  return (
    <header className="sticky top-0 z-50 w-full pt-3">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="glass-strong flex items-center justify-between rounded-full px-4 py-2.5 shadow-soft">
          <Link to="/" className="flex items-center gap-2 pl-2 font-display font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
              <Rocket className="h-4 w-4" />
            </span>
            <span className="text-lg tracking-tight">Resume Analyzer AI</span>
          </Link>

          <div className="hidden items-center gap-1 text-sm font-medium md:flex">
            <a
              href="/#features"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a
              href="/#how"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="/#faq"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              FAQ
            </a>

          </div>

          <div className="hidden items-center gap-2 md:flex">
            {!isPending && sessionData ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                <User className="h-4 w-4" /> Your Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
                >
                  Analyze Resume
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-full p-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="glass-strong mt-2 flex flex-col gap-1 rounded-3xl p-3 md:hidden">
            <a
              href="/#features"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-2 text-sm"
            >
              Features
            </a>
            <a
              href="/#how"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-2 text-sm"
            >
              How it works
            </a>
            <a
              href="/#faq"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-2 text-sm"
            >
              FAQ
            </a>

            {!isPending && sessionData ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                <User className="h-4 w-4" /> Your Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-2 text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-brand px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  Analyze Resume
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
