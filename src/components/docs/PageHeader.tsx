import { Clock } from "lucide-react";
import StatusBadge, { type PageStatus } from "./StatusBadge";

interface PageHeaderProps {
  title: string;
  description?: string;
  readingTime?: string;
  /** Honest component status, rendered as a chip beside the title. */
  status?: PageStatus;
  /** Optional milestone detail appended to the status chip. */
  statusDetail?: string;
}

export default function PageHeader({
  title,
  description,
  readingTime,
  status,
  statusDetail,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {status && (
        <div className="mb-3">
          <StatusBadge status={status} detail={statusDetail} />
        </div>
      )}
      <h1 className="text-[32px] font-bold tracking-[-0.03em] leading-[1.2] text-docs-text-primary mb-3">
        {title}
      </h1>

      {(description || readingTime) && (
        <div className="flex flex-wrap items-start gap-3">
          {description && (
            <p className="text-[18px] text-docs-text-muted leading-relaxed max-w-[560px]">
              {description}
            </p>
          )}
          {readingTime && (
            <span className="flex items-center gap-1 mt-1 shrink-0 text-[12px] font-medium bg-docs-bg-surface border border-docs-border-default rounded-full px-3 py-1 text-docs-text-muted">
              <Clock size={11} />
              {readingTime}
            </span>
          )}
        </div>
      )}

      <div className="mt-8 h-px bg-docs-border-subtle" />
    </div>
  );
}
