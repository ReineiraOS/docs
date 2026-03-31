import { ArrowRight } from "lucide-react";

interface Step {
  label: string;
  sublabel?: string;
}

interface ArchitectureDiagramProps {
  title?: string;
  steps: Step[];
}

export default function ArchitectureDiagram({
  title,
  steps,
}: ArchitectureDiagramProps) {
  return (
    <div className="rounded-xl border border-docs-border-default overflow-hidden my-8 shadow-sm">
      {title && (
        <div className="bg-docs-bg-code-header border-b border-docs-border-default px-4 py-2.5">
          <span className="text-[13px] font-semibold text-docs-text-muted tracking-wide">
            {title}
          </span>
        </div>
      )}

      <div className="bg-docs-bg-surface p-8 overflow-x-auto">
        <div className="flex items-start justify-start gap-0 min-w-max">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start">
              {/* Step box */}
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center justify-center rounded-lg border border-docs-border-default bg-docs-bg-page px-5 py-3 shadow-sm min-w-[120px] text-center">
                  <span className="text-[14px] font-semibold text-docs-text-primary leading-tight">
                    {step.label}
                  </span>
                </div>
                {step.sublabel && (
                  <p className="mt-2 text-[12px] text-docs-text-muted max-w-[130px] text-center leading-snug">
                    {step.sublabel}
                  </p>
                )}
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="flex items-center self-start mt-3 mx-2">
                  <div className="w-8 h-px bg-brand-primary" />
                  <ArrowRight
                    size={14}
                    className="text-brand-primary -ml-0.5"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
