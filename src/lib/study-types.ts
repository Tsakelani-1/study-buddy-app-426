export type StudyTask = {
  id: string;
  subject: string;
  topic: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  duration: number; // minutes
  completed: boolean;
};

export type StudyNote = {
  id: string;
  subject: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type FocusSession = {
  id: string;
  date: string; // yyyy-mm-dd
  minutes: number;
};

export const SUBJECT_COLORS = ["primary", "sky", "mint", "peach"] as const;
export type SubjectColor = (typeof SUBJECT_COLORS)[number];

export function subjectColor(subject: string): SubjectColor {
  let sum = 0;
  for (let i = 0; i < subject.length; i++) sum += subject.charCodeAt(i);
  return SUBJECT_COLORS[sum % SUBJECT_COLORS.length] ?? "primary";
}

export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  if (iso === todayISO()) return "Today";
  if (iso === todayISO(1)) return "Tomorrow";
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const demoTasks: StudyTask[] = [
  {
    id: "t1",
    subject: "Biology",
    topic: "Read Chapter 4 — Genetics",
    date: todayISO(),
    time: "09:00",
    duration: 30,
    completed: true,
  },
  {
    id: "t2",
    subject: "Mathematics",
    topic: "Solve calculus problem set",
    date: todayISO(),
    time: "11:30",
    duration: 45,
    completed: false,
  },
  {
    id: "t3",
    subject: "French",
    topic: "Review vocabulary list 12",
    date: todayISO(),
    time: "14:00",
    duration: 20,
    completed: false,
  },
  {
    id: "t4",
    subject: "History",
    topic: "Essay outline — Cold War",
    date: todayISO(1),
    time: "16:00",
    duration: 40,
    completed: false,
  },
  {
    id: "t5",
    subject: "Biology",
    topic: "Label the cell diagram",
    date: todayISO(-1),
    time: "10:00",
    duration: 25,
    completed: true,
  },
  {
    id: "t6",
    subject: "Mathematics",
    topic: "Practice integration by parts",
    date: todayISO(2),
    time: "18:00",
    duration: 35,
    completed: false,
  },
];

export const demoNotes: StudyNote[] = [
  {
    id: "n1",
    subject: "Biology",
    title: "Mitosis in four steps",
    content:
      "Prophase: chromosomes condense.\nMetaphase: they line up in the middle.\nAnaphase: sister chromatids pull apart.\nTelophase: two new nuclei form.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "n2",
    subject: "Mathematics",
    title: "Integration by parts",
    content: "∫u dv = uv − ∫v du. Pick u using LIATE: Log, Inverse trig, Algebraic, Trig, Exponential.",
    updatedAt: new Date().toISOString(),
  },
];

export const demoSessions: FocusSession[] = [
  { id: "s1", date: todayISO(-2), minutes: 25 },
  { id: "s2", date: todayISO(-1), minutes: 25 },
  { id: "s3", date: todayISO(-1), minutes: 25 },
  { id: "s4", date: todayISO(), minutes: 25 },
  { id: "s5", date: todayISO(), minutes: 25 },
];
