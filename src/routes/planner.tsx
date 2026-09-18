import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import {
  Card,
  EmptyState,
  Field,
  PrimaryButton,
  SectionTitle,
  SubjectChip,
  inputClass,
} from "@/components/ui-bits";
import { useStudy } from "@/lib/study-store";
import { formatDate, subjectColor, todayISO, type StudyTask } from "@/lib/study-types";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Study Planner — Study Buddy" },
      { name: "description", content: "Plan study tasks by subject, topic, date, time and duration, and tick them off as you go." },
      { property: "og:title", content: "Study Planner — Study Buddy" },
      { property: "og:description", content: "Plan study tasks by subject, topic, date, time and duration." },
    ],
  }),
  component: PlannerPage,
});

type Errors = Partial<Record<"subject" | "topic" | "date" | "time" | "duration", string>>;

function PlannerPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useStudy();
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    date: todayISO(),
    time: "09:00",
    duration: "30",
  });
  const [errors, setErrors] = useState<Errors>({});

  const upcoming = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const completed = tasks.filter((t) => t.completed);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.subject.trim()) next.subject = "Add a subject";
    if (!form.topic.trim()) next.topic = "What will you study?";
    if (!form.date) next.date = "Pick a date";
    if (!form.time) next.time = "Pick a time";
    const duration = Number(form.duration);
    if (!duration || duration < 5 || duration > 300) next.duration = "Use 5–300 minutes";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addTask({
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      date: form.date,
      time: form.time,
      duration,
    });
    toast.success("Study task added");
    setForm({ ...form, subject: "", topic: "" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Study planner"
        title="Plan your study time"
        description="Break big subjects into short, scheduled sessions you'll actually finish."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="rise">
          <SectionTitle>Add a study task</SectionTitle>
          <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
            <Field label="Subject" htmlFor="subject" error={errors.subject}>
              <input
                id="subject"
                className={inputClass}
                placeholder="Biology"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Field>
            <Field label="Topic" htmlFor="topic" error={errors.topic}>
              <input
                id="topic"
                className={inputClass}
                placeholder="Cell division revision"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" htmlFor="date" error={errors.date}>
                <input
                  id="date"
                  type="date"
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
              <Field label="Time" htmlFor="time" error={errors.time}>
                <input
                  id="time"
                  type="time"
                  className={inputClass}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Duration (minutes)" htmlFor="duration" error={errors.duration}>
              <input
                id="duration"
                type="number"
                min={5}
                max={300}
                step={5}
                className={inputClass}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </Field>
            <PrimaryButton type="submit" className="mt-1">
              Add task
            </PrimaryButton>
          </form>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="rise [animation-delay:80ms]">
            <SectionTitle>Upcoming ({upcoming.length})</SectionTitle>
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming tasks"
                description="Add your next study session on the left and it will show up here."
              />
            ) : (
              <ul className="flex flex-col gap-1">
                {upcoming.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </ul>
            )}
          </Card>

          <Card className="rise [animation-delay:160ms]">
            <SectionTitle>Completed ({completed.length})</SectionTitle>
            {completed.length === 0 ? (
              <EmptyState title="Nothing completed yet" description="Tick a task off and it lands here as proof of progress." />
            ) : (
              <ul className="flex flex-col gap-1">
                {completed.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: StudyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-cream">
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark ${task.topic} as not done` : `Mark ${task.topic} as done`}
        className="text-muted-foreground transition hover:text-primary"
      >
        {task.completed ? <CheckCircle2 className="size-5 text-mint" /> : <Circle className="size-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={task.completed ? "truncate font-medium text-muted-foreground line-through" : "truncate font-medium"}>
          {task.topic}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(task.date)} {task.time} · {task.duration}m
        </p>
      </div>
      <SubjectChip subject={task.subject} color={subjectColor(task.subject)} />
      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.topic}`}
        className="text-muted-foreground transition hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
