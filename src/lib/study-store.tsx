import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import {
  demoNotes,
  demoSessions,
  demoTasks,
  todayISO,
  type FocusSession,
  type StudyNote,
  type StudyTask,
} from "./study-types";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

export type TimerMode = "focus" | "break";

type StudyStore = {
  hydrated: boolean;
  tasks: StudyTask[];
  notes: StudyNote[];
  sessions: FocusSession[];
  addTask: (task: Omit<StudyTask, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  saveNote: (note: { id?: string | undefined; subject: string; title: string; content: string }) => void;
  deleteNote: (id: string) => void;
  resetDemoData: () => void;
  // timer
  mode: TimerMode;
  secondsLeft: number;
  running: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
};

const StudyContext = createContext<StudyStore | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks, tasksHydrated] = useLocalStorage<StudyTask[]>("sb.tasks", demoTasks);
  const [notes, setNotes] = useLocalStorage<StudyNote[]>("sb.notes", demoNotes);
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>("sb.sessions", demoSessions);

  const [mode, setModeState] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setRunning(false);
        if (modeRef.current === "focus") {
          setSessions((prev) => [...prev, { id: uid(), date: todayISO(), minutes: FOCUS_MINUTES }]);
          setModeState("break");
          return BREAK_MINUTES * 60;
        }
        setModeState("focus");
        return FOCUS_MINUTES * 60;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, setSessions]);

  const setMode = useCallback((next: TimerMode) => {
    setRunning(false);
    setModeState(next);
    setSecondsLeft((next === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
  }, []);

  const resetTimer = useCallback(() => {
    setRunning(false);
    setSecondsLeft((modeRef.current === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
  }, []);

  const value = useMemo<StudyStore>(
    () => ({
      hydrated: tasksHydrated,
      tasks,
      notes,
      sessions,
      addTask: (task) => setTasks((prev) => [...prev, { ...task, id: uid(), completed: false }]),
      toggleTask: (id) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      saveNote: (note) =>
        setNotes((prev) => {
          const updatedAt = new Date().toISOString();
          if (note.id && prev.some((n) => n.id === note.id)) {
            return prev.map((n) => (n.id === note.id ? { ...n, ...note, id: n.id, updatedAt } : n));
          }
          return [{ ...note, id: note.id ?? uid(), updatedAt }, ...prev];
        }),
      deleteNote: (id) => setNotes((prev) => prev.filter((n) => n.id !== id)),
      resetDemoData: () => {
        setTasks(demoTasks);
        setNotes(demoNotes);
        setSessions(demoSessions);
      },
      mode,
      secondsLeft,
      running,
      startTimer: () => setRunning(true),
      pauseTimer: () => setRunning(false),
      resetTimer,
      setMode,
    }),
    [tasks, notes, sessions, tasksHydrated, mode, secondsLeft, running, setTasks, setNotes, setSessions, resetTimer, setMode],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside StudyProvider");
  return ctx;
}

export const TIMER_PRESETS = { focus: FOCUS_MINUTES, break: BREAK_MINUTES };

export function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
