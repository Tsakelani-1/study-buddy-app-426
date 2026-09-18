import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { useStudy } from "@/lib/study-store";
import { todayISO } from "@/lib/study-types";

const NAV = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/planner", label: "Study Planner", short: "Planner", icon: CalendarDays },
  { to: "/assistant", label: "AI Assistant", short: "AI", icon: Sparkles },
  { to: "/focus", label: "Focus Timer", short: "Focus", icon: Timer },
  { to: "/progress", label: "Progress", short: "Progress", icon: TrendingUp },
  { to: "/notes", label: "Study Notes", short: "Notes", icon: NotebookPen },
] as const;

function streakDays(dates: string[]) {
  const set = new Set(dates);
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    if (set.has(todayISO(-i))) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { sessions } = useStudy();
  const streak = streakDays(sessions.map((s) => s.date));

  return (
    <div className="min-h-screen bg-background text-sm text-foreground selection:bg-primary/20">
      <div className="mx-auto flex max-w-[1200px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-1 border-r border-line bg-cream/60 p-5 backdrop-blur-xl lg:flex">
          <div className="mb-6 flex items-center gap-2.5 px-1">
            <div className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-primary to-sky font-display text-lg font-bold text-primary-foreground shadow-[0_6px_16px_-6px] shadow-primary/50">
              <BookOpen className="size-4.5" strokeWidth={2.4} />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-none">Study Buddy</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                v1.0 · Demo
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    active
                      ? "flex items-center gap-3 rounded-2xl bg-primary-soft px-3 py-2.5 font-medium text-primary ring-1 ring-primary/15"
                      : "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-cream hover:text-foreground"
                  }
                >
                  <Icon className="size-4" /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-peach-soft to-sky-soft p-3 ring-1 ring-line">
            <p className="font-display text-sm font-semibold">
              Streak: {streak} {streak === 1 ? "day" : "days"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Keep the momentum going.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-8 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-cream/85 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-2 pt-1.5">
          {NAV.map(({ to, short, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-label={short}
                className={
                  active
                    ? "flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-primary"
                    : "flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-muted-foreground"
                }
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="rise mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-2xl font-semibold leading-tight text-balance">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
