import { Link } from "@tanstack/react-router";
import { Rocket, Github, Linkedin, Instagram, MessageCircle, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
                <Rocket className="h-4 w-4" />
              </span>
              <span className="text-lg">Resume Analyzer AI</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A smart co-pilot for your job search. Understand your resume the way an ATS does —
              before you apply.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="https://github.com/MyselfDebdatta" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/debdatta-panda-dp11/" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://wa.me/918637377080" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/itz__debdatta?igsh=MXRydjliNmdycDFrdg==" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="mailto:myselfDeb11@gmail.com" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground">
                  Analyze
                </Link>
              </li>

            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Resume Analyzer AI. Crafted with care.</span>
          <span>Made for candidates who deserve a better shot.</span>
        </div>
      </div>
    </footer>
  );
}
