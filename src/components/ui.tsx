import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" | "clay" }) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-50",
        variant === "primary" && "bg-teal text-on-teal",
        variant === "secondary" && "border border-line bg-card text-ink",
        variant === "quiet" && "h-10 rounded-lg px-3 text-teal",
        variant === "clay" && "bg-clay text-on-teal",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("min-w-0 max-w-full rounded-card border border-line bg-card p-5", className)}>{children}</section>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "teal" | "clay" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "bg-paper text-muted",
        tone === "teal" && "bg-teal-soft text-teal-deep",
        tone === "clay" && "bg-clay-soft text-clay",
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-1 text-xs font-medium text-muted">
      {label}
      {children}
    </label>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 rounded-lg border border-line bg-card px-3 text-sm font-normal text-ink",
        props.className,
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-20 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted",
        props.className,
      )}
    />
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink placeholder:text-muted",
        props.className,
      )}
    />
  );
}
