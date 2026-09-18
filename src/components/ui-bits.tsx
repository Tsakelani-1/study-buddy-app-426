import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SubjectColor } from "@/lib/study-types";

export function Card({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return <div className={cn("glass-card p-5", className)}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode | undefined }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-lg font-semibold">{children}</h2>
      {action}
    </div>
  );
}

const barBg: Record<SubjectColor, string> = {
  primary: "bg-primary",
  sky: "bg-sky",
  mint: "bg-mint",
  peach: "bg-peach",
};

const chipClass: Record<SubjectColor, string> = {
  primary: "bg-primary-soft text-primary",
  sky: "bg-sky-soft text-sky",
  mint: "bg-mint-soft text-mint",
  peach: "bg-peach-soft text-peach",
};

export function SubjectChip({ subject, color }: { subject: string; color: SubjectColor }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] font-medium", chipClass[color])}>
      {subject}
    </span>
  );
}

export function ProgressBar({
  label,
  value,
  caption,
  color = "primary",
}: {
  label: string;
  value: number;
  caption?: string | undefined;
  color?: SubjectColor | undefined;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted-foreground">{caption ?? `${pct}%`}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn("bar-fill h-full rounded-full", barBg[color])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value, caption }: { label: string; value: ReactNode; caption?: string | undefined }) {
  return (
    <div className="glass-card rise p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-cream/50 px-4 py-8 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground text-pretty">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-2xl bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow-[0_10px_20px_-8px] shadow-primary/60 transition active:scale-[0.98] disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-2xl bg-cream/80 px-4 py-2.5 font-medium ring-1 ring-line backdrop-blur transition hover:bg-cream active:scale-[0.98] disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
