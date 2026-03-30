import {
  Info,
  AlertTriangle,
  Lightbulb,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type CalloutVariant = "info" | "warning" | "tip" | "danger";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const variantConfig: Record<
  CalloutVariant,
  {
    icon: LucideIcon;
    label: string;
    borderColor: string;
    bgColor: string;
    labelColor: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    label: "Info",
    borderColor: "hsl(217 100% 61%)",
    bgColor: "hsl(217 100% 61% / 0.06)",
    labelColor: "hsl(224 76% 39%)",
    iconColor: "hsl(217 100% 61%)",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    borderColor: "hsl(38 92% 50%)",
    bgColor: "hsl(38 92% 50% / 0.06)",
    labelColor: "hsl(32 81% 29%)",
    iconColor: "hsl(38 92% 50%)",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    borderColor: "hsl(142 71% 45%)",
    bgColor: "hsl(142 71% 45% / 0.06)",
    labelColor: "hsl(142 72% 29%)",
    iconColor: "hsl(142 71% 45%)",
  },
  danger: {
    icon: XCircle,
    label: "Danger",
    borderColor: "hsl(0 84% 60%)",
    bgColor: "hsl(0 84% 60% / 0.06)",
    labelColor: "hsl(0 74% 42%)",
    iconColor: "hsl(0 84% 60%)",
  },
};

export default function Callout({
  variant = "info",
  title,
  children,
}: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className="rounded-lg px-4 py-3 my-6"
      style={{
        borderLeft: `3px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
      }}
      role="note"
    >
      <div
        className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.05em] mb-1.5"
        style={{ color: config.labelColor }}
      >
        <Icon size={13} style={{ color: config.iconColor }} />
        {title ?? config.label}
      </div>
      <div className="text-[14px] leading-[1.6] text-docs-text-secondary [&_code]:bg-white [&_code]:border [&_code]:border-docs-border-default [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_a]:text-brand-primary [&_a]:font-medium [&_strong]:text-docs-text-primary [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}
