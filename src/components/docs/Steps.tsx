import React from "react";

interface StepProps {
  number?: number;
  title: string;
  children?: React.ReactNode;
}

interface StepsProps {
  children: React.ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  // Rendered by Steps container — number is injected by parent
  return (
    <div
      data-step-title={title}
      data-has-children={children ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export default function Steps({ children }: StepsProps) {
  const steps = React.Children.toArray(children).filter(React.isValidElement);

  return (
    <div className="my-8 space-y-0">
      {steps.map((child, index) => {
        const el = child as React.ReactElement<StepProps>;
        const isLast = index === steps.length - 1;
        const num = index + 1;

        return (
          <div key={index} className="flex gap-4">
            {/* Left column: number + connector line */}
            <div className="flex flex-col items-center shrink-0">
              {/* Circle number */}
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 text-[13px] font-bold shrink-0 z-10"
                style={{
                  borderColor: "hsl(217 100% 61%)",
                  backgroundColor: "hsl(217 100% 61% / 0.08)",
                  color: "hsl(217 100% 61%)",
                }}
              >
                {num}
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className="w-px flex-1 my-1"
                  style={{ backgroundColor: "hsl(214 32% 91%)" }}
                />
              )}
            </div>

            {/* Right column: content */}
            <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-8"}`}>
              <h3 className="text-[16px] font-semibold text-docs-text-primary leading-snug mb-2 mt-0.5">
                {el.props.title}
              </h3>
              {el.props.children && (
                <div className="text-[14px] text-docs-text-secondary leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {el.props.children}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
