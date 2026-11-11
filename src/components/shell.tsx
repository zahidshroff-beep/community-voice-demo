import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useVoice } from "@/lib/store";

const NAV = [
  { to: "/", label: "Pulse" },
  { to: "/listen", label: "Listen" },
  { to: "/analyse", label: "Analyse" },
  { to: "/validate", label: "Validate" },
  { to: "/act", label: "Act" },
  { to: "/gender", label: "Gender lens" },
  { to: "/government", label: "Government" },
  { to: "/safeguarding", label: "Safeguarding" },
  { to: "/fit", label: "How it fits" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useVoice.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-teal-deep px-4 py-2 text-center text-sm text-on-teal">
        Prototype, synthetic data. No real learner or CAMA data.
      </div>
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <Link to="/" className="text-base font-semibold tracking-tight text-ink">
              Community Voice
              <span className="hidden font-normal text-muted sm:inline"> & Learning Intelligence</span>
            </Link>
            <p className="text-xs text-muted">Country A</p>
          </div>
          <nav className="flex w-full max-w-full gap-1 overflow-x-auto pb-1" aria-label="Sections">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="shrink-0 rounded-full px-3 py-2 text-sm text-muted"
                activeProps={{
                  className: "shrink-0 rounded-full bg-teal-soft px-3 py-2 text-sm font-medium text-teal-deep",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-line px-4 py-6 text-center text-sm text-muted">
        Altamont Advisory · prototype for discussion
      </footer>
    </div>
  );
}
