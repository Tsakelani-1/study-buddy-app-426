import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, EmptyState, GhostButton, PrimaryButton, ProgressBar, SectionTitle, Stat } from "@/components/ui-bits";
import { useStudy, formatClock } from "@/lib/study-store";
import { formatDate, formatMinutes, subjectColor, todayISO } from "@/lib/study-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Study Buddy — Study smarter. Stay organised. Reach your goals." },
      {
        name: "description",
        content:
          "A friendly student dashboard for planning study sessions, focusing with a 25/5 timer, tracking progress and keeping notes.",
      },
      { property: "og:title", content: "Study Buddy — Your student study dashboard" },
      {
        property: "og:description",
        content: "Plan study tasks, focus in 25-minute blocks, track progress by subject and keep notes in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tasks, sessions, mode, secondsLeft, running, startTimer, pauseTimer, resetTimer, toggleTask } = useStudy();

  const today = todayISO();
  const todaysTasks = tasks.filter((t) => t.date === today);
  const doneToday = todaysTasks.filter((t) => t.completed).length;
  const minutesLeft = todaysTasks.filter((t) => !t.completed).reduce((sum, t) => sum + t.duration, 0);
  const goalPct = todaysTasks.length ? Math.round((doneToday / todaysTasks.length) * 100) : 0;

  const upcoming = tasks
    .filter((t) => !t.completed && t.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const sessionsToday = sessions.filter((s) => s.date === today);
  const totalFocus = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;

  const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
  const timerPct = mode === "focus" ? 100 - (secondsLeft / (25 * 60)) * 100 : 100 - (secondsLeft / (5 * 60)) * 100;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <header className="rise mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="font-display text-2xl font-semibold leading-tight text-balance">{greeting}, Maya</h1>
          <p className="mt-1 text-sm text-muted-foreground">Study smarter. Stay organised. Reach your goals.</p>
        </div>
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint to-sky font-display text-sm font-semibold text-primary-foreground ring-2 ring-cream">
          M
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rise rounded-[28px] bg-gradient-to-br from-primary-soft via-cream to-sky-soft p-6 ring-1 ring-line shadow-[0_20px_40px_-24px] shadow-primary/40 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">Today's goal</p>
              <h2 className="mt-1 font-display text-3xl font-semibold leading-tight text-pretty">
                {todaysTasks[0]?.topic ?? "Plan your first study task"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {todaysTasks.length
                  ? `${doneToday} of ${todaysTasks.length} tasks done · ${formatMinutes(minutesLeft)} left`
                  : "Add a task in the planner to set today's goal."}
              </p>
            </div>
            <div className="relative grid size-20 shrink-0 place-items-center">
              <div className="absolute inset-0 rounded-full" style={{ transform: "rotate(-90deg)" }}>
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary) 0 ${goalPct}%, var(--line) ${goalPct}% 100%)`,
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 9px))",
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold leading-none">{goalPct}%</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">done</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to="/focus">
              <PrimaryButton>Start studying</PrimaryButton>
            </Link>
            <Link to="/assistant">
              <GhostButton>Ask AI Assistant</GhostButton>
            </Link>
          </div>
        </div>

        <div className="rise glass-card p-6 [animation-delay:80ms]">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Focus timer</p>
            <span className="rounded-full bg-mint-soft px-2 py-1 font-mono text-[10px] font-medium text-mint">25 / 5</span>
          </div>
          <div className="relative mx-auto mt-4 grid size-36 place-items-center">
            <div className="absolute inset-0 rounded-full" style={{ transform: "rotate(-90deg)" }}>
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(var(--sky) 0 ${timerPct}%, var(--line) ${timerPct}% 100%)`,
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 10px))",
                }}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold tabular-nums">{formatClock(secondsLeft)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{mode === "focus" ? "Deep work" : "Short break"}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={running ? pauseTimer : startTimer}
              className="rounded-full bg-sky-soft px-4 py-2 text-xs font-medium text-sky transition active:scale-95"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-full bg-cream px-4 py-2 text-xs font-medium ring-1 ring-line transition active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Sessions" value={sessionsToday.length} caption="today" />
        <Stat label="Focus" value={formatMinutes(totalFocus)} caption="all time" />
        <Stat
          label="Tasks"
          value={
            <>
              {completedTasks}
              <span className="text-base text-muted-foreground">/{tasks.length}</span>
            </>
          }
          caption="completed"
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="rise [animation-delay:320ms]">
          <SectionTitle
            action={
              <Link
                to="/planner"
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary transition active:scale-95"
              >
                + Add
              </Link>
            }
          >
            Upcoming tasks
          </SectionTitle>
          {upcoming.length === 0 ? (
            <EmptyState
              title="Nothing scheduled"
              description="You're all caught up. Add your next study task to keep the plan moving."
            />
          ) : (
            <ul className="flex flex-col gap-1">
              {upcoming.map((task) => (
                <li key={task.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-cream">
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.topic} as completed`}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="size-5 text-primary" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{task.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.subject} · {formatDate(task.date)} {task.time} · {task.duration}m
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="rise [animation-delay:380ms]">
          <SectionTitle>Progress by subject</SectionTitle>
          {subjects.length === 0 ? (
            <EmptyState title="No subjects yet" description="Subjects appear here once you add study tasks." />
          ) : (
            <div className="flex flex-col gap-3.5">
              {subjects.slice(0, 5).map((subject) => {
                const all = tasks.filter((t) => t.subject === subject);
                const done = all.filter((t) => t.completed).length;
                return (
                  <ProgressBar
                    key={subject}
                    label={subject}
                    value={(done / all.length) * 100}
                    color={subjectColor(subject)}
                  />
                );
              })}
            </div>
          )}
          <p className="mt-4 rounded-2xl bg-mint-soft px-3 py-2 text-xs text-mint">
            {completedTasks > 0
              ? "Nice work — every finished task counts. Keep going!"
              : "Tick off your first task today and you're on your way."}
          </p>
        </Card>
      </section>
    </>
  );
}
