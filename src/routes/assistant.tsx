import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Card, GhostButton, PrimaryButton, inputClass } from "@/components/ui-bits";
import { demoAnswer, type AiMode } from "@/lib/demo-ai";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Study Assistant (Demo) — Study Buddy" },
      { name: "description", content: "Ask a study question and get a simple explanation, practice questions or a summary. Demo responses, no account needed." },
      { property: "og:title", content: "AI Study Assistant (Demo) — Study Buddy" },
      { property: "og:description", content: "Simple explanations, practice questions and summaries for any topic." },
    ],
  }),
  component: AssistantPage,
});

type Message = { id: string; role: "user" | "assistant"; text: string };

const uid = () => Math.random().toString(36).slice(2, 10);

const QUICK: { label: string; mode: AiMode }[] = [
  { label: "Explain simply", mode: "explain" },
  { label: "Create practice questions", mode: "practice" },
  { label: "Summarise this topic", mode: "summary" },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi Maya! Tell me what you're studying — for example \"photosynthesis\" or \"integration by parts\" — and pick a button below or just ask a question.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  function ask(mode: AiMode) {
    const question = input.trim();
    if (!question) {
      setError("Type a topic or question first.");
      return;
    }
    setError("");
    const label =
      mode === "explain"
        ? `Explain simply: ${question}`
        : mode === "practice"
          ? `Practice questions: ${question}`
          : mode === "summary"
            ? `Summarise: ${question}`
            : question;
    setMessages((prev) => [...prev, { id: uid(), role: "user", text: label }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", text: demoAnswer(question, mode) }]);
      setThinking(false);
    }, 700);
  }

  return (
    <>
      <PageHeader
        eyebrow="AI study assistant"
        title="Ask anything you're stuck on"
        description="Friendly explanations written for students, in plain language."
        action={
          <span className="rounded-full bg-peach-soft px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-peach">
            Demo AI · sample responses
          </span>
        }
      />

      <Card className="rise flex h-[70vh] min-h-[520px] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-2.5"}>
              {m.role === "assistant" ? (
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <Sparkles className="size-3.5" />
                </span>
              ) : null}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-sm ring-1 ring-line"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking ? (
            <div className="flex gap-2.5">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Sparkles className="size-3.5" />
              </span>
              <div className="rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-sm text-muted-foreground ring-1 ring-line">
                Thinking…
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <GhostButton key={q.mode} onClick={() => ask(q.mode)} className="px-3 py-2 text-xs">
                {q.label}
              </GhostButton>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask("chat");
            }}
          >
            <div className="flex-1">
              <label htmlFor="question" className="sr-only">
                Your question
              </label>
              <input
                id="question"
                className={inputClass}
                placeholder="e.g. photosynthesis, the Cold War, quadratic equations"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
            </div>
            <PrimaryButton type="submit" aria-label="Send question" className="px-3.5 py-2.5">
              <Send className="size-4" />
            </PrimaryButton>
          </form>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Demo AI: answers are pre-written study guidance, not a live model.
          </p>
        </div>
      </Card>
    </>
  );
}
