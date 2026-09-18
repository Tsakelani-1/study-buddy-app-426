import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import {
  Card,
  EmptyState,
  Field,
  GhostButton,
  PrimaryButton,
  SectionTitle,
  SubjectChip,
  inputClass,
} from "@/components/ui-bits";
import { useStudy } from "@/lib/study-store";
import { subjectColor } from "@/lib/study-types";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Study Notes — Study Buddy" },
      { name: "description", content: "Write, edit and delete study notes by subject. Saved in your browser so they're there next time." },
      { property: "og:title", content: "Study Notes — Study Buddy" },
      { property: "og:description", content: "Keep short, searchable notes for every subject you study." },
    ],
  }),
  component: NotesPage,
});

type Errors = Partial<Record<"subject" | "title" | "content", string>>;

function NotesPage() {
  const { notes, saveNote, deleteNote } = useStudy();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: "", title: "", content: "" });
  const [errors, setErrors] = useState<Errors>({});

  function reset() {
    setEditingId(null);
    setForm({ subject: "", title: "", content: "" });
    setErrors({});
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.subject.trim()) next.subject = "Add a subject";
    if (!form.title.trim()) next.title = "Give your note a title";
    if (form.content.trim().length < 5) next.content = "Write at least a sentence";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    saveNote({
      ...(editingId ? { id: editingId } : {}),
      subject: form.subject.trim(),
      title: form.title.trim(),
      content: form.content.trim(),
    });
    toast.success(editingId ? "Note updated" : "Note saved");
    reset();
  }

  return (
    <>
      <PageHeader
        eyebrow="Study notes"
        title="Your notes, one subject at a time"
        description="Short notes beat long ones. Write it in your own words and you'll remember it."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="rise">
          <SectionTitle>{editingId ? "Edit note" : "New note"}</SectionTitle>
          <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
            <Field label="Subject" htmlFor="note-subject" error={errors.subject}>
              <input
                id="note-subject"
                className={inputClass}
                placeholder="Biology"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Field>
            <Field label="Title" htmlFor="note-title" error={errors.title}>
              <input
                id="note-title"
                className={inputClass}
                placeholder="Mitosis in four steps"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Content" htmlFor="note-content" error={errors.content}>
              <textarea
                id="note-content"
                rows={7}
                className={inputClass}
                placeholder="Write the key points in your own words…"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </Field>
            <div className="flex gap-2">
              <PrimaryButton type="submit">{editingId ? "Save changes" : "Save note"}</PrimaryButton>
              {editingId ? (
                <GhostButton type="button" onClick={reset}>
                  Cancel
                </GhostButton>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="flex flex-col gap-3">
          {notes.length === 0 ? (
            <Card className="rise">
              <EmptyState
                title="No notes yet"
                description="Write your first note on the left — a summary of what you just studied works well."
              />
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="rise">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <SubjectChip subject={note.subject} color={subjectColor(note.subject)} />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold">{note.title}</h3>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      aria-label={`Edit ${note.title}`}
                      onClick={() => {
                        setEditingId(note.id);
                        setForm({ subject: note.subject, title: note.title, content: note.content });
                        setErrors({});
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="grid size-8 place-items-center rounded-full bg-cream text-muted-foreground ring-1 ring-line transition hover:text-primary"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      aria-label={`Delete ${note.title}`}
                      onClick={() => {
                        deleteNote(note.id);
                        if (editingId === note.id) reset();
                        toast("Note deleted");
                      }}
                      className="grid size-8 place-items-center rounded-full bg-cream text-muted-foreground ring-1 ring-line transition hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{note.content}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
