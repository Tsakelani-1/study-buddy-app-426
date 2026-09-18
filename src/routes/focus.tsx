import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Card, GhostButton, PrimaryButton, SectionTitle, Stat } from "@/components/ui-bits";
import { TIMER_PRESETS, formatClock, useStudy } from "@/lib/study-store";
import { formatMinutes, todayISO } from "@/lib/study-types";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Timer — Study Buddy" },
      { name: "description", content: "A 25-minute focus timer with 5-minute breaks that logs every completed study session." },
      { property: "og:title", content: "Focus Timer — Study Buddy" },
      { property: "og:description", content: "Study in 25-minute blocks, take 5-minute breaks, and watch your sessions add up." },
    ],
  }),
  component: FocusPage,
});

function FocusPage() {
  const { mode, secondsLeft, running, startTimer, pauseTimer, resetTimer, setMode, sessions } = useStudy();

  const total = TIMER_PRESETS[mode] * 60;
  const pct = 100 - (secondsLeft / total) * 100;
  const today = sessions.filter((s) => s.date === todayISO());
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <>
      <PageHeader
        eyebrow="Focus timer"
        title={mode === "focus" ? "Deep work block" : "Take a short break"}
        description="Work in 25 minutes of focus, then rest for 5. Finished focus blocks count towards your stats."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="rise flex flex-col items-center py-8">
          <div className="mb-6 flex gap-1 rounded-full bg-cream p-1 ring-1 ring-line">
            <button
              onClick={() => setMode("focus")}
              className={
                mode === "focus"
                  ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                  : "rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
              }
            >
              Focus 25
            </button>
            <button
              onClick={() => setMode("break")}
              className={
                mode === "break"
                  ? "rounded-full bg-mint px-4 py-1.5 text-xs font-medium text-primary-foreground"
                  : "rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
              }
            >
              Break 5
            </button>
          </div>

          <div className="relative grid size-60 place-items-center">
            <div className="absolute inset-0 rounded-full" style={{ transform: "rotate(-90deg)" }}>
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(${mode === "focus" ? "var(--primary)" : "var(--mint)"} 0 ${pct}%, var(--line) ${pct}% 100%)`,
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
                }}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-6xl font-bold tabular-nums">{formatClock(secondsLeft)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {mode === "focus" ? "Stay with one task" : "Stretch, drink water"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2.5">
            {running ? (
              <GhostButton onClick={pauseTimer} className="flex items-center gap-2">
                <Pause className="size-4" /> Pause
              </GhostButton>
            ) : (
              <PrimaryButton onClick={startTimer} className="flex items-center gap-2">
                <Play className="size-4" /> Start
              </PrimaryButton>
            )}
            <GhostButton onClick={resetTimer} className="flex items-center gap-2">
              <RotateCcw className="size-4" /> Reset
            </GhostButton>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Today" value={today.length} caption="focus sessions" />
            <Stat label="All time" value={sessions.length} caption={formatMinutes(totalMinutes)} />
          </div>
          <Card className="rise [animation-delay:120ms]">
            <SectionTitle>How it works</SectionTitle>
            <ol className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>1. Pick one task from your planner.</li>
              <li>2. Start a 25-minute focus block and put your phone away.</li>
              <li>3. When the timer ends, the session is logged automatically.</li>
              <li>4. Take the 5-minute break — it's part of the method.</li>
            </ol>
            <p className="mt-4 rounded-2xl bg-sky-soft px-3 py-2 text-xs text-sky">
              Four focus blocks a day adds up to more than 8 hours of study a week.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
