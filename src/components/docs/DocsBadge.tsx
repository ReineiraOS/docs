type BadgeVariant = "default" | "blue" | "green" | "amber" | "red";

interface DocsBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-docs-bg-surface-alt text-docs-text-muted border-docs-border-default",
  blue: "bg-semantic-info-bg text-semantic-info-text border-transparent",
  green: "bg-semantic-tip-bg text-semantic-tip-text border-transparent",
  amber: "bg-semantic-warning-bg text-semantic-warning-text border-transparent",
  red: "bg-semantic-danger-bg text-semantic-danger-text border-transparent",
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
