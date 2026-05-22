export type PageStatus = "live" | "chaos-net" | "spec" | "research";

interface StatusConfig {
  label: string;
  dot: string;
  classes: string;
}

/**
 * Honest status taxonomy:
 *  - live      → shipped and in production
 *  - chaos-net → ships at the chaos-net milestone (unaudited, public mode)
 *  - spec      → designed, not yet shipped — build against the interface
 *  - research  → exploratory, no committed date
 */
const config: Record<PageStatus, StatusConfig> = {
  live: {
    label: "Live",
    dot: "hsl(142 71% 45%)",
    classes:
      "bg-[hsl(142_71%_45%_/_0.08)] text-[hsl(var(--tip-text))] border-transparent",
  },
  "chaos-net": {
    label: "Chaos-net",
    dot: "hsl(217 100% 61%)",
    classes:
      "bg-[hsl(217_100%_61%_/_0.08)] text-brand-primary border-transparent",
  },
  spec: {
    label: "Spec'd",
    dot: "hsl(38 92% 50%)",
    classes:
      "bg-[hsl(38_92%_50%_/_0.08)] text-[hsl(var(--warning-text))] border-transparent",
  },
  research: {
    label: "Research",
    dot: "hsl(270 60% 60%)",
    classes:
      "bg-[hsl(270_60%_60%_/_0.10)] text-[hsl(270_50%_45%)] border-transparent",
  },
};

interface StatusBadgeProps {
  status: PageStatus;
  /** Optional milestone suffix, e.g. "chaos-net v1.0" → "Spec'd · chaos-net v1.0". */
  detail?: string;
  className?: string;
}

export default function StatusBadge({
  status,
  detail,
  className = "",
}: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${c.classes} ${className}`}
      title={detail ? `${c.label} · ${detail}` : c.label}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: c.dot }}
        aria-hidden="true"
      />
      {detail ? `${c.label} · ${detail}` : c.label}
    </span>
  );
}
