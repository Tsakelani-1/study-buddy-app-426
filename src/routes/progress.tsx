import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Card, EmptyState, ProgressBar, SectionTitle, Stat } from "@/components/ui-bits";
import { useStudy } from "@/lib/study-store";
import { formatMinutes, subjectColor, todayISO } from "@/lib/study-types";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Tracker — Study Buddy" },
      { name: "description", content: "See completed tasks, focus sessions and progress by subject with encouraging feedback." },
      { property: "og:title", content: "Progress Tracker — Study Buddy" },
      { property: "og:description", content: "Completed tasks, focus sessions and progress by subject at a glance." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { tasks, sessions } = useStudy();

  const completed = tasks.filter((t) => t.completed);
  const overall = tasks.length ? (completed.length / tasks.length) * 100 : 0;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const subjects = Array.from(new Set(tasks.map((t) => t.subject)));

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = todayISO(-6 + i);
    return {
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "narrow" }),
      count: sessions.filter((s) => s.date === date).length,
    };
  });
  const maxCount = Math.max(1, ...week.map((d) => d.count));

  const message =
    overall >= 75
      ? "Outstanding — you're finishing almost everything you plan."
      : overall >= 40
        ? "Solid momentum. One more session today keeps you ahead."
        : "Small steps count. Finish one short task and the graph starts moving.";

  return (
    <>
      <PageHeader
        eyebrow="Progress tracker"
        title="Your study progress"
        description="Every completed task and focus session is counted here."
      />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tasks done" value={completed.length} caption={`of ${tasks.length}`} />
        <Stat label="Sessions" value={sessions.length} caption="focus blocks" />
        <Stat label="Focus time" value={formatMinutes(totalMinutes)} caption="all time" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="rise">
          <SectionTitle>Focus sessions this week</SectionTitle>
          <div className="flex h-40 items-end gap-3">
            {week.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary-soft to-primary transition-all"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count ? "8%" : "3px" }}
                    title={`${d.count} sessions`}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rise [animation-delay:80ms]">
          <SectionTitle>Overall</SectionTitle>
          <ProgressBar label="All study tasks" value={overall} />
          <div className="mt-5">
            <h3 className="mb-3 font-display text-base font-semibold">By subject</h3>
            {subjects.length === 0 ? (
              <EmptyState title="No subjects yet" description="Add tasks in the planner to start tracking subjects." />
            ) : (
              <div className="flex flex-col gap-3.5">
                {subjects.map((subject) => {
                  const all = tasks.filter((t) => t.subject === subject);
                  const done = all.filter((t) => t.completed).length;
                  return (
                    <ProgressBar
                      key={subject}
                      label={subject}
                      value={(done / all.length) * 100}
                      caption={`${done}/${all.length}`}
                      color={subjectColor(subject)}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <p className="mt-4 rounded-2xl bg-mint-soft px-3 py-2 text-xs text-mint">{message}</p>
        </Card>
      </div>

      <Card className="rise mt-4 [animation-delay:160ms]">
        <SectionTitle>Completed tasks</SectionTitle>
        {completed.length === 0 ? (
          <EmptyState title="Nothing completed yet" description="Tick off a task in the planner and it will appear here." />
        ) : (
          <ul className="grid gap-1 sm:grid-cols-2">
            {completed.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 hover:bg-cream">
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.subject} · {t.duration}m
                  </p>
                </div>
                <span className="rounded-full bg-mint-soft px-2 py-0.5 font-mono text-[10px] text-mint">done</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
