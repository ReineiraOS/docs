type BadgeVariant = "default" | "blue" | "green" | "amber" | "red";

interface DocsBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-docs-bg-surface-alt text-docs-text-muted border-docs-border-default",
  blue: "bg-[hsl(217_100%_61%_/_0.08)] text-brand-primary border-transparent",
  green:
    "bg-[hsl(142_71%_45%_/_0.08)] text-[hsl(var(--tip-text))] border-transparent",
  amber:
    "bg-[hsl(38_92%_50%_/_0.08)] text-[hsl(var(--warning-text))] border-transparent",
  red: "bg-[hsl(0_84%_60%_/_0.08)] text-[hsl(var(--danger-text))] border-transparent",
};

export default function DocsBadge({
  variant = "default",
  children,
  className = "",
}: DocsBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
